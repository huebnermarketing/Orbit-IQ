import { defineComponent, defineAsyncComponent } from 'vue';
import { useToast } from '~/composables/useToast';
import type { Toast } from '~/composables/useToast';

const SuccessIcon = defineAsyncComponent(() => import('~/components/icons/SuccessIcon.vue'));
const ErrorIcon = defineAsyncComponent(() => import('~/components/icons/ErrorIcon.vue'));
const WarningIcon = defineAsyncComponent(() => import('~/components/icons/WarningIcon.vue'));
const InfoIcon = defineAsyncComponent(() => import('~/components/icons/InfoIcon.vue'));
const CloseIcon = defineAsyncComponent(() => import('~/components/icons/CloseIcon.vue'));

export default defineComponent({
  name: 'ToastContainer',
  setup() {
    const { toasts, removeToast } = useToast();

    const getToastClasses = (type: Toast['type']): string => {
      const classes: Record<Toast['type'], string> = {
        success: 'bg-teal-100 border-teal-400 text-teal-700',
        error: 'bg-red-100 border-red-400 text-red-700',
        warning: 'bg-yellow-100 border-yellow-400 text-yellow-700',
        info: 'bg-blue-100 border-blue-400 text-blue-700',
      };
      return classes[type] || classes.info;
    };

    const getToastIcon = (type: Toast['type']) => {
      const icons: Record<Toast['type'], any> = {
        success: SuccessIcon,
        error: ErrorIcon,
        warning: WarningIcon,
        info: InfoIcon,
      };
      return icons[type] || icons.info;
    };

    return {
      toasts,
      removeToast,
      getToastClasses,
      getToastIcon,
      CloseIcon,
    };
  },
});