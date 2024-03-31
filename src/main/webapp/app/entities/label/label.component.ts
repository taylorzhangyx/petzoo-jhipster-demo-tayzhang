import { defineComponent, inject, onMounted, ref, type Ref } from 'vue';
import { useI18n } from 'vue-i18n';

import LabelService from './label.service';
import { type ILabel } from '@/shared/model/label.model';
import { useAlertService } from '@/shared/alert/alert.service';

export default defineComponent({
  compatConfig: { MODE: 3 },
  name: 'Label',
  setup() {
    const { t: t$ } = useI18n();
    const labelService = inject('labelService', () => new LabelService());
    const alertService = inject('alertService', () => useAlertService(), true);

    const labels: Ref<ILabel[]> = ref([]);

    const isFetching = ref(false);

    const clear = () => {};

    const retrieveLabels = async () => {
      isFetching.value = true;
      try {
        const res = await labelService().retrieve();
        labels.value = res.data;
      } catch (err) {
        alertService.showHttpError(err.response);
      } finally {
        isFetching.value = false;
      }
    };

    const handleSyncList = () => {
      retrieveLabels();
    };

    onMounted(async () => {
      await retrieveLabels();
    });

    const removeId: Ref<number> = ref(null);
    const removeEntity = ref<any>(null);
    const prepareRemove = (instance: ILabel) => {
      removeId.value = instance.id;
      removeEntity.value.show();
    };
    const closeDialog = () => {
      removeEntity.value.hide();
    };
    const removeLabel = async () => {
      try {
        await labelService().delete(removeId.value);
        const message = t$('bugTrackerJhipsterApp.label.deleted', { param: removeId.value }).toString();
        alertService.showInfo(message, { variant: 'danger' });
        removeId.value = null;
        retrieveLabels();
        closeDialog();
      } catch (error) {
        alertService.showHttpError(error.response);
      }
    };

    return {
      labels,
      handleSyncList,
      isFetching,
      retrieveLabels,
      clear,
      removeId,
      removeEntity,
      prepareRemove,
      closeDialog,
      removeLabel,
      t$,
    };
  },
});
