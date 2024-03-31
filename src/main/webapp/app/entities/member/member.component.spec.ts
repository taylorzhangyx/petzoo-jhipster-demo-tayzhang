/* tslint:disable max-line-length */
import { vitest } from 'vitest';
import { shallowMount, type MountingOptions } from '@vue/test-utils';
import sinon, { type SinonStubbedInstance } from 'sinon';

import Member from './member.vue';
import MemberService from './member.service';
import AlertService from '@/shared/alert/alert.service';

type MemberComponentType = InstanceType<typeof Member>;

const bModalStub = {
  render: () => {},
  methods: {
    hide: () => {},
    show: () => {},
  },
};

describe('Component Tests', () => {
  let alertService: AlertService;

  describe('Member Management Component', () => {
    let memberServiceStub: SinonStubbedInstance<MemberService>;
    let mountOptions: MountingOptions<MemberComponentType>['global'];

    beforeEach(() => {
      memberServiceStub = sinon.createStubInstance<MemberService>(MemberService);
      memberServiceStub.retrieve.resolves({ headers: {} });

      alertService = new AlertService({
        i18n: { t: vitest.fn() } as any,
        bvToast: {
          toast: vitest.fn(),
        } as any,
      });

      mountOptions = {
        stubs: {
          bModal: bModalStub as any,
          'font-awesome-icon': true,
          'b-badge': true,
          'b-button': true,
          'router-link': true,
        },
        directives: {
          'b-modal': {},
        },
        provide: {
          alertService,
          memberService: () => memberServiceStub,
        },
      };
    });

    describe('Mount', () => {
      it('Should call load all on init', async () => {
        // GIVEN
        memberServiceStub.retrieve.resolves({ headers: {}, data: [{ id: 123 }] });

        // WHEN
        const wrapper = shallowMount(Member, { global: mountOptions });
        const comp = wrapper.vm;
        await comp.$nextTick();

        // THEN
        expect(memberServiceStub.retrieve.calledOnce).toBeTruthy();
        expect(comp.members[0]).toEqual(expect.objectContaining({ id: 123 }));
      });
    });
    describe('Handles', () => {
      let comp: MemberComponentType;

      beforeEach(async () => {
        const wrapper = shallowMount(Member, { global: mountOptions });
        comp = wrapper.vm;
        await comp.$nextTick();
        memberServiceStub.retrieve.reset();
        memberServiceStub.retrieve.resolves({ headers: {}, data: [] });
      });

      it('Should call delete service on confirmDelete', async () => {
        // GIVEN
        memberServiceStub.delete.resolves({});

        // WHEN
        comp.prepareRemove({ id: 123 });

        comp.removeMember();
        await comp.$nextTick(); // clear components

        // THEN
        expect(memberServiceStub.delete.called).toBeTruthy();

        // THEN
        await comp.$nextTick(); // handle component clear watch
        expect(memberServiceStub.retrieve.callCount).toEqual(1);
      });
    });
  });
});
