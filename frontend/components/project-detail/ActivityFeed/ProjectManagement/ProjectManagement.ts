import { defineComponent, ref, computed } from 'vue';
import type { Project } from '~/types';
import { userApi } from '~/composables/api/userApi';

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
    const amUsers = ref<any[]>([]);
    const pmUsers = ref<any[]>([]);

    // Computed options for dropdowns
    const amUserOptions = computed(() => {
      return amUsers.value.map((user) => ({
        label: `${user.name} (${user.email})`,
        value: String(user.id),
      }));
    });

    const pmUserOptions = computed(() => {
      return pmUsers.value.map((user) => ({
        label: `${user.name} (${user.email})`,
        value: String(user.id),
      }));
    });

    const loadAMUsers = async () => {
      try {
        const response = await userApi.getAMUsers();
        amUsers.value = (response as any) || [];
      } catch (error) {
        console.error('Failed to load AM users:', error);
        amUsers.value = [];
      }
    };

    const loadPMUsers = async () => {
      try {
        const response = await userApi.getPMUsers();
        pmUsers.value = (response as any) || [];
      } catch (error) {
        console.error('Failed to load PM users:', error);
        pmUsers.value = [];
      }
    };

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

    const formatDateForInput = (date: string | undefined): string => {
      if (!date) return '';
      const d = new Date(date);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    // Computed properties for date constraints
    const minDueDate = computed(() => {
      if (editingProjectManagement.value?.start_date) {
        return editingProjectManagement.value.start_date;
      }
      return '';
    });

    const maxStartDate = computed(() => {
      if (editingProjectManagement.value?.due_date) {
        return editingProjectManagement.value.due_date;
      }
      return '';
    });

    // Date change handlers
    const onStartDateChange = () => {
      // If due date is before new start date, clear it
      if (editingProjectManagement.value?.due_date && editingProjectManagement.value?.start_date) {
        const startDate = new Date(editingProjectManagement.value.start_date);
        const dueDate = new Date(editingProjectManagement.value.due_date);
        if (dueDate < startDate) {
          editingProjectManagement.value.due_date = '';
        }
      }
    };

    const onDueDateChange = () => {
      // If start date is after new due date, clear it
      if (editingProjectManagement.value?.start_date && editingProjectManagement.value?.due_date) {
        const startDate = new Date(editingProjectManagement.value.start_date);
        const dueDate = new Date(editingProjectManagement.value.due_date);
        if (startDate > dueDate) {
          editingProjectManagement.value.start_date = '';
        }
      }
    };

    // Prevent decimal input for quoted hours
    const preventDecimalInput = (event: KeyboardEvent) => {
      // Prevent decimal point, minus sign (except for backspace, delete, arrow keys, etc.)
      if (event.key === '.' || event.key === ',' || event.key === '-' || event.key === '+') {
        event.preventDefault();
      }
    };

    const enableEditing = async () => {
      if (!props.project || loadingProjectManagement.value) return;

      try {
        loadingProjectManagement.value = true;

        // Load users for dropdowns
        await Promise.all([loadAMUsers(), loadPMUsers()]);

        // Store original data for potential rollback
        originalProjectManagement.value = { ...props.project };
        
        // Convert IDs to strings for BaseSelect compatibility and format dates
        editingProjectManagement.value = {
          ...props.project,
          am_id: props.project.account_manager?.id ? String(props.project.account_manager.id) : '',
          pm_id: props.project.project_manager?.id ? String(props.project.project_manager.id) : '',
          start_date: formatDateForInput(props.project.start_date),
          due_date: formatDateForInput(props.project.due_date),
          delivery_date: formatDateForInput((props.project as any).delivery_date),
          quoted_hours: (props.project as any).quoted_hours || 0,
        };

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

        const updateData: any = {
          start_date: editingProjectManagement.value.start_date,
          due_date: editingProjectManagement.value.due_date,
        };

        // Add delivery_date if it exists
        if (editingProjectManagement.value.delivery_date) {
          updateData.delivery_date = editingProjectManagement.value.delivery_date;
        }

        // Add quoted_hours if it exists
        if (editingProjectManagement.value.quoted_hours !== undefined) {
          updateData.quoted_hours = Math.floor(Number(editingProjectManagement.value.quoted_hours)) || 0;
        }

        // Add manager IDs if they're strings, convert to numbers
        if (editingProjectManagement.value.am_id) {
          updateData.am_id = Number(editingProjectManagement.value.am_id);
        }
        if (editingProjectManagement.value.pm_id) {
          updateData.pm_id = Number(editingProjectManagement.value.pm_id);
        }

        const response = await $projectApi.updateProject(props.projectId, updateData);

        // Find selected users to include in updated project
        const selectedAM = amUsers.value.find(
          (user) => String(user.id) === editingProjectManagement.value.am_id
        );
        const selectedPM = pmUsers.value.find(
          (user) => String(user.id) === editingProjectManagement.value.pm_id
        );

        const updatedProject = {
          ...props.project,
          ...editingProjectManagement.value,
          ...response,
          account_manager: selectedAM || props.project.account_manager,
          project_manager: selectedPM || props.project.project_manager,
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
      amUserOptions,
      pmUserOptions,
      minDueDate,
      maxStartDate,
      getInitials,
      formatDate,
      enableEditing,
      saveProjectManagement,
      discardProjectManagementChanges,
      onStartDateChange,
      onDueDateChange,
      preventDecimalInput,
    };
  },
});
