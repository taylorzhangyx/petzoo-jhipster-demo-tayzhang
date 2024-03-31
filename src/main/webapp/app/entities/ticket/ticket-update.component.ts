import { computed, defineComponent, inject, ref, type Ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';
import { useVuelidate } from '@vuelidate/core';

import TicketService from './ticket.service';
import { useValidation } from '@/shared/composables';
import { useAlertService } from '@/shared/alert/alert.service';

import ProjectService from '@/entities/project/project.service';
import { type IProject } from '@/shared/model/project.model';
import UserService from '@/entities/user/user.service';
import LabelService from '@/entities/label/label.service';
import { type ILabel } from '@/shared/model/label.model';
import { type ITicket, Ticket } from '@/shared/model/ticket.model';

export default defineComponent({
  compatConfig: { MODE: 3 },
  name: 'TicketUpdate',
  setup() {
    const ticketService = inject('ticketService', () => new TicketService());
    const alertService = inject('alertService', () => useAlertService(), true);

    const ticket: Ref<ITicket> = ref(new Ticket());

    const projectService = inject('projectService', () => new ProjectService());

    const projects: Ref<IProject[]> = ref([]);
    const userService = inject('userService', () => new UserService());
    const users: Ref<Array<any>> = ref([]);

    const labelService = inject('labelService', () => new LabelService());

    const labels: Ref<ILabel[]> = ref([]);
    const isSaving = ref(false);
    const currentLanguage = inject('currentLanguage', () => computed(() => navigator.language ?? 'zh-cn'), true);

    const route = useRoute();
    const router = useRouter();

    const previousState = () => router.go(-1);

    const retrieveTicket = async ticketId => {
      try {
        const res = await ticketService().find(ticketId);
        ticket.value = res;
      } catch (error) {
        alertService.showHttpError(error.response);
      }
    };

    if (route.params?.ticketId) {
      retrieveTicket(route.params.ticketId);
    }

    const initRelationships = () => {
      projectService()
        .retrieve()
        .then(res => {
          projects.value = res.data;
        });
      userService()
        .retrieve()
        .then(res => {
          users.value = res.data;
        });
      labelService()
        .retrieve()
        .then(res => {
          labels.value = res.data;
        });
    };

    initRelationships();

    const { t: t$ } = useI18n();
    const validations = useValidation();
    const validationRules = {
      title: {
        required: validations.required(t$('entity.validation.required').toString()),
      },
      description: {},
      dueDate: {},
      done: {},
      newEntity: {},
      someInfo: {},
      project: {},
      assignedTo: {},
      labels: {},
    };
    const v$ = useVuelidate(validationRules, ticket as any);
    v$.value.$validate();

    return {
      ticketService,
      alertService,
      ticket,
      previousState,
      isSaving,
      currentLanguage,
      projects,
      users,
      labels,
      v$,
      t$,
    };
  },
  created(): void {
    this.ticket.labels = [];
  },
  methods: {
    save(): void {
      this.isSaving = true;
      if (this.ticket.id) {
        this.ticketService()
          .update(this.ticket)
          .then(param => {
            this.isSaving = false;
            this.previousState();
            this.alertService.showInfo(this.t$('bugTrackerJhipsterApp.ticket.updated', { param: param.id }));
          })
          .catch(error => {
            this.isSaving = false;
            this.alertService.showHttpError(error.response);
          });
      } else {
        this.ticketService()
          .create(this.ticket)
          .then(param => {
            this.isSaving = false;
            this.previousState();
            this.alertService.showSuccess(this.t$('bugTrackerJhipsterApp.ticket.created', { param: param.id }).toString());
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
