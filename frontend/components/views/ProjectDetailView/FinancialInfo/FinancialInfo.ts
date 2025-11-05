import { defineComponent } from 'vue';

// Types
interface Project {
  id: number;
  name: string;
  hour_type?: string;
  funding_source?: string;
  project_type?: ProjectType;
  client?: Client;
}

interface ProjectType {
  id: number;
  name: string;
  color: string;
}

interface Client {
  id: number;
  company_name: string;
}

export default defineComponent({
  name: 'FinancialInfo',
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
