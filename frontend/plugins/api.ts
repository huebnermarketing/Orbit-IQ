import { authApi } from '@/composables/api/authApi';
import { clientApi } from '@/composables/api/clientApi';
import { projectApi } from '@/composables/api/projectApi';
import { userApi } from '@/composables/api/userApi';
import { taskApi } from '@/composables/api/taskApi';
import { organizationApi } from '@/composables/api/organizationApi';

export default defineNuxtPlugin(() => ({
  provide: {
    authApi,
    clientApi,
    projectApi,
    userApi,
    taskApi,
    organizationApi,
  },
}));
