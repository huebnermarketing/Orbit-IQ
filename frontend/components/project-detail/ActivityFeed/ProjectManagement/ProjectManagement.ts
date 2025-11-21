import { defineComponent, ref } from 'vue';
import type { Project } from '~/types';

export default defineComponent({
  name: 'ProjectManagement',
  props: {
    project: {
      type: Object as () => Project | null,
      default: null,
    },
    projectId: {
      type: String,
      required: true,
    },
  },
  emits: ['project-updated'],
  setup(props, { emit }) {
    const { $projectApi } = useNuxtApp();

    const isEditingProjectManagement = ref(false);
    const savingProjectManagement = ref(false);
    const loadingProjectManagement = ref(false);
    const originalProjectManagement = ref<any>(null);
    const editingProjectManagement = ref<any>(null);

    const getInitials = (name: string): string => {
      if (!name) return '?';
      return name
        .split(' ')
        .map((word) => word[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
    };

    const formatDate = (date: string): string => {
      return new Date(date).toLocaleDateString();
    };

    const enableEditing = async () => {
      if (!props.project || loadingProjectManagement.value) return;

      try {
        loadingProjectManagement.value = true;

        // Store original data for potential rollback
        originalProjectManagement.value = { ...props.project };
        editingProjectManagement.value = { ...props.project };

        isEditingProjectManagement.value = true;
      } catch (error) {
        console.error('Failed to enable editing:', error);
      } finally {
        loadingProjectManagement.value = false;
      }
    };

    const saveProjectManagement = async () => {
      if (!editingProjectManagement.value || !props.project) return;

      try {
        savingProjectManagement.value = true;

        const updateData = {
          project_manager_id: editingProjectManagement.value.project_manager_id,
          account_manager_id: editingProjectManagement.value.account_manager_id,
          start_date: editingProjectManagement.value.start_date,
          due_date: editingProjectManagement.value.due_date,
        };

        const response = await $projectApi.updateProject(props.projectId, updateData);

        const updatedProject = {
          ...props.project,
          ...editingProjectManagement.value,
          ...response,
        };

        emit('project-updated', updatedProject);

        isEditingProjectManagement.value = false;
        originalProjectManagement.value = null;
        editingProjectManagement.value = null;
      } catch (error) {
        console.error('Failed to save project management:', error);
      } finally {
        savingProjectManagement.value = false;
      }
    };

    const discardProjectManagementChanges = () => {
      if (originalProjectManagement.value) {
        emit('project-updated', { ...originalProjectManagement.value });
      }

      isEditingProjectManagement.value = false;
      originalProjectManagement.value = null;
      editingProjectManagement.value = null;
    };

    return {
      isEditingProjectManagement,
      savingProjectManagement,
      loadingProjectManagement,
      editingProjectManagement,
      getInitials,
      formatDate,
      enableEditing,
      saveProjectManagement,
      discardProjectManagementChanges,
    };
  },
});
