import { defineComponent, ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { clientApi } from '@/composables/api/clientApi';
import { getInitials, getCompanyInitials } from '@/composables/useHelpers';
import * as XLSX from 'xlsx';
import type { Client, User } from '@/components/views/OrgSettingsView/OrgSettingsView';

export default defineComponent({
  name: 'ClientManagementTab',
  setup() {
    const router = useRouter();

    const clients = ref<Client[]>([]);
    const filteredClients = ref<Client[]>([]);
    const showCreateClientModal = ref(false);
    const showEditClientModal = ref(false);
    const editingClient = ref<Client | null>(null);
    const clientSearchQuery = ref('');
    const clientTypeFilter = ref('');
    const clientAMFilter = ref('');
    const accountManagers = ref<User[]>([]);

    const loadClients = async () => {
      try {
        const response = await clientApi.getClients();
        clients.value = response.data || [];
        filterClients();
      } catch (error) {
        console.error('Failed to load clients:', error);
      }
    };

    const loadAccountManagers = async () => {
      try {
        const response = await clientApi.getAccountManagers();
        accountManagers.value = response || [];
      } catch (error) {
        console.error('Failed to load account managers:', error);
      }
    };

    const filterClients = () => {
      let filtered = [...clients.value];
      if (clientSearchQuery.value.trim()) {
        const query = clientSearchQuery.value.toLowerCase().trim();
        filtered = filtered.filter((client) => client.company_name?.toLowerCase().includes(query));
      }
      if (clientTypeFilter.value) {
        filtered = filtered.filter((client) => client.client_type === clientTypeFilter.value);
      }
      if (clientAMFilter.value) {
        filtered = filtered.filter((client) => {
          const primaryAMId = client.primary_account_manager?.id;
          const secondaryAMIds = client.secondary_account_managers?.map((am) => am.id) || [];
          return (
            primaryAMId === parseInt(clientAMFilter.value) ||
            secondaryAMIds.includes(parseInt(clientAMFilter.value))
          );
        });
      }
      filteredClients.value = filtered;
    };

    const clearClientFilters = () => {
      clientSearchQuery.value = '';
      clientTypeFilter.value = '';
      clientAMFilter.value = '';
      filterClients();
    };

    const editClient = (client: Client) => {
      editingClient.value = { ...client };
      showEditClientModal.value = true;
    };

    const deleteClient = async (client: Client) => {
      if (confirm(`Are you sure you want to delete ${client.company_name}?`)) {
        try {
          await clientApi.deleteClient(client.id.toString());
          loadClients();
        } catch (error) {
          console.error('Failed to delete client:', error);
        }
      }
    };

    const viewClient = (client: Client) => {
      router.push(`/clients/${client.id}`);
    };

    const closeClientModal = () => {
      showCreateClientModal.value = false;
      showEditClientModal.value = false;
      editingClient.value = null;
    };

    const handleClientSaved = () => {
      loadClients();
      closeClientModal();
    };

    const exportClientsToExcel = () => {
      const wb = XLSX.utils.book_new();
      const exportData = filteredClients.value.map((client) => ({
        'Company Name': client.company_name || '',
        Email: client.email || '',
        Phone: client.phone || '',
        Website: client.website || '',
        Address: client.address || '',
        'Client Type': client.client_type || '',
        Status: client.is_active ? 'Active' : 'Inactive',
        'Primary Account Manager': client.primary_account_manager?.name || '',
        'Secondary Account Managers':
          client.secondary_account_managers?.map((am) => am.name).join(', ') || '',
        'Created Date': client.created_at ? new Date(client.created_at).toLocaleDateString() : '',
      }));
      const ws = XLSX.utils.json_to_sheet(exportData);
      XLSX.utils.book_append_sheet(wb, ws, 'Clients');
      const now = new Date();
      const dateStr = now.toISOString().split('T')[0];
      const filename = `clients_export_${dateStr}.xlsx`;
      XLSX.writeFile(wb, filename);
    };

    const handleLogoError = (event: Event) => {
      const target = event.target as HTMLImageElement;
      target.style.display = 'none';
    };

    onMounted(() => {
      loadClients();
      loadAccountManagers();
    });

    return {
      clients,
      filteredClients,
      showCreateClientModal,
      showEditClientModal,
      editingClient,
      clientSearchQuery,
      clientTypeFilter,
      clientAMFilter,
      accountManagers,
      filterClients,
      clearClientFilters,
      editClient,
      deleteClient,
      viewClient,
      closeClientModal,
      handleClientSaved,
      exportClientsToExcel,
      handleLogoError,
      getInitials,
      getCompanyInitials,
    };
  },
});
