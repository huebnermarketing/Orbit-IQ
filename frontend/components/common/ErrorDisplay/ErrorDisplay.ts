import { defineComponent, computed, defineAsyncComponent } from 'vue';

const NotFoundIcon = defineAsyncComponent(() => import('~/components/icons/NotFoundIcon.vue'));
const ServerErrorIcon = defineAsyncComponent(() => import('~/components/icons/ServerErrorIcon.vue'));
const ForbiddenIcon = defineAsyncComponent(() => import('~/components/icons/ForbiddenIcon.vue'));
const UnauthorizedIcon = defineAsyncComponent(() => import('~/components/icons/UnauthorizedIcon.vue'));
const NetworkErrorIcon = defineAsyncComponent(() => import('~/components/icons/NetworkErrorIcon.vue'));
const GeneralErrorIcon = defineAsyncComponent(() => import('~/components/icons/GeneralErrorIcon.vue'));

type ErrorType = '404' | '500' | '403' | '401' | 'network' | 'general' | 'custom';

interface ErrorAction {
  label: string;
  type?: 'button' | 'link';
  handler?: () => void;
  to?: string;
  icon?: string;
  variant?: 'primary' | 'secondary' | 'danger';
  disabled?: boolean;
}

export default defineComponent({
  name: 'ErrorDisplay',
  props: {
    // Accept error object directly
    error: {
      type: Object as () => {
        statusCode?: number;
        code?: number;
        statusMessage?: string;
        message?: string;
        stack?: string;
        data?: any;
        path?: string;
      },
      default: () => ({})
    },
    // Or accept individual props (for backward compatibility)
    title: {
      type: String,
      default: ''
    },
    message: {
      type: String,
      default: ''
    },
    details: {
      type: String,
      default: ''
    },
    type: {
      type: String as () => ErrorType,
      default: '' as ErrorType
    },
    actions: {
      type: Array as () => ErrorAction[],
      default: () => []
    }
  },
  setup(props) {
    const router = useRouter();

    // If error prop is provided, compute everything from it
    const statusCode = computed(() => {
      if (props.error) {
        return props.error.statusCode || props.error.code;
      }
      return undefined;
    });

    const errorType = computed((): ErrorType => {
      // If type prop is provided, use it
      if (props.type) {
        return props.type;
      }

      // Otherwise, compute from error object
      if (props.error) {
        // Check if it's a network error
        if (props.error.data?.type === 'network' || statusCode.value === 0) {
          return 'network';
        }
        
        if (!statusCode.value) return 'general';
        
        switch (statusCode.value) {
          case 404:
            return '404';
          case 500:
            return '500';
          case 403:
            return '403';
          case 401:
            return '401';
          default:
            return 'general';
        }
      }
      
      return 'general';
    });

    const errorTitle = computed((): string => {
      // If title prop is provided, use it
      if (props.title) {
        return props.title;
      }

      // Otherwise, compute from error object
      if (props.error) {
        // Check if it's a network error
        if (props.error.data?.type === 'network' || statusCode.value === 0) {
          return 'Connection Error';
        }
        
        if (!statusCode.value) return 'Error';
        
        switch (statusCode.value) {
          case 404:
            return 'Page Not Found';
          case 500:
            return 'Server Error';
          case 403:
            return 'Access Denied';
          case 401:
            return 'Unauthorized';
          default:
            return 'Error';
        }
      }
      
      return 'Error';
    });

    const errorMessage = computed((): string => {
      // If message prop is provided, use it
      if (props.message) {
        return props.message;
      }

      // Otherwise, compute from error object
      if (props.error) {
        if (props.error.message) {
          return props.error.message;
        }
        if (props.error.statusMessage) {
          return props.error.statusMessage;
        }
      }
      
      return 'An unexpected error occurred.';
    });

    const errorDetails = computed((): string => {
      // If details prop is provided, use it
      if (props.details) {
        return props.details;
      }

      // Otherwise, compute from error object
      if (props.error) {
        if (props.error.data?.message) {
          return props.error.data.message;
        }
        if (process.dev && props.error.stack) {
          return props.error.stack;
        }
      }
      
      return '';
    });

    const errorActions = computed((): ErrorAction[] => {
      // If actions prop is provided, use it
      if (props.actions && props.actions.length > 0) {
        return props.actions;
      }

      // Otherwise, compute from error object
      const actions: ErrorAction[] = [
        {
          label: 'Go Back',
          type: 'button',
          handler: () => router.back(),
          icon: 'fas fa-undo',
          variant: 'secondary'
        },
        {
          label: 'Go to Dashboard',
          type: 'link',
          to: '/dashboard',
          icon: 'fas fa-home',
          variant: 'primary'
        }
      ];

      // For 404 errors, add projects link at the beginning
      if (props.error && (props.error.statusCode === 404 || props.error.code === 404)) {
        actions.unshift({
          label: 'Back to Projects',
          type: 'link',
          to: '/projects',
          icon: 'fas fa-arrow-left',
          variant: 'primary'
        });
      }

      return actions;
    });

    const goBack = () => {
      router.back();
    };

    const getActionClass = (variant: string = 'primary') => {
      const baseClass = 'inline-flex items-center justify-center px-6 py-3 font-medium rounded-lg transition-colors';
      const variants = {
        primary: 'bg-primary-600 text-white hover:bg-primary-700',
        secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300',
        danger: 'bg-error-600 text-white hover:bg-error-700'
      };
      return `${baseClass} ${variants[variant as keyof typeof variants] || variants.primary}`;
    };

    // Icon component based on error type
    const iconComponent = computed(() => {
      switch (errorType.value) {
        case '404':
          return NotFoundIcon;
        case '500':
          return ServerErrorIcon;
        case '403':
          return ForbiddenIcon;
        case '401':
          return UnauthorizedIcon;
        case 'network':
          return NetworkErrorIcon;
        default: // general or custom
          return GeneralErrorIcon;
      }
    });

    const iconClass = computed(() => {
      const baseClass = 'error-icon';
      const typeClasses = {
        '404': 'text-gray-400',
        '500': 'text-error-500',
        '403': 'text-warning-500',
        '401': 'text-warning-500',
        'network': 'text-error-500',
        'general': 'text-error-500',
        'custom': 'text-gray-400'
      };
      return `${baseClass} ${typeClasses[errorType.value] || typeClasses.general}`;
    });

    const iconWrapperClass = computed(() => {
      const typeClasses = {
        '404': 'text-gray-400',
        '500': 'text-error-500',
        '403': 'text-warning-500',
        '401': 'text-warning-500',
        'network': 'text-error-500',
        'general': 'text-error-500',
        'custom': 'text-gray-400'
      };
      return typeClasses[errorType.value] || typeClasses.general;
    });

    return {
      goBack,
      getActionClass,
      iconComponent,
      iconClass,
      iconWrapperClass,
      errorType,
      errorTitle,
      errorMessage,
      errorDetails,
      errorActions
    };
  }
});

