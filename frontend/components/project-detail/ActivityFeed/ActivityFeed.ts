import { defineComponent, ref, onMounted } from 'vue';

// Types
interface Activity {
  id: number;
  title: string;
  description: string;
  type: string;
  created_at: string;
  user?: User;
}

interface User {
  id: number;
  name: string;
  email: string;
}

export default defineComponent({
  name: 'ActivityFeed',
  props: {
    projectId: {
      type: String,
      required: true
    }
  },
  setup() {
    
    // State
    const activities = ref<Activity[]>([]);
    const loading = ref(false);

    // Methods
    const loadActivities = async () => {
      try {
        loading.value = true;
        // For now, simulate activities since $activityApi might not exist
        // const response = await $activityApi.getProjectActivities(props.projectId);
        // activities.value = response.data || [];
        activities.value = []; // Empty for now
      } catch (error) {
        console.error('Failed to load activities:', error);
        activities.value = [];
      } finally {
        loading.value = false;
      }
    };

    const getActivityIcon = (type: string): string => {
      const icons: Record<string, string> = {
        'task_created': 'fas fa-plus',
        'task_updated': 'fas fa-edit',
        'task_completed': 'fas fa-check',
        'comment_added': 'fas fa-comment',
        'file_uploaded': 'fas fa-file',
        'status_changed': 'fas fa-exchange-alt',
        'default': 'fas fa-circle'
      };
      
      return icons[type] || 'fas fa-circle';
    };

    const formatDate = (date: string): string => {
      return new Date(date).toLocaleDateString();
    };

    const getInitials = (name: string): string => {
      if (!name) return '?';
      return name
        .split(' ')
        .map(word => word[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
    };

    // Lifecycle
    onMounted(() => {
      loadActivities();
    });

    return {
      activities,
      loading,
      getActivityIcon,
      formatDate,
      getInitials,
    };
  },
});
