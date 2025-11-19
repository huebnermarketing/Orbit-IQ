import { defineComponent, ref, onMounted } from 'vue';
import { teamsApi } from '@/composables/api/teamsApi';
import type { Team } from '@/components/views/OrgSettingsView/OrgSettingsView';

export default defineComponent({
  name: 'TeamsTab',
  components: {},
  setup() {
    const teams = ref<Team[]>([]);
    const showCreateTeamModal = ref(false);
    const showEditTeamModal = ref(false);
    const editingTeam = ref<Team | null>(null);

    const loadTeams = async () => {
      try {
        const response = await teamsApi.getTeams();
        teams.value = response;

        for (const team of teams.value) {
          try {
            const teamDetails = await teamsApi.getTeam(team.id);
            team.members = teamDetails.members || [];
          } catch (error) {
            console.error(`Failed to load members for team ${team.name}:`, error);
            team.members = [];
          }
        }
      } catch (error) {
        console.error('Failed to load teams:', error);
      }
    };

    const editTeam = (team: Team) => {
      editingTeam.value = team;
      showEditTeamModal.value = true;
    };

    const deleteTeam = async (team: Team) => {
      if (confirm(`Are you sure you want to delete the team "${team.name}"?`)) {
        try {
          await teamsApi.deleteTeam(team.id);
          await loadTeams();
        } catch (error) {
          console.error('Failed to delete team:', error);
          alert('Failed to delete team. Please try again.');
        }
      }
    };

    const getTeamMembers = (teamId: number) => {
      const team = teams.value.find((t) => t.id === teamId);
      return team?.members || [];
    };

    const handleTeamSuccess = () => {
      showCreateTeamModal.value = false;
      showEditTeamModal.value = false;
      editingTeam.value = null;
      loadTeams();
    };

    onMounted(() => {
      loadTeams();
    });

    return {
      teams,
      showCreateTeamModal,
      showEditTeamModal,
      editingTeam,
      editTeam,
      deleteTeam,
      getTeamMembers,
      handleTeamSuccess,
    };
  },
});
