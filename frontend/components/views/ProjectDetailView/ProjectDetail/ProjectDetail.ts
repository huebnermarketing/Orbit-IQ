import { defineComponent, ref, computed, onMounted, watch, nextTick } from 'vue';
import type { Project } from '~/types';

export default defineComponent({
  name: 'ProjectDetail',
  props: {
    projectId: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const { $projectApi, $taskApi, $clientApi, $authApi } = useNuxtApp();
    const route = useRoute();

    // Reactive data
    const project = ref<Project | null>(null);
    const loading = ref(false);
    const activeTab = ref('overview');
    const quill = ref<any>(null);
    const tasks = ref<any[]>([]);
    const showCreateTaskModal = ref(false);
    const showCreateSectionModal = ref(false);
    const activeFilters = ref(0);
    const newTaskName = ref<Record<string, string>>({});

    // Basic Details editing state
    const isEditingBasicDetails = ref(false);
    const savingBasicDetails = ref(false);
    const originalBasicDetails = ref<any>(null);
    const editingBasicDetails = ref<any>(null);

    // Dropdown data for Basic Details editing
    const clients = ref<any[]>([]);
    const subClients = ref<any[]>([]);
    const projectStatuses = ref<any[]>([]);
    const projectTypes = ref<any[]>([]);

    // Tab configuration
    const tabs = ref([
      { id: 'overview', name: 'Overview' },
      { id: 'task_list', name: 'Task list' },
      { id: 'activity', name: 'Activity' },
      { id: 'client', name: 'Client' },
      { id: 'hour_report', name: 'Hour report' },
    ]);

    // User-created sections (this would come from API in real implementation)
    const userSections = ref<Array<{ id: string; name: string; tasks: any[] }>>([
      {
        id: '1',
        name: 'Planning',
        tasks: [],
      },
      {
        id: '2',
        name: 'Development',
        tasks: [],
      },
      {
        id: '3',
        name: 'Testing',
        tasks: [],
      },
    ]);

    // Computed
    const isDev = computed(() => import.meta.dev);

    // Methods
    const loadProject = async () => {
      try {
        loading.value = true;

        console.log('Loading project with ID:', props.projectId);
        const response = await $projectApi.getProject(props.projectId);
        console.log('API Response:', response);
        project.value = response;
      } catch (err: any) {
        console.error('Failed to load project:', err);
        showError({
          statusCode: err.status || 500,
          statusMessage: err.statusText || 'Error',
          message: err.message || 'Failed to load project',
        });
      } finally {
        loading.value = false;
      }
    };

    const loadTasks = async () => {
      try {
        const response = await $taskApi.getTasks({
          project_id: props.projectId,
          include_subtasks: true,
        });
        tasks.value = response.data || [];

        // Distribute tasks to sections (in real implementation, tasks would have section_id)
        distributeTasksToSections();
      } catch (error) {
        console.error('Failed to load tasks:', error);
      }
    };

    const distributeTasksToSections = () => {
      // Reset all sections
      userSections.value.forEach((section) => {
        section.tasks = [];
      });

      // Distribute tasks evenly across sections for demo purposes
      // In real implementation, tasks would have a section_id field
      tasks.value.forEach((task, index) => {
        const sectionIndex = index % userSections.value.length;
        const section = userSections.value[sectionIndex];
        if (section) {
          section.tasks.push(task);
        }
      });
    };

    const toggleTaskStatus = async (task: any) => {
      try {
        const newStatus = task.status === 'completed' ? 'todo' : 'completed';
        await $taskApi.updateTask(task.id, { status: newStatus });
        task.status = newStatus;
        if (newStatus === 'completed') {
          task.completed_at = new Date().toISOString();
        } else {
          task.completed_at = null;
        }
      } catch (error) {
        console.error('Failed to update task status:', error);
      }
    };

    const handleTaskSaved = () => {
      loadTasks();
    };

    // Data loading functions for Basic Details editing
    const loadClientsData = async () => {
      try {
        const response = await $clientApi.getClients();
        clients.value = response.data || [];
      } catch (error) {
        console.error('Failed to load clients:', error);
        clients.value = [];
      }
    };

    const loadSubClientsData = async (clientId: string | number) => {
      try {
        if (!clientId) {
          subClients.value = [];
          return;
        }
        const response = await $clientApi.getSubClients(String(clientId));
        subClients.value = response || [];
      } catch (error) {
        console.error('Failed to load sub-clients:', error);
        subClients.value = [];
      }
    };

    const loadProjectStatusesData = async () => {
      try {
        const response = await $authApi.getProjectStatuses();
        projectStatuses.value = response.data || [];
      } catch (error) {
        console.error('Failed to load project statuses:', error);
        projectStatuses.value = [];
      }
    };

    const loadProjectTypesData = async () => {
      try {
        const response = await $projectApi.getProjectTypes();
        projectTypes.value = response.data || [];
      } catch (error) {
        console.error('Failed to load project types:', error);
        projectTypes.value = [];
      }
    };

    // Client change handler for Basic Details editing
    const onBasicDetailsClientChange = async () => {
      if (!editingBasicDetails.value) return;

      // Reset sub-client when client changes
      editingBasicDetails.value.sub_client_id = '';

      // Load sub-clients for new client
      if (editingBasicDetails.value.client_id) {
        await loadSubClientsData(editingBasicDetails.value.client_id);
      } else {
        subClients.value = [];
      }
    };

    // Basic Details editing functions
    const enableEditingBasicDetails = async () => {
      if (!project.value) return;

      // Load dropdown data first
      await Promise.all([loadClientsData(), loadProjectStatusesData(), loadProjectTypesData()]);

      // Store original data for potential rollback
      originalBasicDetails.value = { ...project.value };
      editingBasicDetails.value = { ...project.value };

      // Load sub-clients if client is selected
      if (project.value.client_id) {
        await loadSubClientsData(project.value.client_id);
      }

      isEditingBasicDetails.value = true;
    };

    const saveBasicDetails = async () => {
      if (!editingBasicDetails.value || !project.value) return;

      try {
        savingBasicDetails.value = true;

        // Prepare update data maintaining relationships
        const updateData = {
          name: editingBasicDetails.value.name,
          project_number: editingBasicDetails.value.project_number,
          job_code: editingBasicDetails.value.job_code,
          client_id: editingBasicDetails.value.client_id,
          sub_client_id: editingBasicDetails.value.sub_client_id,
          project_status_id: editingBasicDetails.value.project_status_id,
          project_type_id: editingBasicDetails.value.project_type_id,
          project_manager_id: editingBasicDetails.value.project_manager_id,
          account_manager_id: editingBasicDetails.value.account_manager_id,
          start_date: editingBasicDetails.value.start_date,
          due_date: editingBasicDetails.value.due_date,
          hour_type: editingBasicDetails.value.hour_type,
          funding_source: editingBasicDetails.value.funding_source,
        };

        // Update project via API
        const response = await $projectApi.updateProject(props.projectId, updateData);

        // Reconstruct the project object with proper relationships
        const updatedProject = {
          ...project.value,
          ...editingBasicDetails.value,
          // If API response contains updated relationships, merge them too
          ...response,
        };

        // Update relationship objects from loaded dropdown data
        if (editingBasicDetails.value.client_id) {
          const selectedClient = clients.value.find(
            (c) => c.id == editingBasicDetails.value.client_id
          );
          if (selectedClient) {
            updatedProject.client = selectedClient;
          }
        }

        if (editingBasicDetails.value.sub_client_id) {
          const selectedSubClient = subClients.value.find(
            (sc) => sc.id == editingBasicDetails.value.sub_client_id
          );
          if (selectedSubClient) {
            updatedProject.sub_client = selectedSubClient;
          }
        }

        if (editingBasicDetails.value.project_status_id) {
          const selectedStatus = projectStatuses.value.find(
            (s) => s.id == editingBasicDetails.value.project_status_id
          );
          if (selectedStatus) {
            updatedProject.project_status = selectedStatus;
          }
        }

        if (editingBasicDetails.value.project_type_id) {
          const selectedType = projectTypes.value.find(
            (t) => t.id == editingBasicDetails.value.project_type_id
          );
          if (selectedType) {
            updatedProject.project_type = selectedType;
          }
        }

        // Update local project data
        project.value = updatedProject;

        // Exit editing mode
        isEditingBasicDetails.value = false;
        originalBasicDetails.value = null;
        editingBasicDetails.value = null;
      } catch (error) {
        console.error('Failed to save basic details:', error);
        // TODO: Show error message to user
      } finally {
        savingBasicDetails.value = false;
      }
    };

    const discardBasicDetailsChanges = () => {
      // Restore original data
      if (originalBasicDetails.value) {
        project.value = { ...originalBasicDetails.value };
      }

      // Exit editing mode
      isEditingBasicDetails.value = false;
      originalBasicDetails.value = null;
      editingBasicDetails.value = null;
    };

    const addTaskToSection = async (sectionId: string) => {
      const taskName = newTaskName.value[sectionId];
      if (!taskName?.trim()) return;

      try {
        const taskData = {
          name: taskName.trim(),
          project_id: props.projectId,
          status: 'todo',
          priority: 'medium',
        };

        await $taskApi.createTask(taskData);
        newTaskName.value[sectionId] = '';
        loadTasks();
      } catch (error) {
        console.error('Failed to create task:', error);
      }
    };

    const getCompanyInitials = (companyName: string): string => {
      if (!companyName) return '?';
      return companyName
        .split(' ')
        .map((word) => word[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
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

    const formatDate = (date: string): string => {
      return new Date(date).toLocaleDateString();
    };

    // Quill editor methods
    const updateDescription = (event: Event) => {
      const target = event.target as HTMLTextAreaElement;
      if (project.value) {
        project.value.description = target.value;
      }
    };

    const saveProjectDescription = async () => {
      if (!project.value) return;

      try {
        let content = '';

        if (quill.value) {
          // Quill editor
          content = quill.value.root.innerHTML;
        } else {
          // Fallback textarea - get content from project data
          content = project.value.description || '';
        }

        // Only save if content has changed
        if (content !== project.value.description) {
          await $projectApi.updateProject(props.projectId, {
            description: content,
          });

          // Update local project data
          project.value.description = content;
          console.log('Project description auto-saved successfully');
        }
      } catch (error) {
        console.error('Failed to auto-save project description:', error);
      }
    };

    const initializeDescriptionEditor = async () => {
      console.log('Starting description editor initialization...');

      // Check if the element exists
      const editorElement = document.getElementById('project-description-editor');
      if (!editorElement) {
        console.error('❌ Description editor element not found');
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
        quill.value = new QuillClass('#project-description-editor', {
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
        const toolbar = quill.value.getModule('toolbar');
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
                const range = quill.value.getSelection();
                quill.value.insertEmbed(range.index, 'image', reader.result);
              };
              reader.readAsDataURL(file);
            }
          };
        });

        // Add drag and drop support
        const editorElementForDrop = quill.value.container.querySelector('.ql-editor');
        if (editorElementForDrop) {
          editorElementForDrop.addEventListener('dragover', (e: DragEvent) => {
            e.preventDefault();
            (editorElementForDrop as HTMLElement).classList.add('drag-over');
          });

          editorElementForDrop.addEventListener('dragleave', (e: DragEvent) => {
            e.preventDefault();
            (editorElementForDrop as HTMLElement).classList.remove('drag-over');
          });

          editorElementForDrop.addEventListener('drop', (e: DragEvent) => {
            e.preventDefault();
            (editorElementForDrop as HTMLElement).classList.remove('drag-over');

            const files = e.dataTransfer?.files;
            if (files && files.length > 0) {
              const file = files[0];
              if (file && file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = () => {
                  const range = quill.value.getSelection() || { index: quill.value.getLength() };
                  quill.value.insertEmbed(range.index, 'image', reader.result);
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
        const toolbarElement = quill.value.getModule('toolbar').container;
        if (toolbarElement) {
          (toolbarElement as HTMLElement).style.display = 'flex';
          (toolbarElement as HTMLElement).style.visibility = 'visible';
          (toolbarElement as HTMLElement).style.opacity = '1';
          (toolbarElement as HTMLElement).style.height = 'auto';
        }

        // Listen for text changes
        quill.value.on('text-change', () => {
          if (project.value) {
            project.value.description = quill.value.root.innerHTML;
          }
        });

        // Set initial content if editing
        if (project.value?.description) {
          quill.value.clipboard.dangerouslyPasteHTML(project.value.description);
        }

        // Remove focus from editor to prevent auto-focus on page load
        quill.value.blur();

        console.log('🎉 Description editor initialized successfully!');
      } catch (error: any) {
        console.error('❌ Error initializing description editor:', error);
        if (error.stack) {
          console.error('Stack trace:', error.stack);
        }
      }
    };

    // Lifecycle
    onMounted(() => {
      loadProject();
      loadTasks();

      // Initialize editor if we're already on overview tab
      if (activeTab.value === 'overview') {
        nextTick(() => {
          setTimeout(() => {
            initializeDescriptionEditor();
          }, 100);
        });
      }
    });

    // Watch for tab changes to initialize editor
    watch(activeTab, (newTab) => {
      if (newTab === 'overview') {
        nextTick(() => {
          initializeDescriptionEditor();
        });
      }
    });

    // Watch for project data to initialize editor with content (only when project first loads)
    watch(
      project,
      (newProject) => {
        if (
          newProject &&
          activeTab.value === 'overview' &&
          quill.value &&
          !quill.value.getText().trim()
        ) {
          // Only set content if editor is empty (initial load)
          quill.value.root.innerHTML = newProject.description || '';
        }
      },
      { deep: true }
    );

    // Watch for route changes
    watch(
      () => route.params.id,
      (newId) => {
        if (newId) {
          loadProject();
          loadTasks();
        }
      }
    );

    return {
      project,
      loading,
      activeTab,
      tabs,
      quill,
      tasks,
      showCreateTaskModal,
      showCreateSectionModal,
      activeFilters,
      newTaskName,
      userSections,
      isEditingBasicDetails,
      savingBasicDetails,
      editingBasicDetails,
      clients,
      subClients,
      projectStatuses,
      projectTypes,
      isDev,
      loadProject,
      loadTasks,
      toggleTaskStatus,
      handleTaskSaved,
      enableEditingBasicDetails,
      saveBasicDetails,
      discardBasicDetailsChanges,
      onBasicDetailsClientChange,
      addTaskToSection,
      getCompanyInitials,
      getInitials,
      formatDate,
      updateDescription,
      saveProjectDescription,
      initializeDescriptionEditor,
    };
  },
});
