import { defineComponent, ref, onMounted, onBeforeUnmount, watch } from 'vue';
import { useFloatingPosition } from '~/composables/useFloatingPosition';

export interface FloatingMenuProps {
  placement?:
    | 'top'
    | 'bottom'
    | 'left'
    | 'right'
    | 'top-start'
    | 'top-end'
    | 'bottom-start'
    | 'bottom-end'
    | 'left-start'
    | 'left-end'
    | 'right-start'
    | 'right-end';
  offset?: number;
  trigger?: 'click' | 'hover';
  closeOnClickOutside?: boolean;
  shown?: boolean;
}

export default defineComponent({
  name: 'FloatingMenu',
  props: {
    placement: {
      type: String,
      default: 'bottom-start',
    },
    offset: {
      type: Number,
      default: 4,
    },
    trigger: {
      type: String as () => 'click' | 'hover',
      default: 'click',
    },
    closeOnClickOutside: {
      type: Boolean,
      default: true,
    },
    shown: {
      type: Boolean,
      default: undefined,
    },
  },
  emits: ['open', 'close', 'update:shown'],
  setup(props: FloatingMenuProps, { emit }) {
    const isOpen = ref(props.shown ?? false);
    const triggerRef = ref<HTMLElement | null>(null);
    const floatingRef = ref<HTMLElement | null>(null);

    // Use the global floating position composable
    const { floatingStyles } = useFloatingPosition(triggerRef, floatingRef, {
      placement: props.placement as any,
      offset: props.offset,
      shiftPadding: 8,
      autoSize: true,
      flip: true,
      shift: true,
    });

    // Watch for external changes to shown prop
    watch(
      () => props.shown,
      (newValue) => {
        if (newValue !== undefined) {
          isOpen.value = newValue;
        }
      }
    );

    const toggleMenu = () => {
      if (props.trigger === 'click') {
        const newValue = !isOpen.value;
        isOpen.value = newValue;
        if (props.shown === undefined) {
          // Uncontrolled mode
          if (newValue) {
            emit('open');
          } else {
            emit('close');
          }
        } else {
          // Controlled mode
          emit('update:shown', newValue);
          if (newValue) {
            emit('open');
          } else {
            emit('close');
          }
        }
      }
    };

    const closeMenu = () => {
      if (props.shown === undefined) {
        isOpen.value = false;
        emit('close');
      } else {
        emit('update:shown', false);
        emit('close');
      }
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (
        props.closeOnClickOutside &&
        isOpen.value &&
        triggerRef.value &&
        floatingRef.value &&
        !triggerRef.value.contains(event.target as Node) &&
        !floatingRef.value.contains(event.target as Node)
      ) {
        closeMenu();
      }
    };

    onMounted(() => {
      if (props.closeOnClickOutside) {
        document.addEventListener('click', handleClickOutside);
      }
    });

    onBeforeUnmount(() => {
      if (props.closeOnClickOutside) {
        document.removeEventListener('click', handleClickOutside);
      }
    });

    return {
      isOpen,
      triggerRef,
      floatingRef,
      floatingStyles,
      toggleMenu,
      closeMenu,
    };
  },
});
