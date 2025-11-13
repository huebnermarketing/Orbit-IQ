import { ref, reactive, watch, computed, onMounted, onUnmounted, nextTick } from 'vue';
import { clientApi } from '~/composables/api/clientApi';
import { authApi } from '~/composables/api/authApi';
import { userApi } from '~/composables/api/userApi';
import { projectApi } from '~/composables/api/projectApi';
import { useApiFetch } from '~/composables/useApiFetch';

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
    const error = ref('');

    // Quill Editor
    let quill: any = null;

    const initializeQuill = async () => {
      console.log('Starting Quill initialization...');

      // Check if the element exists
      const editorElement = document.getElementById('quill-editor');
      if (!editorElement) {
        console.error('❌ Quill editor element not found');
        return;
      }

      console.log('✅ Editor element found:', editorElement);

      // Clear any existing content
      editorElement.innerHTML = '';

      try {
        console.log('📦 Loading Quill module...');
        const QuillModule = await import('quill');
        const QuillClass = QuillModule.default || QuillModule;

        console.log('✅ Quill module loaded:', QuillClass);

        // Configure Quill with minimal options
        quill = new QuillClass('#quill-editor', {
          theme: 'snow',
          placeholder: 'Enter project description...',
          modules: {
            toolbar: {
              container: [
                ['bold', 'italic', 'underline'],
                [{ header: [1, 2, 3, false] }],
                [{ list: 'ordered' }, { list: 'bullet' }],
                [{ indent: '-1' }, { indent: '+1' }],
                [{ align: [] }],
                ['image'],
                ['clean'],
              ],
            },
          },
        });

        // Custom image handler with drag and drop support
        const toolbar = quill.getModule('toolbar');
        toolbar.addHandler('image', () => {
          const input = document.createElement('input');
          input.setAttribute('type', 'file');
          input.setAttribute('accept', 'image/*');
          input.click();

          input.onchange = () => {
            const file = input.files?.[0];
            if (file) {
              const reader = new FileReader();
              reader.onload = () => {
                const range = quill.getSelection();
                quill.insertEmbed(range.index, 'image', reader.result);
              };
              reader.readAsDataURL(file);
            }
          };
        });

        // Add drag and drop support
        const editorElementForDrop = quill.container.querySelector('.ql-editor');
        if (editorElementForDrop) {
          editorElementForDrop.addEventListener('dragover', (e: DragEvent) => {
            e.preventDefault();
            editorElementForDrop.classList.add('drag-over');
          });

          editorElementForDrop.addEventListener('dragleave', (e: DragEvent) => {
            e.preventDefault();
            editorElementForDrop.classList.remove('drag-over');
          });

          editorElementForDrop.addEventListener('drop', (e: DragEvent) => {
            e.preventDefault();
            editorElementForDrop.classList.remove('drag-over');

            const files = e.dataTransfer?.files;
            if (files && files.length > 0) {
              const file = files[0];
              if (file && file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = () => {
                  const range = quill.getSelection() || { index: quill.getLength() };
                  quill.insertEmbed(range.index, 'image', reader.result);
                  console.log('✅ Image inserted via drag and drop');
                };
                reader.readAsDataURL(file);
              } else {
                console.log('❌ Only image files are supported for drag and drop');
              }
            }
          });
        }

        // Force toolbar to be visible immediately
        const toolbarElement = quill.getModule('toolbar').container;
        if (toolbarElement) {
          toolbarElement.style.display = 'flex';
          toolbarElement.style.visibility = 'visible';
          toolbarElement.style.opacity = '1';
          toolbarElement.style.height = 'auto';
        }

        // Ensure toolbar is always visible by adding focus/blur handlers
        const editorElementForFocus = quill.container.querySelector('.ql-editor');
        if (editorElementForFocus) {
          editorElementForFocus.addEventListener('focus', () => {
            if (toolbarElement) {
              toolbarElement.style.display = 'flex';
              toolbarElement.style.visibility = 'visible';
              toolbarElement.style.opacity = '1';
            }
          });

          editorElementForFocus.addEventListener('blur', () => {
            if (toolbarElement) {
              toolbarElement.style.display = 'flex';
              toolbarElement.style.visibility = 'visible';
              toolbarElement.style.opacity = '1';
            }
          });
        }

        console.log('✅ Quill instance created:', quill);

        // Listen for text changes
        quill.on('text-change', () => {
          form.description = quill.root.innerHTML;
        });

        // Set initial content if editing
        if (form.description) {
          quill.clipboard.dangerouslyPasteHTML(form.description);
        } else {
          // Add a small invisible character to ensure toolbar shows
          quill.setText('\u200B'); // Zero-width space
          quill.setSelection(0, 0); // Reset cursor to start
        }

        console.log('🎉 Quill editor initialized successfully!');
      } catch (err: any) {
        console.error('❌ Error initializing Quill:', err);
        if (err.stack) {
          console.error('Stack trace:', err.stack);
        }
      }
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

    // Helper functions
    const getInternalUserById = (id: string) => internalUsers.value.find((user) => user.id === id);
    const getClientUserById = (id: string) => clientUsers.value.find((person) => person.id === id);
    const getUserGroupById = (id: string) => userGroups.value.find((group) => group.id === id);
    const getTeamById = (id: string) => teams.value.find((team) => team.id === id);

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

    // Watch for modal visibility and initialize Quill when shown
    watch(
      () => props.show,
      (newShow) => {
        if (newShow) {
          nextTick(async () => {
            setTimeout(async () => {
              await initializeQuill();
            }, 500);
          });
        } else {
          if (quill) {
            quill = null;
          }
        }
      },
      { immediate: true }
    );

    onUnmounted(() => {
      if (quill) {
        quill = null;
      }
    });

    const handleSubmit = async () => {
      error.value = '';
      loading.value = true;
      try {
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
      } catch (err: any) {
        console.error('Failed to save project:', err);
        if (err.data?.errors) {
          const errors = err.data.errors;
          const firstError = Object.values(errors)[0];
          error.value = Array.isArray(firstError) ? firstError[0] : String(firstError);
        } else {
          error.value = err.data?.message || 'Failed to save project. Please try again.';
        }
      } finally {
        loading.value = false;
      }
    };

    return {
      loading,
      error,
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
      quill,
      getInternalUserById,
      getClientUserById,
      getUserGroupById,
      getTeamById,
      onClientChange,
      onAMChange,
      updateInternalTeamFromGroupsAndTeams,
      handleSubmit,
    };
  },
});
