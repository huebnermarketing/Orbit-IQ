import { defineComponent } from 'vue';

// Types
interface Project {
  id: number;
  name: string;
}

export default defineComponent({
  name: 'TeamMembers',
  props: {
    project: {
      type: Object as () => Project | null,
      default: null
    }
  },
  setup() {
    return {};
  },
});
