/* tslint:disable max-line-length */
import { vitest } from 'vitest';
import { shallowMount, type MountingOptions } from '@vue/test-utils';
import sinon, { type SinonStubbedInstance } from 'sinon';
import { type RouteLocation } from 'vue-router';

import TicketUpdate from './ticket-update.vue';
import TicketService from './ticket.service';
import AlertService from '@/shared/alert/alert.service';

import ProjectService from '@/entities/project/project.service';

import UserService from '@/entities/user/user.service';
import LabelService from '@/entities/label/label.service';

type TicketUpdateComponentType = InstanceType<typeof TicketUpdate>;

let route: Partial<RouteLocation>;
const routerGoMock = vitest.fn();

vitest.mock('vue-router', () => ({
  useRoute: () => route,
  useRouter: () => ({ go: routerGoMock }),
}));

const ticketSample = { id: 123 };

describe('Component Tests', () => {
  let mountOptions: MountingOptions<TicketUpdateComponentType>['global'];
  let alertService: AlertService;

  describe('Ticket Management Update Component', () => {
    let comp: TicketUpdateComponentType;
    let ticketServiceStub: SinonStubbedInstance<TicketService>;

    beforeEach(() => {
      route = {};
      ticketServiceStub = sinon.createStubInstance<TicketService>(TicketService);
      ticketServiceStub.retrieve.onFirstCall().resolves(Promise.resolve([]));

      alertService = new AlertService({
        i18n: { t: vitest.fn() } as any,
        bvToast: {
          toast: vitest.fn(),
        } as any,
      });

      mountOptions = {
        stubs: {
          'font-awesome-icon': true,
          'b-input-group': true,
          'b-input-group-prepend': true,
          'b-form-datepicker': true,
          'b-form-input': true,
        },
        provide: {
          alertService,
          ticketService: () => ticketServiceStub,
          projectService: () =>
            sinon.createStubInstance<ProjectService>(ProjectService, {
              retrieve: sinon.stub().resolves({}),
            } as any),

          userService: () =>
            sinon.createStubInstance<UserService>(UserService, {
              retrieve: sinon.stub().resolves({}),
            } as any),
          labelService: () =>
            sinon.createStubInstance<LabelService>(LabelService, {
              retrieve: sinon.stub().resolves({}),
            } as any),
        },
      };
    });

    afterEach(() => {
      vitest.resetAllMocks();
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', async () => {
        // GIVEN
        const wrapper = shallowMount(TicketUpdate, { global: mountOptions });
        comp = wrapper.vm;
        comp.ticket = ticketSample;
        ticketServiceStub.update.resolves(ticketSample);

        // WHEN
        comp.save();
        await comp.$nextTick();

        // THEN
        expect(ticketServiceStub.update.calledWith(ticketSample)).toBeTruthy();
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', async () => {
        // GIVEN
        const entity = {};
        ticketServiceStub.create.resolves(entity);
        const wrapper = shallowMount(TicketUpdate, { global: mountOptions });
        comp = wrapper.vm;
        comp.ticket = entity;

        // WHEN
        comp.save();
        await comp.$nextTick();

        // THEN
        expect(ticketServiceStub.create.calledWith(entity)).toBeTruthy();
        expect(comp.isSaving).toEqual(false);
      });
    });

    describe('Before route enter', () => {
      it('Should retrieve data', async () => {
        // GIVEN
        ticketServiceStub.find.resolves(ticketSample);
        ticketServiceStub.retrieve.resolves([ticketSample]);

        // WHEN
        route = {
          params: {
            ticketId: '' + ticketSample.id,
          },
        };
        const wrapper = shallowMount(TicketUpdate, { global: mountOptions });
        comp = wrapper.vm;
        await comp.$nextTick();

        // THEN
        expect(comp.ticket).toMatchObject(ticketSample);
      });
    });

    describe('Previous state', () => {
      it('Should go previous state', async () => {
        ticketServiceStub.find.resolves(ticketSample);
        const wrapper = shallowMount(TicketUpdate, { global: mountOptions });
        comp = wrapper.vm;
        await comp.$nextTick();

        comp.previousState();
        await comp.$nextTick();

        expect(routerGoMock).toHaveBeenCalledWith(-1);
      });
    });
  });
});
