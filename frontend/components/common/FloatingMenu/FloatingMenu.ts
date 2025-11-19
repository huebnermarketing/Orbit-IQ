import { defineComponent, ref, computed, onMounted, onBeforeUnmount, watch } from 'vue';
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
  width?: string | number;
  minWidth?: string | number;
  maxWidth?: string | number;
  maxHeight?: string | number;
  shiftPadding?: number;
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
    width: {
      type: [String, Number],
      default: undefined,
    },
    minWidth: {
      type: [String, Number],
      default: 200,
    },
    maxWidth: {
      type: [String, Number],
      default: 320,
    },
    maxHeight: {
      type: [String, Number],
      default: undefined,
    },
    shiftPadding: {
      type: Number,
      default: 16,
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
      shiftPadding: props.shiftPadding,
      autoSize: false,
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

    const menuStyle = computed(() => {
      const style: Record<string, string> = {};
      if (props.width) {
        style.width = typeof props.width === 'number' ? `${props.width}px` : props.width;
      }
      if (props.minWidth) {
        style.minWidth =
          typeof props.minWidth === 'number' ? `${props.minWidth}px` : props.minWidth;
      }
      if (props.maxWidth) {
        // Ensure maxWidth doesn't exceed viewport
        const maxWidthValue =
          typeof props.maxWidth === 'number' ? props.maxWidth : parseInt(props.maxWidth);
        const padding = (props.shiftPadding || 16) * 2;
        style.maxWidth = `min(${maxWidthValue}px, calc(100vw - ${padding}px))`;
      }
      if (props.maxHeight) {
        // Ensure maxHeight doesn't exceed viewport
        const maxHeightValue =
          typeof props.maxHeight === 'number' ? props.maxHeight : parseInt(props.maxHeight);
        const padding = (props.shiftPadding || 16) * 2;
        // Set height to maxHeight to enable scrolling, CSS will constrain to viewport
        style.height = `${maxHeightValue}px`;
        style.maxHeight = `min(${maxHeightValue}px, calc(100vh - ${padding}px))`;
      }
      return style;
    });

    return {
      isOpen,
      triggerRef,
      floatingRef,
      floatingStyles,
      menuStyle,
      toggleMenu,
      closeMenu,
    };
  },
});
