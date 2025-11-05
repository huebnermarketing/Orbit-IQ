import { defineComponent, ref, onMounted } from 'vue';

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
    projectId: {
      type: String,
      required: true
    }
  },
  setup() {
    
    // State
    const client = ref<Client | null>(null);
    const loading = ref(false);

    // Methods
    const loadClientInfo = async () => {
      try {
        loading.value = true;
        // For now, simulate client info since $clientApi might not exist
        // const response = await $clientApi.getClientByProject(props.projectId);
        // client.value = response.data || null;
        client.value = null; // Empty for now
      } catch (error) {
        console.error('Failed to load client info:', error);
        client.value = null;
      } finally {
        loading.value = false;
      }
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
      client,
      loading,
      getCompanyInitials,
    };
  },
});
