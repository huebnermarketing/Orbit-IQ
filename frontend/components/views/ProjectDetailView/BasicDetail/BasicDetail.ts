import { defineComponent, ref, watch } from 'vue';

// Types
interface Project {
  id: number;
  name: string;
  project_number: string;
  job_code?: string;
  client_id?: number;
  sub_client_id?: number;
  project_status_id?: number;
  project_type_id?: number;
  client?: Client;
  sub_client?: Subclient;
  project_status?: ProjectStatus;
  project_type?: ProjectType;
}

interface Client {
  id: number;
  company_name: string;
}

interface Subclient {
  id: number;
  name: string;
}

interface ProjectStatus {
  id: number;
  name: string;
  color: string;
}

interface ProjectType {
  id: number;
  name: string;
  color: string;
}

export default defineComponent({
  name: 'BasicDetail',
  props: {
    project: {
      type: Object as () => Project | null,
      default: null
    },
    clients: {
      type: Array as () => Client[],
      default: () => []
    },
    subClients: {
      type: Array as () => Subclient[],
      default: () => []
    },
    projectStatuses: {
      type: Array as () => ProjectStatus[],
      default: () => []
    },
    projectTypes: {
      type: Array as () => ProjectType[],
      default: () => []
    }
  },
  emits: ['project-updated'],
  setup(props, { emit }) {
    const { $projectApi, $clientApi } = useNuxtApp() as any;
    
    // State
    const isEditing = ref(false);
    const saving = ref(false);
    const originalData = ref<any>(null);
    const editingData = ref<any>(null);
    const subClients = ref<Subclient[]>([]);

    // Methods
    const enableEditing = async () => {
      if (!props.project) return;
      
      // Store original data for potential rollback
      originalData.value = { ...props.project };
      editingData.value = { ...props.project };
      
      // Load sub-clients if client is selected
      if (props.project.client_id) {
        await loadSubClients(props.project.client_id);
      }
      
      isEditing.value = true;
    };

    const loadSubClients = async (clientId: string | number) => {
      try {
        const response = await $clientApi.getSubClients(clientId.toString());
        subClients.value = response || [];
      } catch (error) {
        console.error('Failed to load sub-clients:', error);
        subClients.value = [];
      }
    };

    const onClientChange = async () => {
      if (!editingData.value) return;
      
      // Reset sub-client when client changes
      editingData.value.sub_client_id = '';
      
      // Load sub-clients for new client
      if (editingData.value.client_id) {
        await loadSubClients(editingData.value.client_id);
      } else {
        subClients.value = [];
      }
    };

    const saveChanges = async () => {
      if (!editingData.value || !props.project) return;
      
      try {
        saving.value = true;
        
        // Prepare update data
        const updateData = {
          name: editingData.value.name,
          project_number: editingData.value.project_number,
          job_code: editingData.value.job_code,
          client_id: editingData.value.client_id,
          sub_client_id: editingData.value.sub_client_id,
          project_status_id: editingData.value.project_status_id,
          project_type_id: editingData.value.project_type_id,
        };
        
        // Update project via API
        const response = await $projectApi.updateProject(props.project.id.toString(), updateData);
        
        // Reconstruct the project object with proper relationships
        const updatedProject = {
          ...props.project,
          ...editingData.value,
          ...response
        };
        
        // Update relationship objects from loaded dropdown data
        if (editingData.value.client_id) {
          const selectedClient = props.clients.find(c => c.id == editingData.value.client_id);
          if (selectedClient) {
            updatedProject.client = selectedClient;
          }
        }
        
        if (editingData.value.sub_client_id) {
          const selectedSubClient = subClients.value.find(sc => sc.id == editingData.value.sub_client_id);
          if (selectedSubClient) {
            updatedProject.sub_client = selectedSubClient;
          }
        }
        
        if (editingData.value.project_status_id) {
          const selectedStatus = props.projectStatuses.find(s => s.id == editingData.value.project_status_id);
          if (selectedStatus) {
            updatedProject.project_status = selectedStatus;
          }
        }
        
        if (editingData.value.project_type_id) {
          const selectedType = props.projectTypes.find(t => t.id == editingData.value.project_type_id);
          if (selectedType) {
            updatedProject.project_type = selectedType;
          }
        }
        
        // Emit updated project
        emit('project-updated', updatedProject);
        
        // Exit editing mode
        isEditing.value = false;
        originalData.value = null;
        editingData.value = null;
        
      } catch (error) {
        console.error('Failed to save basic details:', error);
        // TODO: Show error message to user
      } finally {
        saving.value = false;
      }
    };

    const discardChanges = () => {
      // Restore original data
      if (originalData.value) {
        emit('project-updated', { ...originalData.value });
      }
      
      // Exit editing mode
      isEditing.value = false;
      originalData.value = null;
      editingData.value = null;
    };

    // Watch for project changes to update sub-clients
    watch(() => props.project?.client_id, (newClientId) => {
      if (newClientId && isEditing.value) {
        loadSubClients(newClientId);
      }
    });

    return {
      isEditing,
      saving,
      editingData,
      subClients,
      enableEditing,
      saveChanges,
      discardChanges,
      onClientChange,
    };
  },
});
