import { computed, defineComponent, inject, ref, type Ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';
import { useVuelidate } from '@vuelidate/core';

import TeamService from './team.service';
import { useValidation } from '@/shared/composables';
import { useAlertService } from '@/shared/alert/alert.service';

import { type ITeam, Team } from '@/shared/model/team.model';

export default defineComponent({
  compatConfig: { MODE: 3 },
  name: 'TeamUpdate',
  setup() {
    const teamService = inject('teamService', () => new TeamService());
    const alertService = inject('alertService', () => useAlertService(), true);

    const team: Ref<ITeam> = ref(new Team());
    const isSaving = ref(false);
    const currentLanguage = inject('currentLanguage', () => computed(() => navigator.language ?? 'zh-cn'), true);

    const route = useRoute();
    const router = useRouter();

    const previousState = () => router.go(-1);

    const retrieveTeam = async teamId => {
      try {
        const res = await teamService().find(teamId);
        team.value = res;
      } catch (error) {
        alertService.showHttpError(error.response);
      }
    };

    if (route.params?.teamId) {
      retrieveTeam(route.params.teamId);
    }

    const { t: t$ } = useI18n();
    const validations = useValidation();
    const validationRules = {
      name: {},
      description: {},
    };
    const v$ = useVuelidate(validationRules, team as any);
    v$.value.$validate();

    return {
      teamService,
      alertService,
      team,
      previousState,
      isSaving,
      currentLanguage,
      v$,
      t$,
    };
  },
  created(): void {},
  methods: {
    save(): void {
      this.isSaving = true;
      if (this.team.id) {
        this.teamService()
          .update(this.team)
          .then(param => {
            this.isSaving = false;
            this.previousState();
            this.alertService.showInfo(this.t$('bugTrackerJhipsterApp.team.updated', { param: param.id }));
          })
          .catch(error => {
            this.isSaving = false;
            this.alertService.showHttpError(error.response);
          });
      } else {
        this.teamService()
          .create(this.team)
          .then(param => {
            this.isSaving = false;
            this.previousState();
            this.alertService.showSuccess(this.t$('bugTrackerJhipsterApp.team.created', { param: param.id }).toString());
          })
          .catch(error => {
            this.isSaving = false;
            this.alertService.showHttpError(error.response);
          });
      }
    },
  },
});
