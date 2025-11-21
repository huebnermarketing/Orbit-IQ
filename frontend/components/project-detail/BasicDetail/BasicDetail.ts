import { defineComponent, ref, computed } from 'vue';
import type { Project } from '~/types';

export default defineComponent({
  name: 'BasicDetail',
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
    const { $projectApi, $clientApi, $authApi } = useNuxtApp();

    // Basic Details editing state
    const isEditingBasicDetails = ref(false);
    const savingBasicDetails = ref(false);
    const loadingBasicDetails = ref(false);
    const originalBasicDetails = ref<any>(null);
    const editingBasicDetails = ref<any>(null);

    // Dropdown data for Basic Details editing
    const clients = ref<any[]>([]);
    const subClients = ref<any[]>([]);
    const projectStatuses = ref<any[]>([]);

    // Data loading functions for Basic Details editing
    const loadClientsData = async () => {
      try {
        const response = await $clientApi.getClients();
        clients.value = response.data || [];
      } catch (error) {
        console.error('Failed to load clients:', error);
        clients.value = [];
      }
    };

    const loadSubClientsData = async (clientId: string | number) => {
      try {
        if (!clientId) {
          subClients.value = [];
          return;
        }
        const response = await $clientApi.getSubClients(String(clientId));
        subClients.value = response || [];
      } catch (error) {
        console.error('Failed to load sub-clients:', error);
        subClients.value = [];
      }
    };

    const loadProjectStatusesData = async () => {
      try {
        const response = await $authApi.getProjectStatuses();
        projectStatuses.value = response.data || [];
      } catch (error) {
        console.error('Failed to load project statuses:', error);
        projectStatuses.value = [];
      }
    };

    // Client change handler for Basic Details editing
    const onBasicDetailsClientChange = async (value: string | number) => {
      if (!editingBasicDetails.value) return;

      // Reset sub-client when client changes
      editingBasicDetails.value.sub_client_id = '';

      // Load sub-clients for new client
      if (value) {
        await loadSubClientsData(String(value));
      } else {
        subClients.value = [];
      }
    };

    // Basic Details editing functions
    const enableEditingBasicDetails = async () => {
      if (!props.project || loadingBasicDetails.value) return;

      try {
        loadingBasicDetails.value = true;

        // Load dropdown data first
        await Promise.all([loadClientsData(), loadProjectStatusesData()]);

        // Store original data for potential rollback
        originalBasicDetails.value = { ...props.project };
        
        // Convert IDs to strings for BaseSelect compatibility
        editingBasicDetails.value = {
          ...props.project,
          client_id: props.project.client_id ? String(props.project.client_id) : '',
          sub_client_id: props.project.sub_client_id ? String(props.project.sub_client_id) : '',
          project_status_id: props.project.project_status_id
            ? String(props.project.project_status_id)
            : '',
        };

        // Load sub-clients if client is selected
        if (props.project.client_id) {
          await loadSubClientsData(props.project.client_id);
        }

        isEditingBasicDetails.value = true;
      } catch (error) {
        console.error('Failed to enable editing:', error);
      } finally {
        loadingBasicDetails.value = false;
      }
    };

    const saveBasicDetails = async () => {
      if (!editingBasicDetails.value || !props.project) return;

      try {
        savingBasicDetails.value = true;

        // Prepare update data maintaining relationships
        // Convert string IDs to numbers for API compatibility
        const updateData = {
          name: editingBasicDetails.value.name,
          project_number: editingBasicDetails.value.project_number,
          client_id: editingBasicDetails.value.client_id
            ? Number(editingBasicDetails.value.client_id)
            : null,
          sub_client_id: editingBasicDetails.value.sub_client_id
            ? Number(editingBasicDetails.value.sub_client_id)
            : null,
          project_status_id: editingBasicDetails.value.project_status_id
            ? Number(editingBasicDetails.value.project_status_id)
            : null,
          project_manager_id: editingBasicDetails.value.project_manager_id,
          account_manager_id: editingBasicDetails.value.account_manager_id,
          start_date: editingBasicDetails.value.start_date,
          due_date: editingBasicDetails.value.due_date,
          hour_type: editingBasicDetails.value.hour_type,
          funding_source: editingBasicDetails.value.funding_source,
        };

        // Update project via API
        const response = await $projectApi.updateProject(props.projectId, updateData);

        // Reconstruct the project object with proper relationships
        const updatedProject = {
          ...props.project,
          ...editingBasicDetails.value,
          // If API response contains updated relationships, merge them too
          ...response,
        };

        // Update relationship objects from loaded dropdown data
        if (editingBasicDetails.value.client_id) {
          const clientId = Number(editingBasicDetails.value.client_id);
          const selectedClient = clients.value.find((c) => c.id == clientId);
          if (selectedClient) {
            updatedProject.client = selectedClient;
          }
        }

        if (editingBasicDetails.value.sub_client_id) {
          const subClientId = Number(editingBasicDetails.value.sub_client_id);
          const selectedSubClient = subClients.value.find((sc) => sc.id == subClientId);
          if (selectedSubClient) {
            updatedProject.sub_client = selectedSubClient;
          }
        }

        if (editingBasicDetails.value.project_status_id) {
          const statusId = Number(editingBasicDetails.value.project_status_id);
          const selectedStatus = projectStatuses.value.find((s) => s.id == statusId);
          if (selectedStatus) {
            updatedProject.project_status = selectedStatus;
          }
        }

        // Emit updated project
        emit('project-updated', updatedProject);

        // Exit editing mode
        isEditingBasicDetails.value = false;
        originalBasicDetails.value = null;
        editingBasicDetails.value = null;
      } catch (error) {
        console.error('Failed to save basic details:', error);
        // TODO: Show error message to user
      } finally {
        savingBasicDetails.value = false;
      }
    };

    const discardBasicDetailsChanges = () => {
      // Restore original data
      if (originalBasicDetails.value) {
        emit('project-updated', { ...originalBasicDetails.value });
      }

      // Exit editing mode
      isEditingBasicDetails.value = false;
      originalBasicDetails.value = null;
      editingBasicDetails.value = null;
    };

    // Computed properties for BaseSelect options
    const clientOptions = computed(() => {
      return clients.value.map((client) => ({
        label: client.company_name,
        value: String(client.id),
      }));
    });

    const subClientOptions = computed(() => {
      return subClients.value.map((subClient) => ({
        label: subClient.name,
        value: String(subClient.id),
      }));
    });

    const projectStatusOptions = computed(() => {
      return projectStatuses.value.map((status) => ({
        label: status.name,
        value: String(status.id),
      }));
    });

    return {
      isEditingBasicDetails,
      savingBasicDetails,
      loadingBasicDetails,
      editingBasicDetails,
      clients,
      subClients,
      projectStatuses,
      clientOptions,
      subClientOptions,
      projectStatusOptions,
      enableEditingBasicDetails,
      saveBasicDetails,
      discardBasicDetailsChanges,
      onBasicDetailsClientChange,
    };
  },
});
