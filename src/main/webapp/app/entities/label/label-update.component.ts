import { computed, defineComponent, inject, ref, type Ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';
import { useVuelidate } from '@vuelidate/core';

import LabelService from './label.service';
import { useValidation } from '@/shared/composables';
import { useAlertService } from '@/shared/alert/alert.service';

import TicketService from '@/entities/ticket/ticket.service';
import { type ITicket } from '@/shared/model/ticket.model';
import { type ILabel, Label } from '@/shared/model/label.model';

export default defineComponent({
  compatConfig: { MODE: 3 },
  name: 'LabelUpdate',
  setup() {
    const labelService = inject('labelService', () => new LabelService());
    const alertService = inject('alertService', () => useAlertService(), true);

    const label: Ref<ILabel> = ref(new Label());

    const ticketService = inject('ticketService', () => new TicketService());

    const tickets: Ref<ITicket[]> = ref([]);
    const isSaving = ref(false);
    const currentLanguage = inject('currentLanguage', () => computed(() => navigator.language ?? 'zh-cn'), true);

    const route = useRoute();
    const router = useRouter();

    const previousState = () => router.go(-1);

    const retrieveLabel = async labelId => {
      try {
        const res = await labelService().find(labelId);
        label.value = res;
      } catch (error) {
        alertService.showHttpError(error.response);
      }
    };

    if (route.params?.labelId) {
      retrieveLabel(route.params.labelId);
    }

    const initRelationships = () => {
      ticketService()
        .retrieve()
        .then(res => {
          tickets.value = res.data;
        });
    };

    initRelationships();

    const { t: t$ } = useI18n();
    const validations = useValidation();
    const validationRules = {
      label: {
        minLength: validations.minLength(t$('entity.validation.minlength', { min: 3 }).toString(), 3),
      },
      desc: {
        minLength: validations.minLength(t$('entity.validation.minlength', { min: 5 }).toString(), 5),
      },
      fakeNumber: {},
      someFaker: {},
      tickets: {},
    };
    const v$ = useVuelidate(validationRules, label as any);
    v$.value.$validate();

    return {
      labelService,
      alertService,
      label,
      previousState,
      isSaving,
      currentLanguage,
      tickets,
      v$,
      t$,
    };
  },
  created(): void {
    this.label.tickets = [];
  },
  methods: {
    save(): void {
      this.isSaving = true;
      if (this.label.id) {
        this.labelService()
          .update(this.label)
          .then(param => {
            this.isSaving = false;
            this.previousState();
            this.alertService.showInfo(this.t$('bugTrackerJhipsterApp.label.updated', { param: param.id }));
          })
          .catch(error => {
            this.isSaving = false;
            this.alertService.showHttpError(error.response);
          });
      } else {
        this.labelService()
          .create(this.label)
          .then(param => {
            this.isSaving = false;
            this.previousState();
            this.alertService.showSuccess(this.t$('bugTrackerJhipsterApp.label.created', { param: param.id }).toString());
          })
          .catch(error => {
            this.isSaving = false;
            this.alertService.showHttpError(error.response);
          });
      }
    },

    getSelected(selectedVals, option, pkField = 'id'): any {
      if (selectedVals) {
        return selectedVals.find(value => option[pkField] === value[pkField]) ?? option;
      }
      return option;
    },
  },
});
