import { computed, defineComponent, inject, ref, type Ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';
import { useVuelidate } from '@vuelidate/core';

import ProjectService from './project.service';
import { useValidation } from '@/shared/composables';
import { useAlertService } from '@/shared/alert/alert.service';

import TeamService from '@/entities/team/team.service';
import { type ITeam } from '@/shared/model/team.model';
import { type IProject, Project } from '@/shared/model/project.model';

export default defineComponent({
  compatConfig: { MODE: 3 },
  name: 'ProjectUpdate',
  setup() {
    const projectService = inject('projectService', () => new ProjectService());
    const alertService = inject('alertService', () => useAlertService(), true);

    const project: Ref<IProject> = ref(new Project());

    const teamService = inject('teamService', () => new TeamService());

    const teams: Ref<ITeam[]> = ref([]);
    const isSaving = ref(false);
    const currentLanguage = inject('currentLanguage', () => computed(() => navigator.language ?? 'zh-cn'), true);

    const route = useRoute();
    const router = useRouter();

    const previousState = () => router.go(-1);

    const retrieveProject = async projectId => {
      try {
        const res = await projectService().find(projectId);
        project.value = res;
      } catch (error) {
        alertService.showHttpError(error.response);
      }
    };

    if (route.params?.projectId) {
      retrieveProject(route.params.projectId);
    }

    const initRelationships = () => {
      teamService()
        .retrieve()
        .then(res => {
          teams.value = res.data;
        });
    };

    initRelationships();

    const { t: t$ } = useI18n();
    const validations = useValidation();
    const validationRules = {
      name: {},
      description: {},
      owner: {},
    };
    const v$ = useVuelidate(validationRules, project as any);
    v$.value.$validate();

    return {
      projectService,
      alertService,
      project,
      previousState,
      isSaving,
      currentLanguage,
      teams,
      v$,
      t$,
    };
  },
  created(): void {},
  methods: {
    save(): void {
      this.isSaving = true;
      if (this.project.id) {
        this.projectService()
          .update(this.project)
          .then(param => {
            this.isSaving = false;
            this.previousState();
            this.alertService.showInfo(this.t$('bugTrackerJhipsterApp.project.updated', { param: param.id }));
          })
          .catch(error => {
            this.isSaving = false;
            this.alertService.showHttpError(error.response);
          });
      } else {
        this.projectService()
          .create(this.project)
          .then(param => {
            this.isSaving = false;
            this.previousState();
            this.alertService.showSuccess(this.t$('bugTrackerJhipsterApp.project.created', { param: param.id }).toString());
          })
          .catch(error => {
            this.isSaving = false;
            this.alertService.showHttpError(error.response);
          });
      }
    },
  },
});
