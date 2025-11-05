import { defineComponent } from 'vue';

// Types
interface Project {
  id: number;
  name: string;
  start_date?: string;
  due_date?: string;
  created_at: string;
  account_manager?: User;
  project_manager?: User;
}

interface User {
  id: number;
  name: string;
  email: string;
  avatar?: string;
}

export default defineComponent({
  name: 'ProjectManagement',
  props: {
    project: {
      type: Object as () => Project | null,
      default: null
    }
  },
  setup() {
    const getInitials = (name: string): string => {
      if (!name) return '?';
      return name
        .split(' ')
        .map(word => word[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
    };

    const formatDate = (date: string): string => {
      return new Date(date).toLocaleDateString();
    };

    return {
      getInitials,
      formatDate,
    };
  },
});
