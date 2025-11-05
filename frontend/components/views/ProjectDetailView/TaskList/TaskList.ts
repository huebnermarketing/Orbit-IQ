import { defineComponent, ref, onMounted } from 'vue';

// Types
interface Task {
  id: number;
  name: string;
  status: string;
  assigned_to?: User;
  due_date?: string;
  estimated_hours?: number;
  project_id?: number;
  completed_at?: string | null;
}

interface User {
  id: number;
  name: string;
  email: string;
}

interface Section {
  id: string;
  name: string;
  tasks: Task[];
}

export default defineComponent({
  name: 'TaskList',
  props: {
    projectId: {
      type: String,
      required: true
    }
  },
  emits: ['task-saved'],
  setup(props, { emit }) {
    const { $taskApi } = useNuxtApp() as any;
    
    // State
    const tasks = ref<Task[]>([]);
    const loading = ref(false);
    const showCreateTaskModal = ref(false);
    const showCreateSectionModal = ref(false);
    const activeFilters = ref(0);
    const newTaskName = ref<Record<string, string>>({});

    // User-created sections (this would come from API in real implementation)
    const userSections = ref<Section[]>([
      {
        id: '1',
        name: 'Planning',
        tasks: []
      },
      {
        id: '2', 
        name: 'Development',
        tasks: []
      },
      {
        id: '3',
        name: 'Testing',
        tasks: []
      }
    ]);

    // Methods
    const loadTasks = async () => {
      try {
        loading.value = true;
        const response = await $taskApi.getTasks({
          project_id: props.projectId,
          include_subtasks: true
        });
        tasks.value = response.data || [];
        
        // Distribute tasks to sections (in real implementation, tasks would have section_id)
        distributeTasksToSections();
      } catch (error) {
        console.error('Failed to load tasks:', error);
      } finally {
        loading.value = false;
      }
    };

    const distributeTasksToSections = () => {
      // Reset all sections
      userSections.value.forEach(section => {
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

    const toggleTaskStatus = async (task: Task) => {
      try {
        const newStatus = task.status === 'completed' ? 'todo' : 'completed';
        await $taskApi.updateTask(task.id.toString(), { status: newStatus });
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
          priority: 'medium'
        };

        await $taskApi.createTask(taskData);
        newTaskName.value[sectionId] = '';
        loadTasks();
      } catch (error) {
        console.error('Failed to create task:', error);
      }
    };

    const formatDate = (date: string) => {
      return new Date(date).toLocaleDateString();
    };

    // Lifecycle
    onMounted(() => {
      loadTasks();
    });

    return {
      tasks,
      loading,
      showCreateTaskModal,
      showCreateSectionModal,
      activeFilters,
      newTaskName,
      userSections,
      loadTasks,
      toggleTaskStatus,
      handleTaskSaved,
      addTaskToSection,
      formatDate,
    };
  },
});
