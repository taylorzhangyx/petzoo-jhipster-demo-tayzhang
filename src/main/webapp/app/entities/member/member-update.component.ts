import { computed, defineComponent, inject, ref, type Ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';
import { useVuelidate } from '@vuelidate/core';

import MemberService from './member.service';
import { useValidation } from '@/shared/composables';
import { useAlertService } from '@/shared/alert/alert.service';

import { type IMember, Member } from '@/shared/model/member.model';

export default defineComponent({
  compatConfig: { MODE: 3 },
  name: 'MemberUpdate',
  setup() {
    const memberService = inject('memberService', () => new MemberService());
    const alertService = inject('alertService', () => useAlertService(), true);

    const member: Ref<IMember> = ref(new Member());
    const isSaving = ref(false);
    const currentLanguage = inject('currentLanguage', () => computed(() => navigator.language ?? 'zh-cn'), true);

    const route = useRoute();
    const router = useRouter();

    const previousState = () => router.go(-1);

    const retrieveMember = async memberId => {
      try {
        const res = await memberService().find(memberId);
        member.value = res;
      } catch (error) {
        alertService.showHttpError(error.response);
      }
    };

    if (route.params?.memberId) {
      retrieveMember(route.params.memberId);
    }

    const { t: t$ } = useI18n();
    const validations = useValidation();
    const validationRules = {
      nickName: {},
    };
    const v$ = useVuelidate(validationRules, member as any);
    v$.value.$validate();

    return {
      memberService,
      alertService,
      member,
      previousState,
      isSaving,
      currentLanguage,
      v$,
      t$,
    };
  },
  created(): void {},
  methods: {
    save(): void {
      this.isSaving = true;
      if (this.member.id) {
        this.memberService()
          .update(this.member)
          .then(param => {
            this.isSaving = false;
            this.previousState();
            this.alertService.showInfo(this.t$('bugTrackerJhipsterApp.member.updated', { param: param.id }));
          })
          .catch(error => {
            this.isSaving = false;
            this.alertService.showHttpError(error.response);
          });
      } else {
        this.memberService()
          .create(this.member)
          .then(param => {
            this.isSaving = false;
            this.previousState();
            this.alertService.showSuccess(this.t$('bugTrackerJhipsterApp.member.created', { param: param.id }).toString());
          })
          .catch(error => {
            this.isSaving = false;
            this.alertService.showHttpError(error.response);
          });
      }
    },
  },
});
