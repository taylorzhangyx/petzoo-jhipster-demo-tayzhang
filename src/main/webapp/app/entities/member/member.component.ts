import { defineComponent, inject, onMounted, ref, type Ref } from 'vue';
import { useI18n } from 'vue-i18n';

import MemberService from './member.service';
import { type IMember } from '@/shared/model/member.model';
import { useAlertService } from '@/shared/alert/alert.service';

export default defineComponent({
  compatConfig: { MODE: 3 },
  name: 'Member',
  setup() {
    const { t: t$ } = useI18n();
    const memberService = inject('memberService', () => new MemberService());
    const alertService = inject('alertService', () => useAlertService(), true);

    const members: Ref<IMember[]> = ref([]);

    const isFetching = ref(false);

    const clear = () => {};

    const retrieveMembers = async () => {
      isFetching.value = true;
      try {
        const res = await memberService().retrieve();
        members.value = res.data;
      } catch (err) {
        alertService.showHttpError(err.response);
      } finally {
        isFetching.value = false;
      }
    };

    const handleSyncList = () => {
      retrieveMembers();
    };

    onMounted(async () => {
      await retrieveMembers();
    });

    const removeId: Ref<number> = ref(null);
    const removeEntity = ref<any>(null);
    const prepareRemove = (instance: IMember) => {
      removeId.value = instance.id;
      removeEntity.value.show();
    };
    const closeDialog = () => {
      removeEntity.value.hide();
    };
    const removeMember = async () => {
      try {
        await memberService().delete(removeId.value);
        const message = t$('bugTrackerJhipsterApp.member.deleted', { param: removeId.value }).toString();
        alertService.showInfo(message, { variant: 'danger' });
        removeId.value = null;
        retrieveMembers();
        closeDialog();
      } catch (error) {
        alertService.showHttpError(error.response);
      }
    };

    return {
      members,
      handleSyncList,
      isFetching,
      retrieveMembers,
      clear,
      removeId,
      removeEntity,
      prepareRemove,
      closeDialog,
      removeMember,
      t$,
    };
  },
});
