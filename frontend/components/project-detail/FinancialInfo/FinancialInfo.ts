import { defineComponent, ref } from 'vue';
import type { Project } from '~/types';

export default defineComponent({
  name: 'FinancialInfo',
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

    const isExpanded = ref(false);
    const isEditingFinancialInfo = ref(false);
    const savingFinancialInfo = ref(false);
    const loadingFinancialInfo = ref(false);
    const originalFinancialInfo = ref<any>(null);
    const editingFinancialInfo = ref<any>(null);

    const toggleSection = () => {
      isExpanded.value = !isExpanded.value;
    };

    const enableEditing = async () => {
      if (!props.project || loadingFinancialInfo.value) return;

      try {
        loadingFinancialInfo.value = true;

        // Store original data for potential rollback
        originalFinancialInfo.value = { ...props.project };
        editingFinancialInfo.value = { ...props.project };

        isEditingFinancialInfo.value = true;
      } catch (error) {
        console.error('Failed to enable editing:', error);
      } finally {
        loadingFinancialInfo.value = false;
      }
    };

    const saveFinancialInfo = async () => {
      if (!editingFinancialInfo.value || !props.project) return;

      try {
        savingFinancialInfo.value = true;

        const updateData = {
          hour_type: editingFinancialInfo.value.hour_type,
          funding_source: editingFinancialInfo.value.funding_source,
        };

        const response = await $projectApi.updateProject(props.projectId, updateData);

        const updatedProject = {
          ...props.project,
          ...editingFinancialInfo.value,
          ...response,
        };

        emit('project-updated', updatedProject);

        isEditingFinancialInfo.value = false;
        originalFinancialInfo.value = null;
        editingFinancialInfo.value = null;
      } catch (error) {
        console.error('Failed to save financial info:', error);
      } finally {
        savingFinancialInfo.value = false;
      }
    };

    const discardFinancialInfoChanges = () => {
      if (originalFinancialInfo.value) {
        emit('project-updated', { ...originalFinancialInfo.value });
      }

      isEditingFinancialInfo.value = false;
      originalFinancialInfo.value = null;
      editingFinancialInfo.value = null;
    };

    return {
      isExpanded,
      isEditingFinancialInfo,
      savingFinancialInfo,
      loadingFinancialInfo,
      editingFinancialInfo,
      toggleSection,
      enableEditing,
      saveFinancialInfo,
      discardFinancialInfoChanges,
    };
  },
});
