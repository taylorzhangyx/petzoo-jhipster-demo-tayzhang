/* tslint:disable max-line-length */
import { vitest } from 'vitest';
import { shallowMount, type MountingOptions } from '@vue/test-utils';
import sinon, { type SinonStubbedInstance } from 'sinon';
import { type RouteLocation } from 'vue-router';

import TicketDetails from './ticket-details.vue';
import TicketService from './ticket.service';
import AlertService from '@/shared/alert/alert.service';

type TicketDetailsComponentType = InstanceType<typeof TicketDetails>;

let route: Partial<RouteLocation>;
const routerGoMock = vitest.fn();

vitest.mock('vue-router', () => ({
  useRoute: () => route,
  useRouter: () => ({ go: routerGoMock }),
}));

const ticketSample = { id: 123 };

describe('Component Tests', () => {
  let alertService: AlertService;

  afterEach(() => {
    vitest.resetAllMocks();
  });

  describe('Ticket Management Detail Component', () => {
    let ticketServiceStub: SinonStubbedInstance<TicketService>;
    let mountOptions: MountingOptions<TicketDetailsComponentType>['global'];

    beforeEach(() => {
      route = {};
      ticketServiceStub = sinon.createStubInstance<TicketService>(TicketService);

      alertService = new AlertService({
        i18n: { t: vitest.fn() } as any,
        bvToast: {
          toast: vitest.fn(),
        } as any,
      });

      mountOptions = {
        stubs: {
          'font-awesome-icon': true,
          'router-link': true,
        },
        provide: {
          alertService,
          ticketService: () => ticketServiceStub,
        },
      };
    });

    describe('Navigate to details', () => {
      it('Should call load all on init', async () => {
        // GIVEN
        ticketServiceStub.find.resolves(ticketSample);
        route = {
          params: {
            ticketId: '' + 123,
          },
        };
        const wrapper = shallowMount(TicketDetails, { global: mountOptions });
        const comp = wrapper.vm;
        // WHEN
        await comp.$nextTick();

        // THEN
        expect(comp.ticket).toMatchObject(ticketSample);
      });
    });

    describe('Previous state', () => {
      it('Should go previous state', async () => {
        ticketServiceStub.find.resolves(ticketSample);
        const wrapper = shallowMount(TicketDetails, { global: mountOptions });
        const comp = wrapper.vm;
        await comp.$nextTick();

        comp.previousState();
        await comp.$nextTick();

        expect(routerGoMock).toHaveBeenCalledWith(-1);
      });
    });
  });
});
