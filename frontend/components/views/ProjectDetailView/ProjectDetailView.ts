import { defineComponent, ref, computed, onMounted, watch } from 'vue';
import type { Project } from '~/types';

export default defineComponent({
  name: 'ProjectDetailView',
  props: {
    projectId: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const { $projectApi } = useNuxtApp();
    const route = useRoute();

    // Reactive data
    const project = ref<Project | null>(null);
    const loading = ref(false);
    const activeTab = ref('overview');

    // Tab configuration
    const tabs = ref([
      { id: 'overview', name: 'Overview' },
      { id: 'task_list', name: 'Task list' },
      { id: 'activity', name: 'Activity' },
      { id: 'client', name: 'Client' },
      { id: 'hour_report', name: 'Hour report' },
    ]);

    // Computed
    const isDev = computed(() => import.meta.dev);

    // Methods
    const loadProject = async () => {
      try {
        loading.value = true;

        console.log('Loading project with ID:', props.projectId);
        const response = await $projectApi.getProject(props.projectId);
        console.log('API Response:', response);
        project.value = response;
      } catch (err: any) {
        console.error('Failed to load project:', err);
        showError({
          statusCode: err.status || 500,
          statusMessage: err.statusText || 'Error',
          message: err.message || 'Failed to load project',
        });
      } finally {
        loading.value = false;
      }
    };

    const handleTaskSaved = () => {
      // Task list component will handle its own reload
    };

    const handleProjectUpdated = (updatedProject: Project) => {
      project.value = updatedProject;
    };

    const handleDescriptionUpdated = (description: string) => {
      if (project.value) {
        project.value.description = description;
      }
    };

    const getCompanyInitials = (companyName: string): string => {
      if (!companyName) return '?';
      return companyName
        .split(' ')
        .map((word) => word[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
    };

    // Lifecycle
    onMounted(() => {
      loadProject();
    });

    // Watch for route changes
    watch(
      () => route.params.id,
      (newId) => {
        if (newId) {
          loadProject();
        }
      }
    );

    return {
      project,
      loading,
      activeTab,
      tabs,
      isDev,
      loadProject,
      handleTaskSaved,
      handleProjectUpdated,
      handleDescriptionUpdated,
      getCompanyInitials,
    };
  },
});
