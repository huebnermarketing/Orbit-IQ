import { type Ref, watch, nextTick, onBeforeUnmount } from 'vue';
import {
  useFloating,
  offset,
  flip,
  shift,
  size,
  autoUpdate,
  type Placement,
  type Middleware,
  type Boundary,
} from '@floating-ui/vue';

export interface FloatingPositionOptions {
  placement?: Placement;
  offset?: number;
  shiftPadding?: number;
  autoSize?: boolean;
  flip?: boolean;
  shift?: boolean;
  boundary?: Boundary;
  strategy?: 'absolute' | 'fixed';
  whileElementsMounted?: typeof autoUpdate;
  middleware?: Middleware[];
}

export const useFloatingPosition = (
  referenceRef: Ref<HTMLElement | null>,
  floatingRef: Ref<HTMLElement | null>,
  options: FloatingPositionOptions = {}
) => {
  const {
    placement = 'bottom-start',
    offset: offsetValue = 4,
    shiftPadding = 8,
    autoSize = true,
    flip: enableFlip = true,
    shift: enableShift = true,
    boundary,
    strategy = 'fixed',
    middleware: customMiddleware = [],
  } = options;

  // Build middleware array
  const middleware: Middleware[] = [];

  // Add offset middleware
  if (offsetValue > 0) {
    middleware.push(offset(offsetValue));
  }

  // Add flip middleware
  if (enableFlip) {
    middleware.push(flip());
  }

  // Add shift middleware
  if (enableShift) {
    middleware.push(
      shift({
        padding: shiftPadding,
        boundary: boundary || 'viewport',
        // Enable cross-axis shifting to ensure spacing on all sides
        crossAxis: true,
      })
    );
  }

  // Add size middleware for auto-sizing
  if (autoSize) {
    middleware.push(
      size({
        apply({ elements }) {
          const referenceWidth = elements.reference.getBoundingClientRect().width;
          elements.floating.style.width = `${referenceWidth}px`;
        },
      })
    );
  }

  // Add custom middleware after default ones
  if (customMiddleware.length > 0) {
    middleware.push(...customMiddleware);
  }

  // Use Floating UI
  // For conditional rendering (v-if), we need to handle updates manually
  // autoUpdate only works when both elements are mounted at the same time
  const {
    floatingStyles,
    placement: computedPlacement,
    update,
  } = useFloating(referenceRef, floatingRef, {
    placement,
    middleware,
    strategy,
    // Don't use autoUpdate for conditional rendering - we'll handle it manually
    whileElementsMounted: undefined,
  });

  // Handle conditional rendering (v-if) - set up auto-update when both elements are available
  let cleanup: (() => void) | null = null;

  const setupAutoUpdate = async () => {
    if (referenceRef.value && floatingRef.value) {
      // Clean up previous auto-update if exists
      if (cleanup) {
        cleanup();
        cleanup = null;
      }

      // Wait for DOM to be ready
      await nextTick();

      // Set up auto-update when both elements are available
      cleanup = autoUpdate(referenceRef.value, floatingRef.value, update);
    } else {
      // Clean up if elements are not available
      if (cleanup) {
        cleanup();
        cleanup = null;
      }
    }
  };

  // Watch for when floating element becomes available
  watch(floatingRef, setupAutoUpdate, { immediate: true });

  // Watch for when reference element becomes available
  watch(referenceRef, setupAutoUpdate, { immediate: true });

  // Clean up on unmount
  onBeforeUnmount(() => {
    if (cleanup) {
      cleanup();
    }
  });

  return {
    floatingStyles,
    placement: computedPlacement,
    update,
  };
};
