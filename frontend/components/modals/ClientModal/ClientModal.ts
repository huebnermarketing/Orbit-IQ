import { defineComponent, ref, computed, watch, onMounted } from 'vue';

interface Manager {
  id: number;
  name: string;
  email: string;
}

export default defineComponent({
  name: 'ClientModal',
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    client: {
      type: Object,
      default: null,
    },
    isEdit: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['close', 'saved'],
  setup(props, { emit }) {
    const { $clientApi } = useNuxtApp();
    const loading = ref(false);
    const accountManagers = ref<Manager[]>([]);
    const managerSearchQuery = ref('');
    const selectedManagers = ref<Manager[]>([]);

    const form = ref({
      company_name: '',
      email: '',
      phone: '',
      website: '',
      address: '',
      primary_account_manager_id: '',
      secondary_account_manager_ids: [] as number[],
      client_type: '',
      is_active: true,
    });

    const filteredManagers = computed(() => {
      if (!managerSearchQuery.value) return accountManagers.value;

      const query = managerSearchQuery.value.toLowerCase();
      return accountManagers.value.filter(
        (manager: any) =>
          manager.name.toLowerCase().includes(query) || manager.email.toLowerCase().includes(query)
      );
    });

    const isManagerSelected = (managerId: number) => {
      return selectedManagers.value.some((manager: any) => manager.id === managerId);
    };

    const toggleManager = (manager: any) => {
      if (isManagerSelected(manager.id)) {
        removeManager(manager.id);
      } else {
        selectedManagers.value.push(manager);
      }
    };

    const removeManager = (managerId: number) => {
      selectedManagers.value = selectedManagers.value.filter(
        (manager: any) => manager.id !== managerId
      );
    };

    const loadAccountManagers = async () => {
      try {
        const response = (await $clientApi.getAccountManagers()) as any;
        accountManagers.value = response || [];
      } catch (error) {
        console.error('Failed to load account managers:', error);
      }
    };

    const initializeForm = () => {
      if (props.client && props.isEdit) {
        form.value = {
          company_name: props.client.company_name || '',
          email: props.client.email || '',
          phone: props.client.phone || '',
          website: props.client.website || '',
          address: props.client.address || '',
          primary_account_manager_id: props.client.primary_account_manager_id || '',
          secondary_account_manager_ids: props.client.secondary_account_manager_ids || [],
          client_type: props.client.client_type || '',
          is_active: props.client.is_active !== false,
        };

        // Set selected managers for display
        selectedManagers.value = props.client.secondary_account_managers || [];
      } else {
        form.value = {
          company_name: '',
          email: '',
          phone: '',
          website: '',
          address: '',
          primary_account_manager_id: '',
          secondary_account_manager_ids: [],
          client_type: '',
          is_active: true,
        };
        selectedManagers.value = [];
      }
      managerSearchQuery.value = '';
    };

    const handleSubmit = async () => {
      loading.value = true;

      try {
        // Update form with selected managers
        form.value.secondary_account_manager_ids = selectedManagers.value.map(
          (manager: any) => manager.id
        );

        if (props.isEdit && props.client) {
          await $clientApi.updateClient(props.client.id, form.value);
        } else {
          await $clientApi.createClient(form.value);
        }

        emit('saved');
      } catch (error) {
        console.error('Failed to save client:', error);
      } finally {
        loading.value = false;
      }
    };

    watch(
      () => props.client,
      () => {
        initializeForm();
      },
      { immediate: true, deep: true }
    );

    watch(
      () => props.show,
      async (newValue) => {
        if (newValue) {
          await loadAccountManagers();
          // Initialize form after account managers are loaded
          initializeForm();
        }
      }
    );

    onMounted(() => {
      loadAccountManagers();
    });

    return {
      loading,
      form,
      accountManagers,
      managerSearchQuery,
      selectedManagers,
      filteredManagers,
      isManagerSelected,
      toggleManager,
      removeManager,
      loadAccountManagers,
      initializeForm,
      handleSubmit,
    };
  },
});
