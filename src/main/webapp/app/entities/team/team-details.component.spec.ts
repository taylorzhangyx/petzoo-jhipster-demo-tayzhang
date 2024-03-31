/* tslint:disable max-line-length */
import { vitest } from 'vitest';
import { shallowMount, type MountingOptions } from '@vue/test-utils';
import sinon, { type SinonStubbedInstance } from 'sinon';
import { type RouteLocation } from 'vue-router';

import TeamDetails from './team-details.vue';
import TeamService from './team.service';
import AlertService from '@/shared/alert/alert.service';

type TeamDetailsComponentType = InstanceType<typeof TeamDetails>;

let route: Partial<RouteLocation>;
const routerGoMock = vitest.fn();

vitest.mock('vue-router', () => ({
  useRoute: () => route,
  useRouter: () => ({ go: routerGoMock }),
}));

const teamSample = { id: 123 };

describe('Component Tests', () => {
  let alertService: AlertService;

  afterEach(() => {
    vitest.resetAllMocks();
  });

  describe('Team Management Detail Component', () => {
    let teamServiceStub: SinonStubbedInstance<TeamService>;
    let mountOptions: MountingOptions<TeamDetailsComponentType>['global'];

    beforeEach(() => {
      route = {};
      teamServiceStub = sinon.createStubInstance<TeamService>(TeamService);

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
          teamService: () => teamServiceStub,
        },
      };
    });

    describe('Navigate to details', () => {
      it('Should call load all on init', async () => {
        // GIVEN
        teamServiceStub.find.resolves(teamSample);
        route = {
          params: {
            teamId: '' + 123,
          },
        };
        const wrapper = shallowMount(TeamDetails, { global: mountOptions });
        const comp = wrapper.vm;
        // WHEN
        await comp.$nextTick();

        // THEN
        expect(comp.team).toMatchObject(teamSample);
      });
    });

    describe('Previous state', () => {
      it('Should go previous state', async () => {
        teamServiceStub.find.resolves(teamSample);
        const wrapper = shallowMount(TeamDetails, { global: mountOptions });
        const comp = wrapper.vm;
        await comp.$nextTick();

        comp.previousState();
        await comp.$nextTick();

        expect(routerGoMock).toHaveBeenCalledWith(-1);
      });
    });
  });
});
