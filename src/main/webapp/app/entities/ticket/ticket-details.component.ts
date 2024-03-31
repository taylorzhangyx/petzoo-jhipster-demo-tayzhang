import { defineComponent, inject, ref, type Ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';

import TicketService from './ticket.service';
import { type ITicket } from '@/shared/model/ticket.model';
import { useAlertService } from '@/shared/alert/alert.service';

export default defineComponent({
  compatConfig: { MODE: 3 },
  name: 'TicketDetails',
  setup() {
    const ticketService = inject('ticketService', () => new TicketService());
    const alertService = inject('alertService', () => useAlertService(), true);

    const route = useRoute();
    const router = useRouter();

    const previousState = () => router.go(-1);
    const ticket: Ref<ITicket> = ref({});

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

    return {
      alertService,
      ticket,

      previousState,
      t$: useI18n().t,
    };
  },
});
