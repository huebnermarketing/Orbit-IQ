import { ref, reactive, watch, computed, onMounted } from 'vue';
import { clientApi } from '~/composables/api/clientApi';
import { authApi } from '~/composables/api/authApi';
import { userApi } from '~/composables/api/userApi';
import { projectApi } from '~/composables/api/projectApi';
import { useApiFetch } from '~/composables/useApiFetch';
import { useFormValidation } from '~/composables/useFormValidation';

interface Project {
  id?: number;
  name: string;
  project_number: string;
  description: string;
  client_id: string;
  sub_client_id?: string;
  funding_source: string;
  hour_type: string;
  am_id: string;
  pm_id?: string;
  start_date: string;
  due_date: string;
  internal_team: string[];
  client_team: string[];
  user_groups: string[];
  teams: string[];
  project_type_id?: string;
  project_status_id?: string;
  color: string;
}

interface PMUser {
  id: string;
  name: string;
  email: string;
}

interface AMUser {
  id: string;
  name: string;
  email: string;
  assigned_p_ms?: PMUser[];
}

interface User {
  id: string;
  name: string;
  email: string;
  organization_roles?: Array<{ organization_role_id: number }>;
}

interface UserGroup {
  id: string;
  name: string;
  users?: User[];
}

interface Team {
  id: string;
  name: string;
  members?: User[];
}

interface ProjectStatus {
  id: string;
  name: string;
}

interface ProjectType {
  id: string;
  name: string;
}

export default defineComponent({
  name: 'CreateProjectModal',
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    project: {
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
    const loading = ref(false);
    const {
      error,
      getFieldError,
      clearFieldError,
      handleApiError,
      handleSubmitWithValidation,
      rules,
    } = useFormValidation({
      defaultErrorMessage: 'Failed to save project. Please try again.',
      errorStrategy: 'field', // Use field strategy to show errors per field
      clearOnSubmit: false, // Don't clear on submit, let validation handle it
    });

    // Tooltip configuration for Project Number
    const tooltipConfig = {
      content: '6-digit number (auto-generated, can be modified)',
      html: false,
      placement: 'top' as const,
      distance: 8,
      triggers: ['hover', 'focus'] as const,
      theme: 'tooltip',
    };

    // Data arrays
    const clients = ref<any[]>([]);
    const subClients = ref<any[]>([]);
    const amUsers = ref<AMUser[]>([]);
    const pmUsers = ref<PMUser[]>([]);
    const allPMUsers = ref<PMUser[]>([]); // Store all PM users for filtering
    const internalUsers = ref<User[]>([]);
    const clientUsers = ref<User[]>([]);
    const userGroups = ref<UserGroup[]>([]);
    const teams = ref<Team[]>([]);
    const projectStatuses = ref<ProjectStatus[]>([]);
    const projectTypes = ref<ProjectType[]>([]);

    // Computed properties for formatted options
    const clientOptions = computed(() => {
      return clients.value.map((client) => ({
        label: client.company_name,
        value: String(client.id),
      }));
    });

    const subClientOptions = computed(() => {
      return subClients.value.map((subClient) => ({
        label: subClient.name,
        value: String(subClient.id),
      }));
    });

    const amUserOptions = computed(() => {
      return amUsers.value.map((am) => ({
        label: `${am.name} (${am.email})`,
        value: String(am.id),
      }));
    });

    const pmUserOptions = computed(() => {
      return filteredPMUsers.value.map((pm) => ({
        label: `${pm.name} (${pm.email})`,
        value: String(pm.id),
      }));
    });

    const projectStatusOptions = computed(() => {
      return projectStatuses.value.map((status) => ({
        label: status.name,
        value: String(status.id),
      }));
    });

    const projectTypeOptions = computed(() => {
      return projectTypes.value.map((type) => ({
        label: type.name,
        value: String(type.id),
      }));
    });

    const internalUserOptions = computed(() => {
      return internalUsers.value.map((user) => ({
        label: `${user.name} (${user.email})`,
        value: user.id,
      }));
    });

    const clientUserOptions = computed(() => {
      return clientUsers.value.map((user) => ({
        label: `${user.name} (${user.email})`,
        value: user.id,
      }));
    });

    const userGroupOptions = computed(() => {
      return userGroups.value.map((group) => ({
        label: group.name,
        value: group.id,
      }));
    });

    const teamOptions = computed(() => {
      return teams.value.map((team) => ({
        label: team.name,
        value: team.id,
      }));
    });

    const form = reactive<Project>({
      name: '',
      project_number: '',
      description: '',
      client_id: '',
      sub_client_id: '',
      funding_source: '',
      hour_type: '',
      am_id: '',
      pm_id: '',
      project_type_id: '',
      project_status_id: '',
      start_date: '',
      due_date: '',
      internal_team: [],
      client_team: [],
      user_groups: [],
      teams: [],
      color: '#3B82F6',
    });

    // Generate 6-digit project number
    const generateProjectNumber = () => {
      return Math.floor(100000 + Math.random() * 900000).toString();
    };

    // Computed properties for filtered data
    const filteredPMUsers = computed(() => {
      console.log('Computing filtered PM users for AM:', form.am_id);

      if (!form.am_id) {
        console.log('No AM selected, returning empty PM list');
        return [];
      }

      // Find the selected AM
      const selectedAM = amUsers.value.find((am) => am.id === form.am_id);
      console.log('Selected AM:', selectedAM);

      if (!selectedAM || !selectedAM.assigned_p_ms || selectedAM.assigned_p_ms.length === 0) {
        console.log('AM has no assigned PMs, returning empty list');
        return [];
      }

      // Get the IDs of PMs assigned to this AM
      const assignedPMIds = selectedAM.assigned_p_ms.map((pm) => pm.id);
      console.log('Assigned PM IDs:', assignedPMIds);

      // Filter PMs to show only those assigned to this AM
      const filteredPMs = allPMUsers.value.filter((pm) => assignedPMIds.includes(pm.id));
      console.log('Filtered PMs for AM:', filteredPMs);
      return filteredPMs;
    });

    // Computed property for minimum due date (should be after start date)
    const minDueDate = computed(() => {
      if (form.start_date) {
        return form.start_date;
      }
      return '';
    });

    // Computed property for maximum start date (should be before due date)
    const maxStartDate = computed(() => {
      if (form.due_date) {
        return form.due_date;
      }
      return '';
    });

    // Helper functions
    const getInternalUserById = (id: string) => internalUsers.value.find((user) => user.id === id);
    const getClientUserById = (id: string) => clientUsers.value.find((person) => person.id === id);
    const getUserGroupById = (id: string) => userGroups.value.find((group) => group.id === id);
    const getTeamById = (id: string) => teams.value.find((team) => team.id === id);

    // Date change handlers
    const onStartDateChange = () => {
      if (getFieldError('start_date')) clearFieldError('start_date');

      // If due date is before new start date, clear it
      if (form.due_date && form.start_date) {
        const startDate = new Date(form.start_date);
        const dueDate = new Date(form.due_date);
        if (dueDate < startDate) {
          form.due_date = '';
          if (getFieldError('due_date')) clearFieldError('due_date');
        }
      }
    };

    const onDueDateChange = () => {
      if (getFieldError('due_date')) clearFieldError('due_date');

      // If start date is after new due date, clear it
      if (form.start_date && form.due_date) {
        const startDate = new Date(form.start_date);
        const dueDate = new Date(form.due_date);
        if (startDate > dueDate) {
          form.start_date = '';
          if (getFieldError('start_date')) clearFieldError('start_date');
        }
      }
    };

    // Client change handler
    const onClientChange = async () => {
      console.log('onClientChange called with client_id:', form.client_id);
      form.sub_client_id = '';
      form.am_id = '';
      form.pm_id = '';

      if (form.client_id) {
        try {
          console.log('Loading sub-clients for client:', form.client_id);
          const subClientsResponse = await clientApi.getSubClients(form.client_id);
          console.log('Sub-clients response:', subClientsResponse);
          subClients.value = (subClientsResponse as any) || [];

          await loadClientUsers(form.client_id);

          console.log('Loading client details for client:', form.client_id);
          const clientResponse = await clientApi.getClient(form.client_id);
          console.log('Client response:', clientResponse);
          const client = clientResponse as any;

          if (client && client.primary_account_manager_id) {
            console.log('Client has primary AM:', client.primary_account_manager_id);
            console.log('Available AM users:', amUsers.value);
            const primaryAM = amUsers.value.find(
              (am) => am.id === client.primary_account_manager_id
            );
            if (primaryAM) {
              console.log('Found primary AM:', primaryAM);
              form.am_id = primaryAM.id;
              await onAMChange();
            } else {
              console.log('Primary AM not found in AM users list');
            }
          } else {
            console.log('Client has no primary AM or client data is missing');
          }
        } catch (err) {
          console.error('Failed to load client data:', err);
          subClients.value = [];
        }
      } else {
        subClients.value = [];
        clientUsers.value = [];
      }
    };

    // Account Manager change handler
    const onAMChange = async () => {
      form.pm_id = '';

      if (form.am_id) {
        try {
          const selectedAM = amUsers.value.find((am) => am.id === form.am_id);
          if (selectedAM && selectedAM.assigned_p_ms && selectedAM.assigned_p_ms.length > 0) {
            if (selectedAM.assigned_p_ms.length === 1) {
              const firstPM = selectedAM.assigned_p_ms[0];
              if (firstPM) {
                const assignedPM = allPMUsers.value.find((pm) => pm.id === firstPM.id);
                if (assignedPM) {
                  form.pm_id = assignedPM.id;
                }
              }
            }
          }
        } catch (err) {
          console.error('Failed to load assigned PMs:', err);
        }
      }
    };

    // Auto-populate internal team from selected groups and teams
    const updateInternalTeamFromGroupsAndTeams = () => {
      const memberIds = new Set<string>();

      form.user_groups.forEach((groupId: string) => {
        const group = userGroups.value.find((g) => g.id === groupId);
        if (group && group.users) {
          group.users.forEach((user) => {
            memberIds.add(user.id);
          });
        }
      });

      form.teams.forEach((teamId: string) => {
        const team = teams.value.find((t) => t.id === teamId);
        if (team && team.members) {
          team.members.forEach((member) => {
            memberIds.add(member.id);
          });
        }
      });

      form.internal_team = Array.from(memberIds);
    };

    // Load data functions
    const loadClients = async () => {
      try {
        const response = await clientApi.getClients();
        console.log('Clients response:', response);
        clients.value = (response as any)?.data || [];
        console.log('Loaded clients:', clients.value);
      } catch (err) {
        console.error('Failed to load clients:', err);
        clients.value = [];
      }
    };

    const loadAMUsers = async () => {
      try {
        const response = await userApi.getAMUsers();
        console.log('AM users response:', response);
        amUsers.value = (response as any) || [];
        console.log('Loaded AM users:', amUsers.value);
      } catch (err) {
        console.error('Failed to load AM users:', err);
      }
    };

    const loadPMUsers = async () => {
      try {
        const response = await userApi.getPMUsers();
        console.log('PM users response:', response);
        allPMUsers.value = (response as any) || [];
        pmUsers.value = (response as any) || [];
        console.log('Loaded PM users:', allPMUsers.value);
      } catch (err) {
        console.error('Failed to load PM users:', err);
      }
    };

    const loadInternalUsers = async () => {
      try {
        const response = await userApi.getUsers();
        const allUsers = (response as any)?.data || [];

        internalUsers.value = allUsers.filter((user: User) => {
          const hasClientRole = user.organization_roles?.some(
            (role) => role.organization_role_id === 14
          );
          return !hasClientRole;
        });
      } catch (err) {
        console.error('Failed to load internal users:', err);
      }
    };

    const loadClientUsers = async (clientId?: string) => {
      try {
        if (!clientId) {
          clientUsers.value = [];
          return;
        }

        const response = await clientApi.getClientPersons(clientId);
        clientUsers.value = (response as any) || [];
      } catch (err) {
        console.error('Failed to load client users:', err);
        clientUsers.value = [];
      }
    };

    const loadUserGroups = async () => {
      try {
        const response = await useApiFetch('/admin/user-groups');
        userGroups.value = (response as any)?.data || [];
      } catch (err) {
        console.error('Failed to load user groups:', err);
      }
    };

    const loadTeams = async () => {
      try {
        console.log('Loading teams...');
        const response = await useApiFetch('/admin/teams');
        console.log('Teams API response:', response);
        teams.value = (response as any) || [];
        console.log('Teams value set to:', teams.value);
      } catch (err) {
        console.error('Failed to load teams:', err);
      }
    };

    const loadProjectStatuses = async () => {
      try {
        const response = await authApi.getProjectStatuses();
        projectStatuses.value = (response as any)?.data || [];

        const quoteStatus = projectStatuses.value.find((status: any) => status.name === 'Quote');
        if (quoteStatus && !form.project_status_id) {
          form.project_status_id = quoteStatus.id;
        }
      } catch (err) {
        console.error('Failed to load project statuses:', err);
      }
    };

    const loadProjectTypes = async () => {
      try {
        const response = await authApi.getProjectTypes();
        projectTypes.value = (response as any)?.data || [];
      } catch (err) {
        console.error('Failed to load project types:', err);
      }
    };

    // Watch for project changes to populate form
    watch(
      () => props.project,
      (newProject) => {
        if (newProject) {
          const project = newProject as any;
          form.name = project.name || '';
          form.project_number = project.project_number || '';
          form.description = project.description || '';
          form.client_id = project.client_id || '';
          form.sub_client_id = project.sub_client_id || '';
          form.funding_source = project.funding_source || '';
          form.hour_type = project.hour_type || '';
          form.am_id = project.am_id || '';
          form.pm_id = project.pm_id || '';
          form.start_date = project.start_date || '';
          form.due_date = project.due_date || '';
          form.internal_team = project.internal_team || [];
          form.client_team = project.client_team || [];
          form.user_groups = project.user_groups || [];
          form.teams = project.teams || [];
          form.project_type_id = project.project_type_id || '';
          form.project_status_id = project.project_status_id || '';
          form.color = project.color || '#3B82F6';

          if (form.client_id) {
            onClientChange();
          }
        } else {
          form.name = '';
          form.project_number = generateProjectNumber();
          form.description = '';
          form.client_id = '';
          form.sub_client_id = '';
          form.funding_source = '';
          form.hour_type = '';
          form.am_id = '';
          form.pm_id = '';
          form.start_date = '';
          form.due_date = '';
          form.internal_team = [];
          form.client_team = [];
          form.user_groups = [];
          form.teams = [];
          form.project_type_id = '';
          form.project_status_id = '';
          form.color = '#3B82F6';
          subClients.value = [];
        }
      },
      { immediate: true }
    );

    // Watch form fields to clear errors when user corrects them
    watch(
      () => form.name,
      () => {
        if (getFieldError('name')) clearFieldError('name');
      }
    );
    watch(
      () => form.project_number,
      () => {
        if (getFieldError('project_number')) clearFieldError('project_number');
      }
    );
    watch(
      () => form.client_id,
      () => {
        if (getFieldError('client_id')) clearFieldError('client_id');
      }
    );
    watch(
      () => form.funding_source,
      () => {
        if (getFieldError('funding_source')) clearFieldError('funding_source');
      }
    );
    watch(
      () => form.hour_type,
      () => {
        if (getFieldError('hour_type')) clearFieldError('hour_type');
      }
    );
    watch(
      () => form.am_id,
      () => {
        if (getFieldError('am_id')) clearFieldError('am_id');
      }
    );
    watch(
      () => form.start_date,
      () => {
        if (getFieldError('start_date')) clearFieldError('start_date');
      }
    );
    watch(
      () => form.due_date,
      () => {
        if (getFieldError('due_date')) clearFieldError('due_date');
      }
    );

    // Load data on mount
    onMounted(async () => {
      await Promise.all([
        loadClients(),
        loadAMUsers(),
        loadPMUsers(),
        loadInternalUsers(),
        loadUserGroups(),
        loadTeams(),
        loadProjectStatuses(),
        loadProjectTypes(),
      ]);
    });

    // Restrict project number input to numbers only
    const handleProjectNumberInput = (event: Event) => {
      const target = event.target as HTMLInputElement;
      // Remove any non-numeric characters
      target.value = target.value.replace(/\D/g, '');
      form.project_number = target.value;
    };

    const handleSubmit = async () => {
      loading.value = true;
      try {
        // Define validation rules for required fields
        const validationRules = {
          name: [rules.required('Project name is required')],
          project_number: [
            rules.required('Project number is required'),
            rules.exactLength(6, 'Project number must be exactly 6 digits'),
            rules.numeric('Project number must contain only numbers'),
          ],
          client_id: [rules.required('Client is required')],
          funding_source: [rules.required('Funding source is required')],
          hour_type: [rules.required('Hour type is required')],
          am_id: [rules.required('Account Manager is required')],
        };

        // Validate and submit
        await handleSubmitWithValidation(form, validationRules, async () => {
          console.log('Submitting project data:', form);

          const projectData = {
            ...form,
            sub_client_id: form.sub_client_id || null,
            am_id: form.am_id || null,
            pm_id: form.pm_id || null,
            project_type_id: form.project_type_id || null,
            project_status_id: form.project_status_id || null,
            start_date: form.start_date || null,
            due_date: form.due_date || null,
          };

          let response;
          if (props.isEdit && props.project) {
            const project = props.project as any;
            response = await projectApi.updateProject(String(project.id), projectData);
          } else {
            response = await projectApi.createProject(projectData);
          }

          console.log('Project saved successfully:', response);
          emit('saved', (response as any)?.project || response);
          emit('close');
        });
      } catch (err: any) {
        console.error('Failed to save project:', err);
        // Only handle API errors, validation errors are already handled
        if (err.message !== 'Validation failed') {
          handleApiError(err);
        }
      } finally {
        loading.value = false;
      }
    };

    return {
      loading,
      error,
      getFieldError,
      handleProjectNumberInput,
      tooltipConfig,
      form,
      clients,
      subClients,
      amUsers,
      pmUsers,
      allPMUsers,
      internalUsers,
      clientUsers,
      userGroups,
      teams,
      projectStatuses,
      projectTypes,
      clientOptions,
      subClientOptions,
      amUserOptions,
      pmUserOptions,
      projectStatusOptions,
      projectTypeOptions,
      internalUserOptions,
      clientUserOptions,
      userGroupOptions,
      teamOptions,
      filteredPMUsers,
      minDueDate,
      maxStartDate,
      getInternalUserById,
      getClientUserById,
      getUserGroupById,
      getTeamById,
      onClientChange,
      onAMChange,
      onStartDateChange,
      onDueDateChange,
      updateInternalTeamFromGroupsAndTeams,
      handleSubmit,
    };
  },
});
