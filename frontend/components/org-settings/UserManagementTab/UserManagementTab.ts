import { defineComponent, ref, computed, onMounted } from 'vue';
import { userApi } from '@/composables/api/userApi';
import { organizationApi } from '@/composables/api/organizationApi';
import { getContrastColor, getInitials } from '@/composables/useHelpers';
import { useAuthStore } from '@/stores/auth';
import type { User, OrganizationRole, Pagination } from '@/components/views/OrgSettingsView/OrgSettingsView';
import UserModal from '@/components/modals/UserModal/UserModal.vue';
import ResetPasswordModal from '@/components/modals/ResetPasswordModal/ResetPasswordModal.vue';

export default defineComponent({
  name: 'UserManagementTab',
  components: {
    UserModal,
    ResetPasswordModal,
  },
  setup() {
    const authStore = useAuthStore();
    const currentUser = computed(() => authStore.user);

    const users = ref<User[]>([]);
    const pagination = ref<Pagination | null>(null);
    const searchQuery = ref('');
    const roleFilter = ref('');
    const orgRoleFilter = ref('');
    const statusFilter = ref('active');
    const orgRoles = ref<OrganizationRole[]>([]);

    const showCreateUserModal = ref(false);
    const showEditUserModal = ref(false);
    const editingUser = ref<User | null>(null);
    const showResetPasswordModal = ref(false);
    const selectedUser = ref<User | null>(null);

    const loadUsers = async (page = 1) => {
      try {
        const params: any = {
          page: page.toString(),
          per_page: '15',
          sort_by: 'name',
          sort_order: 'asc',
        };

        if (searchQuery.value) {
          params.search = searchQuery.value;
        }

        if (roleFilter.value) {
          params.role = roleFilter.value;
        }

        if (orgRoleFilter.value) {
          params.organization_role_id = orgRoleFilter.value;
        }

        if (statusFilter.value) {
          params.status = statusFilter.value;
        }

        const response = await userApi.getUsers(params);
        users.value = response.data;
        pagination.value = {
          current_page: response.current_page,
          from: response.from,
          to: response.to,
          total: response.total,
          prev_page_url: response.prev_page_url,
          next_page_url: response.next_page_url,
        };
      } catch (error) {
        console.error('Failed to load users:', error);
      }
    };

    const searchUsers = () => {
      loadUsers(1);
    };

    const filterUsers = () => {
      loadUsers(1);
    };

    const editUser = (user: User) => {
      editingUser.value = user;
      showEditUserModal.value = true;
    };

    const resetUserPassword = (user: User) => {
      selectedUser.value = user;
      showResetPasswordModal.value = true;
    };

    const deleteUser = async (user: User) => {
      if (!confirm(`Are you sure you want to delete ${user.name}?`)) {
        return;
      }
      try {
        await userApi.deleteUser(user.id);
        await loadUsers();
      } catch (error) {
        console.error('Failed to delete user:', error);
      }
    };

    const canDeleteUser = (user: User) => {
      if (currentUser.value?.id === user.id) {
        return false;
      }
      if (!currentUser.value?.isSuperAdmin && user.role === 'super_admin') {
        return false;
      }
      return true;
    };

    const closeUserModal = () => {
      showCreateUserModal.value = false;
      showEditUserModal.value = false;
      editingUser.value = null;
    };

    const handleUserSaved = () => {
      closeUserModal();
      loadUsers();
      loadOrgRoles();
    };

    const handlePasswordReset = () => {
      showResetPasswordModal.value = false;
      selectedUser.value = null;
    };

    const loadOrgRoles = async () => {
      try {
        const response = await organizationApi.getOrganizationRoles();
        orgRoles.value = response;
      } catch (error) {
        console.error('Failed to load organization roles:', error);
      }
    };

    const getRoleBadgeClass = (role: string) => {
      switch (role) {
        case 'super_admin':
          return 'bg-purple-100 text-purple-800';
        case 'admin':
          return 'bg-blue-100 text-blue-800';
        case 'user':
          return 'bg-gray-100 text-gray-800';
        default:
          return 'bg-gray-100 text-gray-800';
      }
    };

    const formatRole = (role: string) => {
      switch (role) {
        case 'super_admin':
          return 'Super Admin';
        case 'admin':
          return 'Admin';
        case 'user':
          return 'User';
        default:
          return role;
      }
    };

    const formatDate = (date: string) => {
      return new Date(date).toLocaleDateString();
    };

    onMounted(() => {
      loadUsers();
      loadOrgRoles();
    });

    return {
      users,
      pagination,
      searchQuery,
      roleFilter,
      orgRoleFilter,
      statusFilter,
      orgRoles,
      showCreateUserModal,
      showEditUserModal,
      editingUser,
      showResetPasswordModal,
      selectedUser,
      searchUsers,
      filterUsers,
      editUser,
      resetUserPassword,
      deleteUser,
      canDeleteUser,
      closeUserModal,
      handleUserSaved,
      handlePasswordReset,
      getRoleBadgeClass,
      formatRole,
      formatDate,
      getInitials,
      getContrastColor,
    };
  },
});
