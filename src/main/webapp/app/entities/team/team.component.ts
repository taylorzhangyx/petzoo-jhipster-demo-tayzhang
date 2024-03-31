import { defineComponent, inject, onMounted, ref, type Ref } from 'vue';
import { useI18n } from 'vue-i18n';

import TeamService from './team.service';
import { type ITeam } from '@/shared/model/team.model';
import { useAlertService } from '@/shared/alert/alert.service';

export default defineComponent({
  compatConfig: { MODE: 3 },
  name: 'Team',
  setup() {
    const { t: t$ } = useI18n();
    const teamService = inject('teamService', () => new TeamService());
    const alertService = inject('alertService', () => useAlertService(), true);

    const teams: Ref<ITeam[]> = ref([]);

    const isFetching = ref(false);

    const clear = () => {};

    const retrieveTeams = async () => {
      isFetching.value = true;
      try {
        const res = await teamService().retrieve();
        teams.value = res.data;
      } catch (err) {
        alertService.showHttpError(err.response);
      } finally {
        isFetching.value = false;
      }
    };

    const handleSyncList = () => {
      retrieveTeams();
    };

    onMounted(async () => {
      await retrieveTeams();
    });

    const removeId: Ref<number> = ref(null);
    const removeEntity = ref<any>(null);
    const prepareRemove = (instance: ITeam) => {
      removeId.value = instance.id;
      removeEntity.value.show();
    };
    const closeDialog = () => {
      removeEntity.value.hide();
    };
    const removeTeam = async () => {
      try {
        await teamService().delete(removeId.value);
        const message = t$('bugTrackerJhipsterApp.team.deleted', { param: removeId.value }).toString();
        alertService.showInfo(message, { variant: 'danger' });
        removeId.value = null;
        retrieveTeams();
        closeDialog();
      } catch (error) {
        alertService.showHttpError(error.response);
      }
    };

    return {
      teams,
      handleSyncList,
      isFetching,
      retrieveTeams,
      clear,
      removeId,
      removeEntity,
      prepareRemove,
      closeDialog,
      removeTeam,
      t$,
    };
  },
});
