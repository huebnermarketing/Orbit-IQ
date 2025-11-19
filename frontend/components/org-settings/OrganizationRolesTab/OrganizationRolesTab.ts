import { defineComponent, ref, onMounted } from 'vue';
import { organizationApi } from '@/composables/api/organizationApi';
import type { OrganizationRole } from '@/components/views/OrgSettingsView/OrgSettingsView';
import OrganizationRoleModal from '@/components/modals/OrganizationRoleModal/OrganizationRoleModal.vue';

export default defineComponent({
  name: 'OrganizationRolesTab',
  components: {
    OrganizationRoleModal,
  },
  setup() {
    const orgRoles = ref<OrganizationRole[]>([]);
    const showCreateOrgRoleModal = ref(false);
    const showEditOrgRoleModal = ref(false);
    const editingOrgRole = ref<OrganizationRole | null>(null);

    const loadOrgRoles = async () => {
      try {
        const response = await organizationApi.getOrganizationRoles();
        orgRoles.value = response;
      } catch (error) {
        console.error('Failed to load organization roles:', error);
      }
    };

    const editOrgRole = (role: OrganizationRole) => {
      editingOrgRole.value = role;
      showEditOrgRoleModal.value = true;
    };

    const deleteOrgRole = async (role: OrganizationRole) => {
      if (role.is_locked) {
        alert('System roles cannot be deleted.');
        return;
      }

      if (confirm(`Are you sure you want to delete the role "${role.name}"?`)) {
        try {
          await organizationApi.deleteOrganizationRole(role.id.toString());
          await loadOrgRoles();
        } catch (error) {
          console.error('Failed to delete organization role:', error);
          alert('Failed to delete role. Please try again.');
        }
      }
    };

    const handleOrgRoleSuccess = () => {
      showCreateOrgRoleModal.value = false;
      showEditOrgRoleModal.value = false;
      editingOrgRole.value = null;
      loadOrgRoles();
    };

    onMounted(() => {
      loadOrgRoles();
    });

    return {
      orgRoles,
      showCreateOrgRoleModal,
      showEditOrgRoleModal,
      editingOrgRole,
      editOrgRole,
      deleteOrgRole,
      handleOrgRoleSuccess,
    };
  },
});
