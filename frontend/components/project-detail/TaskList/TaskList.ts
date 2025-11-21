import { defineComponent, ref, onMounted } from 'vue';

export default defineComponent({
  name: 'TaskList',
  props: {
    projectId: {
      type: String,
      required: true,
    },
  },
  emits: ['task-saved'],
  setup(props, { emit }) {
    const { $taskApi } = useNuxtApp();
    const tasks = ref<any[]>([]);
    const showCreateTaskModal = ref(false);
    const showCreateSectionModal = ref(false);
    const activeFilters = ref(0);
    const newTaskName = ref<Record<string, string>>({});

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
      emit('task-saved');
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

    const formatDate = (date: string): string => {
      return new Date(date).toLocaleDateString();
    };

    // Lifecycle
    onMounted(() => {
      loadTasks();
    });

    return {
      tasks,
      showCreateTaskModal,
      showCreateSectionModal,
      activeFilters,
      newTaskName,
      userSections,
      toggleTaskStatus,
      handleTaskSaved,
      addTaskToSection,
      formatDate,
    };
  },
});
