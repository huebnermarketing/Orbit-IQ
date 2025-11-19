import { defineComponent, computed, ref, onMounted, onBeforeUnmount } from 'vue';
import { useFloatingPosition } from '~/composables/useFloatingPosition';

export interface SelectOption {
  label: string;
  value: string | number;
  disabled?: boolean;
}

export default defineComponent({
  name: 'BaseSelect',
  props: {
    modelValue: {
      type: [String, Number],
      default: '',
    },
    options: {
      type: Array as () => SelectOption[] | string[] | number[],
      required: true,
    },
    placeholder: {
      type: String,
      default: '',
    },
    id: {
      type: String,
      default: '',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    required: {
      type: Boolean,
      default: false,
    },
    errorMessage: {
      type: String,
      default: '',
    },
    hint: {
      type: String,
      default: '',
    },
    size: {
      type: String as () => 'sm' | 'md' | 'lg',
      default: 'md',
    },
    variant: {
      type: String as () => 'default' | 'outlined',
      default: 'default',
    },
    wrapperClass: {
      type: String,
      default: '',
    },
    searchable: {
      type: Boolean,
      default: true,
    },
  },
  emits: ['update:modelValue', 'change', 'blur', 'focus'],
  setup(props, { emit }) {
    const isOpen = ref(false);
    const wrapperRef = ref<HTMLElement | null>(null);
    const triggerRef = ref<HTMLElement | null>(null);
    const dropdownRef = ref<HTMLElement | null>(null);
    const searchInputRef = ref<HTMLInputElement | null>(null);
    const searchQuery = ref('');

    const hasError = computed(() => !!props.errorMessage);

    const selectClass = computed(() => {
      const sizeClasses = {
        sm: 'px-3 py-2 text-sm',
        md: 'px-4 py-3 text-sm',
        lg: 'px-4 py-3.5 text-base',
      };
      const variantClasses = {
        default: 'border',
        outlined: 'border-2',
      };
      const baseClasses =
        'w-full appearance-none bg-surface rounded-lg shadow-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 pr-3 text-left flex items-center justify-between';
      const sizeClass = sizeClasses[props.size];
      const variantClass = variantClasses[props.variant];
      const errorClass = hasError.value
        ? 'border-error-500 focus:ring-error-500 focus:border-error-500'
        : 'border-border-light';
      return `${baseClasses} ${sizeClass} ${variantClass} ${errorClass}`.trim();
    });

    const displayValue = computed(() => {
      if (props.modelValue === '' && props.placeholder) {
        return props.placeholder;
      }
      const selectedOption = props.options.find((opt) => getOptionValue(opt) === props.modelValue);
      if (selectedOption) {
        return getOptionLabel(selectedOption);
      }
      return props.placeholder || '';
    });

    const filteredOptions = computed(() => {
      if (!props.searchable || !searchQuery.value) {
        return props.options;
      }
      const query = searchQuery.value.toLowerCase();
      return props.options.filter((option) => {
        const label = getOptionLabel(option).toLowerCase();
        return label.includes(query);
      });
    });

    const getOptionValue = (option: SelectOption | string | number): string | number => {
      if (typeof option === 'string' || typeof option === 'number') {
        return option;
      }
      return option.value;
    };

    const getOptionLabel = (option: SelectOption | string | number): string => {
      if (typeof option === 'string' || typeof option === 'number') {
        return String(option);
      }
      return option.label;
    };

    const isOptionDisabled = (option: SelectOption | string | number): boolean => {
      if (typeof option === 'string' || typeof option === 'number') {
        return false;
      }
      return option.disabled || false;
    };

    // Floating UI setup for automatic repositioning
    // Use absolute positioning like BaseMultiSelect, but with automatic repositioning
    const { floatingStyles } = useFloatingPosition(triggerRef, dropdownRef, {
      placement: 'bottom-start',
      offset: 4,
      shiftPadding: 8,
      autoSize: true,
      flip: true,
      shift: true,
      strategy: 'absolute', // Use absolute positioning like BaseMultiSelect
    });

    const toggleDropdown = () => {
      if (!props.disabled) {
        isOpen.value = !isOpen.value;
        if (isOpen.value && props.searchable) {
          // Focus search input when dropdown opens
          setTimeout(() => {
            searchInputRef.value?.focus();
          }, 100);
        } else {
          searchQuery.value = '';
        }
      }
    };

    const clearSearch = () => {
      searchQuery.value = '';
      searchInputRef.value?.focus();
    };

    const selectOption = (value: string | number) => {
      emit('update:modelValue', value);
      emit('change', value);
      searchQuery.value = '';
      isOpen.value = false;
    };

    const handleBlur = (event: Event) => {
      // Delay to allow click events to fire first
      setTimeout(() => {
        if (wrapperRef.value && !wrapperRef.value.contains(document.activeElement)) {
          isOpen.value = false;
          emit('blur', event);
        }
      }, 200);
    };

    const handleFocus = (event: Event) => {
      emit('focus', event);
    };

    const handleKeydown = (event: KeyboardEvent) => {
      if (props.disabled) return;

      switch (event.key) {
        case 'Enter':
        case ' ':
          event.preventDefault();
          toggleDropdown();
          break;
        case 'Escape':
          isOpen.value = false;
          break;
        case 'ArrowDown':
          event.preventDefault();
          if (!isOpen.value) {
            isOpen.value = true;
          }
          break;
        case 'ArrowUp':
          event.preventDefault();
          if (isOpen.value) {
            isOpen.value = false;
          }
          break;
      }
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.value && !wrapperRef.value.contains(event.target as Node)) {
        isOpen.value = false;
        searchQuery.value = '';
      }
    };

    onMounted(() => {
      document.addEventListener('click', handleClickOutside);
    });

    onBeforeUnmount(() => {
      document.removeEventListener('click', handleClickOutside);
    });

    return {
      isOpen,
      wrapperRef,
      triggerRef,
      dropdownRef,
      searchInputRef,
      searchQuery,
      hasError,
      selectClass,
      displayValue,
      filteredOptions,
      getOptionValue,
      getOptionLabel,
      isOptionDisabled,
      toggleDropdown,
      selectOption,
      clearSearch,
      handleBlur,
      handleFocus,
      handleKeydown,
      floatingStyles,
    };
  },
});
