/* tslint:disable max-line-length */
import { vitest } from 'vitest';
import { shallowMount, type MountingOptions } from '@vue/test-utils';
import sinon, { type SinonStubbedInstance } from 'sinon';

import Label from './label.vue';
import LabelService from './label.service';
import AlertService from '@/shared/alert/alert.service';

type LabelComponentType = InstanceType<typeof Label>;

const bModalStub = {
  render: () => {},
  methods: {
    hide: () => {},
    show: () => {},
  },
};

describe('Component Tests', () => {
  let alertService: AlertService;

  describe('Label Management Component', () => {
    let labelServiceStub: SinonStubbedInstance<LabelService>;
    let mountOptions: MountingOptions<LabelComponentType>['global'];

    beforeEach(() => {
      labelServiceStub = sinon.createStubInstance<LabelService>(LabelService);
      labelServiceStub.retrieve.resolves({ headers: {} });

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
          labelService: () => labelServiceStub,
        },
      };
    });

    describe('Mount', () => {
      it('Should call load all on init', async () => {
        // GIVEN
        labelServiceStub.retrieve.resolves({ headers: {}, data: [{ id: 123 }] });

        // WHEN
        const wrapper = shallowMount(Label, { global: mountOptions });
        const comp = wrapper.vm;
        await comp.$nextTick();

        // THEN
        expect(labelServiceStub.retrieve.calledOnce).toBeTruthy();
        expect(comp.labels[0]).toEqual(expect.objectContaining({ id: 123 }));
      });
    });
    describe('Handles', () => {
      let comp: LabelComponentType;

      beforeEach(async () => {
        const wrapper = shallowMount(Label, { global: mountOptions });
        comp = wrapper.vm;
        await comp.$nextTick();
        labelServiceStub.retrieve.reset();
        labelServiceStub.retrieve.resolves({ headers: {}, data: [] });
      });

      it('Should call delete service on confirmDelete', async () => {
        // GIVEN
        labelServiceStub.delete.resolves({});

        // WHEN
        comp.prepareRemove({ id: 123 });

        comp.removeLabel();
        await comp.$nextTick(); // clear components

        // THEN
        expect(labelServiceStub.delete.called).toBeTruthy();

        // THEN
        await comp.$nextTick(); // handle component clear watch
        expect(labelServiceStub.retrieve.callCount).toEqual(1);
      });
    });
  });
});
