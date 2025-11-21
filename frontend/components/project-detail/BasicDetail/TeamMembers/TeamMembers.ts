import { defineComponent } from 'vue';
import type { Project } from '~/types';

export default defineComponent({
  name: 'TeamMembers',
  props: {
    project: {
      type: Object as () => Project | null,
      default: null,
    },
  },
  setup() {
    const enableEditing = () => {
      // TODO: Implement edit functionality
      console.log('Edit Team Members');
    };

    return {
      enableEditing,
    };
  },
});
