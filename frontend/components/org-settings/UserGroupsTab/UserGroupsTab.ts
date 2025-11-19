import { defineComponent, ref, onMounted } from 'vue';
import { userApi } from '@/composables/api/userApi';
import type { UserGroup } from '@/components/views/OrgSettingsView/OrgSettingsView';
import UserGroupModal from '@/components/modals/UserGroupModal/UserGroupModal.vue';

export default defineComponent({
  name: 'UserGroupsTab',
  components: {
    UserGroupModal,
  },
  setup() {
    const userGroups = ref<UserGroup[]>([]);
    const showCreateUserGroupModal = ref(false);
    const showEditUserGroupModal = ref(false);
    const editingUserGroup = ref<UserGroup | null>(null);

    const loadUserGroups = async () => {
      try {
        const response = await userApi.getUserGroups();
        userGroups.value = response.data || [];
      } catch (error) {
        console.error('Failed to load user groups:', error);
      }
    };

    const editUserGroup = (userGroup: UserGroup) => {
      editingUserGroup.value = userGroup;
      showEditUserGroupModal.value = true;
    };

    const deleteUserGroup = async (userGroup: UserGroup) => {
      if (confirm(`Are you sure you want to delete the group "${userGroup.name}"?`)) {
        try {
          await userApi.deleteUserGroup(userGroup.id);
          await loadUserGroups();
        } catch (error) {
          console.error('Failed to delete user group:', error);
          alert('Failed to delete user group. Please try again.');
        }
      }
    };

    const closeUserGroupModal = () => {
      showCreateUserGroupModal.value = false;
      showEditUserGroupModal.value = false;
      editingUserGroup.value = null;
    };

    const handleUserGroupSaved = () => {
      closeUserGroupModal();
      loadUserGroups();
    };

    onMounted(() => {
      loadUserGroups();
    });

    return {
      userGroups,
      showCreateUserGroupModal,
      showEditUserGroupModal,
      editingUserGroup,
      editUserGroup,
      deleteUserGroup,
      closeUserGroupModal,
      handleUserGroupSaved,
    };
  },
});
