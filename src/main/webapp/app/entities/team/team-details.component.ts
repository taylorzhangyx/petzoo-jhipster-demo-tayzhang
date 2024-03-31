import { defineComponent, inject, ref, type Ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';

import TeamService from './team.service';
import { type ITeam } from '@/shared/model/team.model';
import { useAlertService } from '@/shared/alert/alert.service';

export default defineComponent({
  compatConfig: { MODE: 3 },
  name: 'TeamDetails',
  setup() {
    const teamService = inject('teamService', () => new TeamService());
    const alertService = inject('alertService', () => useAlertService(), true);

    const route = useRoute();
    const router = useRouter();

    const previousState = () => router.go(-1);
    const team: Ref<ITeam> = ref({});

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

    return {
      alertService,
      team,

      previousState,
      t$: useI18n().t,
    };
  },
});
