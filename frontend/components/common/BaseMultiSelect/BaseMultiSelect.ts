import { defineComponent, computed, ref, onMounted, onBeforeUnmount } from 'vue';

export interface MultiSelectOption {
  label: string;
  value: string | number;
  disabled?: boolean;
}

export default defineComponent({
  name: 'BaseMultiSelect',
  props: {
    modelValue: {
      type: Array as () => (string | number)[],
      default: () => [],
    },
    options: {
      type: Array as () => MultiSelectOption[] | string[] | number[],
      required: true,
    },
    placeholder: {
      type: String,
      default: 'Select options...',
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
    const searchInputRef = ref<HTMLInputElement | null>(null);
    const searchQuery = ref('');
    const isClosing = ref(false);

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
        'w-full appearance-none bg-surface rounded-lg shadow-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 pr-10 text-left flex items-center min-h-[2.5rem] py-1';
      const sizeClass = sizeClasses[props.size];
      const variantClass = variantClasses[props.variant];
      const errorClass = hasError.value
        ? 'border-error-500 focus:ring-error-500 focus:border-error-500'
        : 'border-border-light';
      return `${baseClasses} ${sizeClass} ${variantClass} ${errorClass}`.trim();
    });

    const selectedOptions = computed(() => {
      return props.options.filter((option) => {
        const value = getOptionValue(option);
        return props.modelValue.includes(value);
      });
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

    const getOptionValue = (option: MultiSelectOption | string | number): string | number => {
      if (typeof option === 'string' || typeof option === 'number') {
        return option;
      }
      return option.value;
    };

    const getOptionLabel = (option: MultiSelectOption | string | number): string => {
      if (typeof option === 'string' || typeof option === 'number') {
        return String(option);
      }
      return option.label;
    };

    const getOptionByValue = (
      value: string | number
    ): MultiSelectOption | string | number | null => {
      return props.options.find((option) => getOptionValue(option) === value) || null;
    };

    const removeOptionByValue = (value: string | number) => {
      const option = getOptionByValue(value);
      if (option) {
        removeOption(option);
      }
    };

    const isOptionDisabled = (option: MultiSelectOption | string | number): boolean => {
      if (typeof option === 'string' || typeof option === 'number') {
        return false;
      }
      return option.disabled || false;
    };

    const isOptionSelected = (option: MultiSelectOption | string | number): boolean => {
      const value = getOptionValue(option);
      return props.modelValue.includes(value);
    };

    const toggleOption = (option: MultiSelectOption | string | number) => {
      if (isOptionDisabled(option)) return;

      const value = getOptionValue(option);
      const newValue = [...props.modelValue];

      if (isOptionSelected(option)) {
        const index = newValue.indexOf(value);
        if (index > -1) {
          newValue.splice(index, 1);
        }
      } else {
        newValue.push(value);
      }

      emit('update:modelValue', newValue);
      emit('change', newValue);

      // Close dropdown after selection
      searchQuery.value = '';
      isClosing.value = true;
      // Use setTimeout to ensure the close happens after the click event completes
      setTimeout(() => {
        isOpen.value = false;
        isClosing.value = false;
      }, 0);
    };

    const removeOption = (option: MultiSelectOption | string | number) => {
      const value = getOptionValue(option);
      const newValue = props.modelValue.filter((v) => v !== value);
      emit('update:modelValue', newValue);
      emit('change', newValue);
    };

    const toggleDropdown = () => {
      if (!props.disabled) {
        isOpen.value = !isOpen.value;
        if (isOpen.value && props.searchable) {
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

    const handleBlur = (event: Event) => {
      // Don't close if we're already closing via option selection
      if (isClosing.value) return;

      setTimeout(() => {
        if (wrapperRef.value && !wrapperRef.value.contains(document.activeElement)) {
          isOpen.value = false;
          searchQuery.value = '';
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
          searchQuery.value = '';
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
      searchInputRef,
      searchQuery,
      hasError,
      selectClass,
      selectedOptions,
      filteredOptions,
      getOptionValue,
      getOptionLabel,
      getOptionByValue,
      removeOptionByValue,
      isOptionDisabled,
      isOptionSelected,
      toggleOption,
      removeOption,
      toggleDropdown,
      clearSearch,
      handleBlur,
      handleFocus,
      handleKeydown,
    };
  },
});
