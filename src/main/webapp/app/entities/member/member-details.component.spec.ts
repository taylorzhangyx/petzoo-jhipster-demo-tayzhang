/* tslint:disable max-line-length */
import { vitest } from 'vitest';
import { shallowMount, type MountingOptions } from '@vue/test-utils';
import sinon, { type SinonStubbedInstance } from 'sinon';
import { type RouteLocation } from 'vue-router';

import MemberDetails from './member-details.vue';
import MemberService from './member.service';
import AlertService from '@/shared/alert/alert.service';

type MemberDetailsComponentType = InstanceType<typeof MemberDetails>;

let route: Partial<RouteLocation>;
const routerGoMock = vitest.fn();

vitest.mock('vue-router', () => ({
  useRoute: () => route,
  useRouter: () => ({ go: routerGoMock }),
}));

const memberSample = { id: 123 };

describe('Component Tests', () => {
  let alertService: AlertService;

  afterEach(() => {
    vitest.resetAllMocks();
  });

  describe('Member Management Detail Component', () => {
    let memberServiceStub: SinonStubbedInstance<MemberService>;
    let mountOptions: MountingOptions<MemberDetailsComponentType>['global'];

    beforeEach(() => {
      route = {};
      memberServiceStub = sinon.createStubInstance<MemberService>(MemberService);

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
          memberService: () => memberServiceStub,
        },
      };
    });

    describe('Navigate to details', () => {
      it('Should call load all on init', async () => {
        // GIVEN
        memberServiceStub.find.resolves(memberSample);
        route = {
          params: {
            memberId: '' + 123,
          },
        };
        const wrapper = shallowMount(MemberDetails, { global: mountOptions });
        const comp = wrapper.vm;
        // WHEN
        await comp.$nextTick();

        // THEN
        expect(comp.member).toMatchObject(memberSample);
      });
    });

    describe('Previous state', () => {
      it('Should go previous state', async () => {
        memberServiceStub.find.resolves(memberSample);
        const wrapper = shallowMount(MemberDetails, { global: mountOptions });
        const comp = wrapper.vm;
        await comp.$nextTick();

        comp.previousState();
        await comp.$nextTick();

        expect(routerGoMock).toHaveBeenCalledWith(-1);
      });
    });
  });
});
