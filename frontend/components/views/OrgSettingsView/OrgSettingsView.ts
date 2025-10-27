import { defineComponent, ref, computed, onMounted, watch } from 'vue';

// Types
interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  is_active: boolean;
  created_at: string;
  avatar?: string;
}

interface OrgProfile {
  name: string;
  description: string;
  email: string;
  phone: string;
  address: string;
  website: string;
  timezone: string;
  logo?: string;
}

interface Tab {
  id: string;
  name: string;
  icon: string;
}

export default defineComponent({
  name: 'OrgSettingsView',
  setup() {
    const { $organizationApi, $userApi } = useNuxtApp();
    // State
    const activeTab = ref('org-profile');
    const users = ref<User[]>([]);
    const searchQuery = ref('');
    const roleFilter = ref('');
    const statusFilter = ref('active');

    // Organization Profile
    const orgProfile = ref<OrgProfile>({
      name: '',
      description: '',
      email: '',
      phone: '',
      address: '',
      website: '',
      timezone: 'UTC',
    });

    const orgProfileLoading = ref(false);
    const orgProfileSuccess = ref('');
    const orgProfileError = ref('');

    // Tabs configuration
    const tabs = ref<Tab[]>([
      { id: 'org-profile', name: 'Company Profile', icon: 'fas fa-building' },
      { id: 'users', name: 'Users', icon: 'fas fa-users' },
      { id: 'org-roles', name: 'Organization Roles', icon: 'fas fa-user-tag' },
      { id: 'teams', name: 'Teams', icon: 'fas fa-users-cog' },
    ]);

    // Computed
    const filteredUsers = computed(() => {
      let filtered = users.value;

      // Search filter
      if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase();
        filtered = filtered.filter((user) => {
          return (
            user.name.toLowerCase().includes(query) || user.email.toLowerCase().includes(query)
          );
        });
      }

      // Role filter
      if (roleFilter.value) {
        filtered = filtered.filter((user) => user.role === roleFilter.value);
      }

      // Status filter
      if (statusFilter.value) {
        const isActive = statusFilter.value === 'active';
        filtered = filtered.filter((user) => user.is_active === isActive);
      }

      return filtered;
    });

    // Methods
    const loadOrgProfile = async () => {
      try {
        const response = await $organizationApi.getOrgProfile();
        if (response.data) {
          orgProfile.value = response.data;
        }
      } catch (error) {
        console.error('Failed to load organization profile:', error);
      }
    };

    const loadUsers = async () => {
      try {
        const response = await $userApi.getUsers();
        users.value = response.data || [];
      } catch (error) {
        console.error('Failed to load users:', error);
        users.value = [];
      }
    };

    const handleOrgProfileSubmit = async () => {
      try {
        orgProfileLoading.value = true;
        orgProfileSuccess.value = '';
        orgProfileError.value = '';

        await $organizationApi.updateOrgProfile(orgProfile.value);

        orgProfileSuccess.value = 'Organization profile updated successfully!';

        setTimeout(() => {
          orgProfileSuccess.value = '';
        }, 3000);
      } catch (error: any) {
        orgProfileError.value = error.data?.message || 'Failed to update organization profile';
      } finally {
        orgProfileLoading.value = false;
      }
    };

    const resetOrgProfile = () => {
      loadOrgProfile();
      orgProfileSuccess.value = '';
      orgProfileError.value = '';
    };

    const handleLogoUpload = async (event: Event) => {
      const target = event.target as HTMLInputElement;
      const file = target.files?.[0];

      if (!file) return;

      try {
        const formData = new FormData();
        formData.append('logo', file);

        const response = await $organizationApi.updateOrgLogo(formData);

        if (response.data?.logo) {
          orgProfile.value.logo = response.data.logo;
          orgProfileSuccess.value = 'Logo uploaded successfully!';

          setTimeout(() => {
            orgProfileSuccess.value = '';
          }, 3000);
        }
      } catch (error: any) {
        orgProfileError.value = error.data?.message || 'Failed to upload logo';
      }
    };

    const formatDate = (date: string | null | undefined): string => {
      if (!date) return '-';

      try {
        const d = new Date(date);
        const options: Intl.DateTimeFormatOptions = {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        };
        return d.toLocaleDateString('en-US', options);
      } catch {
        return '-';
      }
    };

    const getInitials = (name: string): string => {
      if (!name) return '?';

      const parts = name
        .trim()
        .split(' ')
        .filter((p) => p.length > 0);
      if (parts.length >= 2) {
        const firstChar = parts[0]?.[0];
        const lastChar = parts[parts.length - 1]?.[0];
        if (firstChar && lastChar) {
          return (firstChar + lastChar).toUpperCase();
        }
      }
      return name.substring(0, 2).toUpperCase();
    };

    const handleCreateUser = () => {
      navigateTo('/org-settings/users/create');
    };

    const editUser = (user: User) => {
      navigateTo(`/org-settings/users/${user.id}/edit`);
    };

    const deleteUser = async (user: User) => {
      if (!confirm(`Are you sure you want to delete ${user.name}?`)) return;

      try {
        await $userApi.deleteUser(user.id);

        // Remove user from list
        users.value = users.value.filter((u) => u.id !== user.id);
      } catch (error: any) {
        alert(error.data?.message || 'Failed to delete user');
      }
    };

    const handleCreateRole = () => {
      navigateTo('/org-settings/roles/create');
    };

    const handleCreateTeam = () => {
      navigateTo('/org-settings/teams/create');
    };

    // Lifecycle
    onMounted(() => {
      loadOrgProfile();
      if (activeTab.value === 'users') {
        loadUsers();
      }
    });

    // Watch activeTab to load data when switching tabs
    watch(
      () => activeTab.value,
      (newTab) => {
        if (newTab === 'users') {
          loadUsers();
        }
      }
    );

    return {
      activeTab,
      tabs,
      users,
      searchQuery,
      roleFilter,
      statusFilter,
      filteredUsers,
      orgProfile,
      orgProfileLoading,
      orgProfileSuccess,
      orgProfileError,
      handleOrgProfileSubmit,
      resetOrgProfile,
      handleLogoUpload,
      formatDate,
      getInitials,
      handleCreateUser,
      editUser,
      deleteUser,
      handleCreateRole,
      handleCreateTeam,
    };
  },
});
