import { defineComponent, ref, computed } from 'vue';
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
    const { $projectApi, $authApi } = useNuxtApp();

    const isExpanded = ref(false);
    const isEditingFinancialInfo = ref(false);
    const savingFinancialInfo = ref(false);
    const loadingFinancialInfo = ref(false);
    const originalFinancialInfo = ref<any>(null);
    const editingFinancialInfo = ref<any>(null);
    const projectTypes = ref<any[]>([]);

    // Dropdown options
    const hourTypeOptions = computed(() => [
      { label: 'Billable', value: 'billable' },
      { label: 'Non-Billable', value: 'non_billable' },
      { label: 'Internal', value: 'internal' },
    ]);

    const fundingSourceOptions = computed(() => [
      { label: 'Fixed', value: 'fixed' },
      { label: 'Hourly', value: 'hourly' },
    ]);

    const projectTypeOptions = computed(() => {
      return projectTypes.value.map((type) => ({
        label: type.name,
        value: String(type.id),
      }));
    });

    const loadProjectTypes = async () => {
      try {
        const response = await $authApi.getProjectTypes();
        projectTypes.value = (response as any)?.data || [];
      } catch (error) {
        console.error('Failed to load project types:', error);
        projectTypes.value = [];
      }
    };

    const toggleSection = () => {
      isExpanded.value = !isExpanded.value;
    };

    const enableEditing = async () => {
      if (!props.project || loadingFinancialInfo.value) return;

      try {
        loadingFinancialInfo.value = true;

        // Expand section when entering edit mode
        isExpanded.value = true;

        // Load project types for dropdown
        await loadProjectTypes();

        // Store original data for potential rollback
        originalFinancialInfo.value = { ...props.project };
        
        // Convert IDs to strings for BaseSelect compatibility
        editingFinancialInfo.value = {
          ...props.project,
          project_type_id: props.project.project_type?.id ? String(props.project.project_type.id) : '',
          hour_type: props.project.hour_type || '',
          funding_source: props.project.funding_source || '',
          budget: props.project.budget || '',
          job_code: props.project.job_code || '',
          invoice_number: (props.project as any).invoice_number || '',
        };

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

        const updateData: any = {
          hour_type: editingFinancialInfo.value.hour_type,
          funding_source: editingFinancialInfo.value.funding_source,
        };

        // Add project_type_id if it's a string, convert to number
        if (editingFinancialInfo.value.project_type_id) {
          updateData.project_type_id = Number(editingFinancialInfo.value.project_type_id);
        }

        // Add other fields if they exist
        if (editingFinancialInfo.value.budget !== undefined) {
          updateData.budget = editingFinancialInfo.value.budget;
        }
        if (editingFinancialInfo.value.job_code !== undefined) {
          updateData.job_code = editingFinancialInfo.value.job_code;
        }
        if (editingFinancialInfo.value.invoice_number !== undefined) {
          updateData.invoice_number = editingFinancialInfo.value.invoice_number;
        }

        const response = await $projectApi.updateProject(props.projectId, updateData);

        // Find the selected project type to include in the updated project
        const selectedProjectType = projectTypes.value.find(
          (type) => String(type.id) === editingFinancialInfo.value.project_type_id
        );

        const updatedProject = {
          ...props.project,
          ...editingFinancialInfo.value,
          ...response,
          project_type: selectedProjectType || props.project.project_type,
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
      hourTypeOptions,
      fundingSourceOptions,
      projectTypeOptions,
      toggleSection,
      enableEditing,
      saveFinancialInfo,
      discardFinancialInfoChanges,
    };
  },
});
