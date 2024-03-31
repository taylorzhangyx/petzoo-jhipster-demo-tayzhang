/* tslint:disable max-line-length */
import { vitest } from 'vitest';
import { shallowMount, type MountingOptions } from '@vue/test-utils';
import sinon, { type SinonStubbedInstance } from 'sinon';
import { type RouteLocation } from 'vue-router';

import MemberUpdate from './member-update.vue';
import MemberService from './member.service';
import AlertService from '@/shared/alert/alert.service';

type MemberUpdateComponentType = InstanceType<typeof MemberUpdate>;

let route: Partial<RouteLocation>;
const routerGoMock = vitest.fn();

vitest.mock('vue-router', () => ({
  useRoute: () => route,
  useRouter: () => ({ go: routerGoMock }),
}));

const memberSample = { id: 123 };

describe('Component Tests', () => {
  let mountOptions: MountingOptions<MemberUpdateComponentType>['global'];
  let alertService: AlertService;

  describe('Member Management Update Component', () => {
    let comp: MemberUpdateComponentType;
    let memberServiceStub: SinonStubbedInstance<MemberService>;

    beforeEach(() => {
      route = {};
      memberServiceStub = sinon.createStubInstance<MemberService>(MemberService);
      memberServiceStub.retrieve.onFirstCall().resolves(Promise.resolve([]));

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
          memberService: () => memberServiceStub,
        },
      };
    });

    afterEach(() => {
      vitest.resetAllMocks();
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', async () => {
        // GIVEN
        const wrapper = shallowMount(MemberUpdate, { global: mountOptions });
        comp = wrapper.vm;
        comp.member = memberSample;
        memberServiceStub.update.resolves(memberSample);

        // WHEN
        comp.save();
        await comp.$nextTick();

        // THEN
        expect(memberServiceStub.update.calledWith(memberSample)).toBeTruthy();
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', async () => {
        // GIVEN
        const entity = {};
        memberServiceStub.create.resolves(entity);
        const wrapper = shallowMount(MemberUpdate, { global: mountOptions });
        comp = wrapper.vm;
        comp.member = entity;

        // WHEN
        comp.save();
        await comp.$nextTick();

        // THEN
        expect(memberServiceStub.create.calledWith(entity)).toBeTruthy();
        expect(comp.isSaving).toEqual(false);
      });
    });

    describe('Before route enter', () => {
      it('Should retrieve data', async () => {
        // GIVEN
        memberServiceStub.find.resolves(memberSample);
        memberServiceStub.retrieve.resolves([memberSample]);

        // WHEN
        route = {
          params: {
            memberId: '' + memberSample.id,
          },
        };
        const wrapper = shallowMount(MemberUpdate, { global: mountOptions });
        comp = wrapper.vm;
        await comp.$nextTick();

        // THEN
        expect(comp.member).toMatchObject(memberSample);
      });
    });

    describe('Previous state', () => {
      it('Should go previous state', async () => {
        memberServiceStub.find.resolves(memberSample);
        const wrapper = shallowMount(MemberUpdate, { global: mountOptions });
        comp = wrapper.vm;
        await comp.$nextTick();

        comp.previousState();
        await comp.$nextTick();

        expect(routerGoMock).toHaveBeenCalledWith(-1);
      });
    });
  });
});
