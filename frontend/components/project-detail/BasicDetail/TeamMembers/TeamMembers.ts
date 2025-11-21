import { defineComponent, ref, computed, onMounted, watch } from 'vue';
import type { Project } from '~/types';
import { userApi } from '~/composables/api/userApi';
import { useApiFetch } from '~/composables/useApiFetch';

export default defineComponent({
  name: 'TeamMembers',
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
    const { $projectApi } = useNuxtApp();

    const isEditingTeamMembers = ref(false);
    const savingTeamMembers = ref(false);
    const loadingTeamMembers = ref(false);
    const originalTeamMembers = ref<any>(null);
    const editingTeamMembers = ref<any>(null);
    const teams = ref<any[]>([]);
    const internalUsers = ref<any[]>([]);

    // Computed options for dropdowns
    const teamOptions = computed(() => {
      return teams.value.map((team) => ({
        label: team.name,
        value: String(team.id),
      }));
    });

    const internalUserOptions = computed(() => {
      return internalUsers.value.map((user) => ({
        label: user.name,
        value: String(user.id),
      }));
    });

    // Get selected teams and members for display
    const selectedTeams = computed(() => {
      if (!props.project) return [];

      // Use editingTeamMembers if in edit mode, otherwise use project directly
      const teamIds = isEditingTeamMembers.value
        ? editingTeamMembers.value?.teams?.map((id: any) => String(id)) || []
        : (props.project as any).teams?.map((id: any) => String(id)) || [];

      if (teamIds.length === 0) return [];

      return teams.value.filter((team) => teamIds.includes(String(team.id)));
    });

    const selectedMembers = computed(() => {
      if (!props.project) return [];

      // Use editingTeamMembers if in edit mode, otherwise use project directly
      const memberIds = isEditingTeamMembers.value
        ? editingTeamMembers.value?.internal_team?.map((id: any) => String(id)) || []
        : (props.project as any).internal_team?.map((id: any) => String(id)) || [];

      if (memberIds.length === 0) return [];

      return internalUsers.value.filter((user) => memberIds.includes(String(user.id)));
    });

    const loadTeams = async () => {
      try {
        const response = await useApiFetch('/admin/teams');
        teams.value = (response as any) || [];
      } catch (error) {
        console.error('Failed to load teams:', error);
        teams.value = [];
      }
    };

    const loadInternalUsers = async () => {
      try {
        const response = await userApi.getUsers();
        const allUsers = (response as any)?.data || [];

        internalUsers.value = allUsers.filter((user: any) => {
          const hasClientRole = user.organization_roles?.some(
            (role: any) => role.organization_role_id === 14
          );
          return !hasClientRole;
        });
      } catch (error) {
        console.error('Failed to load internal users:', error);
        internalUsers.value = [];
      }
    };

    const getInitials = (name: string): string => {
      if (!name) return '?';
      return name
        .split(' ')
        .map((word) => word[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
    };

    // Auto-populate internal team from selected teams
    const updateInternalTeamFromGroupsAndTeams = () => {
      if (!editingTeamMembers.value) return;

      const memberIds = new Set<string>();

      editingTeamMembers.value.teams?.forEach((teamId: string) => {
        const team = teams.value.find((t) => String(t.id) === String(teamId));
        if (team && team.members) {
          team.members.forEach((member: any) => {
            memberIds.add(String(member.id));
          });
        }
      });

      // Merge with existing selections (don't overwrite manually selected members)
      const existingMembers = new Set(
        (editingTeamMembers.value.internal_team || []).map((id: any) => String(id))
      );
      const newMembers = Array.from(memberIds);

      // Add new members from teams, but keep existing ones
      newMembers.forEach((id) => {
        if (!existingMembers.has(String(id))) {
          existingMembers.add(String(id));
        }
      });

      editingTeamMembers.value.internal_team = Array.from(existingMembers);
    };

    const enableEditing = async () => {
      if (!props.project || loadingTeamMembers.value) return;

      try {
        loadingTeamMembers.value = true;

        // Load teams and users for dropdowns
        await Promise.all([loadTeams(), loadInternalUsers()]);

        // Store original data for potential rollback
        originalTeamMembers.value = { ...props.project };

        // Convert IDs to strings for BaseMultiSelect compatibility
        editingTeamMembers.value = {
          ...props.project,
          teams: (props.project as any).teams?.map((id: any) => String(id)) || [],
          internal_team: (props.project as any).internal_team?.map((id: any) => String(id)) || [],
        };

        isEditingTeamMembers.value = true;
      } catch (error) {
        console.error('Failed to enable editing:', error);
      } finally {
        loadingTeamMembers.value = false;
      }
    };

    const saveTeamMembers = async () => {
      if (!editingTeamMembers.value || !props.project) return;

      try {
        savingTeamMembers.value = true;

        const updateData: any = {};

        // Convert string IDs back to numbers for API
        if (editingTeamMembers.value.teams) {
          updateData.teams = editingTeamMembers.value.teams.map((id: string) => Number(id));
        }
        if (editingTeamMembers.value.internal_team) {
          updateData.internal_team = editingTeamMembers.value.internal_team.map((id: string) =>
            Number(id)
          );
        }

        const response = await $projectApi.updateProject(props.projectId, updateData);

        const updatedProject = {
          ...props.project,
          ...editingTeamMembers.value,
          ...response,
        };

        emit('project-updated', updatedProject);

        isEditingTeamMembers.value = false;
        originalTeamMembers.value = null;
        editingTeamMembers.value = null;
      } catch (error) {
        console.error('Failed to save team members:', error);
      } finally {
        savingTeamMembers.value = false;
      }
    };

    const discardTeamMembersChanges = () => {
      if (originalTeamMembers.value) {
        emit('project-updated', { ...originalTeamMembers.value });
      }

      isEditingTeamMembers.value = false;
      originalTeamMembers.value = null;
      editingTeamMembers.value = null;
    };

    // Load teams and users on mount and when project changes
    onMounted(async () => {
      await Promise.all([loadTeams(), loadInternalUsers()]);
    });

    // Watch for project changes to reload data if needed
    watch(
      () => props.project,
      async (newProject) => {
        if (newProject && !isEditingTeamMembers.value) {
          // Reload teams and users when project changes (in case teams/users were updated)
          await Promise.all([loadTeams(), loadInternalUsers()]);
        }
      }
    );

    return {
      isEditingTeamMembers,
      savingTeamMembers,
      loadingTeamMembers,
      editingTeamMembers,
      teamOptions,
      internalUserOptions,
      selectedTeams,
      selectedMembers,
      getInitials,
      updateInternalTeamFromGroupsAndTeams,
      enableEditing,
      saveTeamMembers,
      discardTeamMembersChanges,
    };
  },
});
