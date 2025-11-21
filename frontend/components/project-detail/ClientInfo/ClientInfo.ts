import { defineComponent, ref, onMounted, computed } from 'vue';
import type { Project } from '~/types';
import { clientApi } from '~/composables/api/clientApi';

// Types
interface Client {
  id: number;
  company_name: string;
  logo_url?: string;
  website?: string;
  contact_person?: string;
  phone?: string;
  email?: string;
  address?: string;
  industry?: string;
  description?: string;
}

export default defineComponent({
  name: 'ClientInfo',
  props: {
    project: {
      type: Object as () => Project | null,
      default: null,
    },
    projectId: {
      type: String,
      required: true
    }
  },
  emits: ['project-updated'],
  setup(props, { emit }) {
    
    // State
    const client = ref<Client | null>(null);
    const loadingClientInfo = ref(false);
    const isEditingClientInfo = ref(false);
    const savingClientInfo = ref(false);
    const originalClientInfo = ref<Client | null>(null);
    const editingClientInfo = ref<Client | null>(null);

    // Get client from project prop
    const currentClient = computed(() => {
      return props.project?.client || client.value;
    });

    // Methods
    const loadClientInfo = async () => {
      try {
        loadingClientInfo.value = true;
        if (props.project?.client_id) {
          // Load client details if we have client_id
          // const response = await $clientApi.getClient(props.project.client_id);
          // client.value = response.data || null;
        }
        // Use client from project prop if available
        if (props.project?.client) {
          client.value = props.project.client as any;
        }
      } catch (error) {
        console.error('Failed to load client info:', error);
        client.value = null;
      } finally {
        loadingClientInfo.value = false;
      }
    };

    const enableEditing = async () => {
      if (!currentClient.value || loadingClientInfo.value) return;

      try {
        loadingClientInfo.value = true;

        // Store original data for potential rollback
        originalClientInfo.value = { ...currentClient.value };
        editingClientInfo.value = { ...currentClient.value };

        isEditingClientInfo.value = true;
      } catch (error) {
        console.error('Failed to enable editing:', error);
      } finally {
        loadingClientInfo.value = false;
      }
    };

    const saveClientInfo = async () => {
      if (!editingClientInfo.value || !currentClient.value) return;

      try {
        savingClientInfo.value = true;

        const updateData = {
          company_name: editingClientInfo.value.company_name,
          contact_person: editingClientInfo.value.contact_person,
          phone: editingClientInfo.value.phone,
          email: editingClientInfo.value.email,
          address: editingClientInfo.value.address,
          industry: editingClientInfo.value.industry,
          description: editingClientInfo.value.description,
        };

        // Update client via API
        if (currentClient.value.id) {
          const response = await clientApi.updateClient(
            currentClient.value.id.toString(),
            updateData
          );

          // Update the client in the project
          const updatedClient = {
            ...currentClient.value,
            ...updateData,
            ...response,
          };

          // Emit project update with updated client
          if (props.project) {
            const updatedProject = {
              ...props.project,
              client: updatedClient,
            };
            emit('project-updated', updatedProject);
          }

          client.value = updatedClient;
        }

        isEditingClientInfo.value = false;
        originalClientInfo.value = null;
        editingClientInfo.value = null;
      } catch (error) {
        console.error('Failed to save client info:', error);
      } finally {
        savingClientInfo.value = false;
      }
    };

    const discardClientInfoChanges = () => {
      if (originalClientInfo.value) {
        editingClientInfo.value = { ...originalClientInfo.value };
        if (props.project) {
          const updatedProject = {
            ...props.project,
            client: originalClientInfo.value,
          };
          emit('project-updated', updatedProject);
        }
      }

      isEditingClientInfo.value = false;
      originalClientInfo.value = null;
      editingClientInfo.value = null;
    };

    const getCompanyInitials = (companyName: string): string => {
      if (!companyName) return '?';
      return companyName
        .split(' ')
        .map(word => word[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
    };

    // Lifecycle
    onMounted(() => {
      loadClientInfo();
    });

    return {
      client: currentClient,
      loadingClientInfo,
      isEditingClientInfo,
      savingClientInfo,
      editingClientInfo,
      getCompanyInitials,
      enableEditing,
      saveClientInfo,
      discardClientInfoChanges,
    };
  },
});
