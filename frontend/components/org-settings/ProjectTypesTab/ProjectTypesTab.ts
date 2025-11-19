import { defineComponent, ref, onMounted } from 'vue';
import { projectApi } from '@/composables/api/projectApi';
import type { ProjectType } from '@/components/views/OrgSettingsView/OrgSettingsView';
import ProjectTypeModal from '@/components/modals/ProjectTypeModal/ProjectTypeModal.vue';

export default defineComponent({
  name: 'ProjectTypesTab',
  components: {
    ProjectTypeModal,
  },
  setup() {
    const projectTypes = ref<ProjectType[]>([]);
    const projectTypesLoading = ref(false);
    const showCreateProjectTypeModal = ref(false);
    const showEditProjectTypeModal = ref(false);
    const selectedProjectType = ref<ProjectType | null>(null);

    const loadProjectTypes = async () => {
      projectTypesLoading.value = true;
      try {
        const response = await projectApi.getProjectTypes();
        projectTypes.value = response.data || [];
      } catch (error) {
        console.error('Failed to load project types:', error);
      } finally {
        projectTypesLoading.value = false;
      }
    };

    const editProjectType = (projectType: ProjectType) => {
      selectedProjectType.value = projectType;
      showEditProjectTypeModal.value = true;
    };

    const deleteProjectType = async (projectType: ProjectType) => {
      if (!confirm(`Are you sure you want to delete "${projectType.name}"?`)) {
        return;
      }
      try {
        await projectApi.deleteProjectType(projectType.id.toString());
        await loadProjectTypes();
      } catch (error) {
        console.error('Failed to delete project type:', error);
        alert('Failed to delete project type. Please try again.');
      }
    };

    const closeProjectTypeModal = () => {
      showCreateProjectTypeModal.value = false;
      showEditProjectTypeModal.value = false;
      selectedProjectType.value = null;
    };

    const handleProjectTypeSaved = () => {
      loadProjectTypes();
      closeProjectTypeModal();
    };

    onMounted(() => {
      loadProjectTypes();
    });

    return {
      projectTypes,
      projectTypesLoading,
      showCreateProjectTypeModal,
      showEditProjectTypeModal,
      selectedProjectType,
      editProjectType,
      deleteProjectType,
      closeProjectTypeModal,
      handleProjectTypeSaved,
    };
  },
});
