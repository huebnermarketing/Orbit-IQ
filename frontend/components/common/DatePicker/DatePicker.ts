import { ref, computed, watch, onMounted, onUnmounted } from 'vue';
import { useFloatingPosition } from '~/composables/useFloatingPosition';

export type DatePickerMode = 'single' | 'range' | 'multi' | 'week';
export type DatePickerGranularity = 'date' | 'month' | 'year';

export interface DatePickerProps {
  modelValue?: string | string[] | { start: string; end: string } | null;
  mode?: DatePickerMode;
  granularity?: DatePickerGranularity;
  label?: string;
  placeholder?: string;
  id?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  hint?: string;
  min?: string;
  max?: string;
  format?: string;
}

export default defineComponent({
  name: 'DatePicker',
  props: {
    modelValue: {
      type: [String, Array, Object] as PropType<
        string | string[] | { start: string; end: string } | null
      >,
      default: null,
    },
    mode: {
      type: String as PropType<DatePickerMode>,
      default: 'single',
    },
    granularity: {
      type: String as PropType<DatePickerGranularity>,
      default: 'date',
    },
    label: {
      type: String,
      default: '',
    },
    placeholder: {
      type: String,
      default: 'Select date',
    },
    id: {
      type: String,
      default: '',
    },
    required: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    error: {
      type: String,
      default: '',
    },
    hint: {
      type: String,
      default: '',
    },
    min: {
      type: String,
      default: '',
    },
    max: {
      type: String,
      default: '',
    },
    format: {
      type: String,
      default: 'YYYY-MM-DD',
    },
  },
  emits: ['update:modelValue', 'change', 'input'],
  setup(props, { emit }) {
    const pickerRef = ref<HTMLElement | null>(null);
    const triggerRef = ref<HTMLElement | null>(null);
    const calendarRef = ref<HTMLElement | null>(null);
    const isOpen = ref(false);
    const currentDate = ref(new Date());
    const viewMode = ref<'date' | 'month' | 'year'>('date');
    const hoveredDate = ref<Date | null>(null);

    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];

    // Computed values
    const selectedDates = computed(() => {
      if (!props.modelValue) return [];
      if (props.mode === 'multi' && Array.isArray(props.modelValue)) {
        return props.modelValue.map((d) => new Date(d));
      }
      if (props.mode === 'single' && typeof props.modelValue === 'string') {
        return [new Date(props.modelValue)];
      }
      return [];
    });

    const selectedRange = computed(() => {
      if (props.mode === 'range') {
        if (
          typeof props.modelValue === 'object' &&
          props.modelValue &&
          'start' in props.modelValue
        ) {
          return {
            start: props.modelValue.start ? new Date(props.modelValue.start) : null,
            end: props.modelValue.end ? new Date(props.modelValue.end) : null,
          };
        }
      }
      return { start: null, end: null };
    });

    const selectedWeek = computed(() => {
      if (props.mode === 'week' && typeof props.modelValue === 'string') {
        const date = new Date(props.modelValue);
        return getWeekRange(date);
      }
      return null;
    });

    const hasValue = computed(() => {
      if (!props.modelValue) return false;

      if (props.mode === 'single') {
        return typeof props.modelValue === 'string' && props.modelValue !== '';
      } else if (props.mode === 'range') {
        if (
          typeof props.modelValue === 'object' &&
          props.modelValue &&
          'start' in props.modelValue
        ) {
          return !!(props.modelValue.start || props.modelValue.end);
        }
      } else if (props.mode === 'multi') {
        return Array.isArray(props.modelValue) && props.modelValue.length > 0;
      } else if (props.mode === 'week') {
        return typeof props.modelValue === 'string' && props.modelValue !== '';
      }
      return false;
    });

    const displayText = computed(() => {
      if (!props.modelValue) return '';

      if (props.mode === 'single') {
        if (typeof props.modelValue === 'string') {
          return formatDateForDisplay(new Date(props.modelValue));
        }
      } else if (props.mode === 'range') {
        if (
          typeof props.modelValue === 'object' &&
          props.modelValue &&
          'start' in props.modelValue
        ) {
          const start = props.modelValue.start
            ? formatDateForDisplay(new Date(props.modelValue.start))
            : '';
          const end = props.modelValue.end
            ? formatDateForDisplay(new Date(props.modelValue.end))
            : '';
          return end ? `${start} - ${end}` : start;
        }
      } else if (props.mode === 'multi') {
        if (Array.isArray(props.modelValue)) {
          return `${props.modelValue.length} date${
            props.modelValue.length !== 1 ? 's' : ''
          } selected`;
        }
      } else if (props.mode === 'week') {
        if (typeof props.modelValue === 'string') {
          const week = getWeekRange(new Date(props.modelValue));
          return `${formatDateForDisplay(week.start)} - ${formatDateForDisplay(week.end)}`;
        }
      }
      return '';
    });

    const currentPeriodLabel = computed(() => {
      if (viewMode.value === 'year') {
        const startYear = Math.floor(currentDate.value.getFullYear() / 10) * 10;
        return `${startYear} - ${startYear + 9}`;
      } else if (viewMode.value === 'month') {
        return currentDate.value.getFullYear().toString();
      } else {
        return `${months[currentDate.value.getMonth()]} ${currentDate.value.getFullYear()}`;
      }
    });

    const yearRange = computed(() => {
      const startYear = Math.floor(currentDate.value.getFullYear() / 10) * 10;
      return Array.from({ length: 12 }, (_, i) => startYear - 1 + i);
    });

    const calendarDays = computed(() => {
      const year = currentDate.value.getFullYear();
      const month = currentDate.value.getMonth();
      const firstDay = new Date(year, month, 1);
      const startDate = new Date(firstDay);
      startDate.setDate(startDate.getDate() - startDate.getDay());

      const days: Array<{ date: Date; day: number; isOtherMonth: boolean; isToday: boolean }> = [];
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      for (let i = 0; i < 42; i++) {
        const date = new Date(startDate);
        date.setDate(startDate.getDate() + i);
        const isOtherMonth = date.getMonth() !== month;
        const dateCopy = new Date(date);
        dateCopy.setHours(0, 0, 0, 0);
        const isToday = dateCopy.getTime() === today.getTime();

        days.push({
          date,
          day: date.getDate(),
          isOtherMonth,
          isToday,
        });
      }

      return days;
    });

    // Floating UI setup for automatic repositioning
    const { floatingStyles } = useFloatingPosition(triggerRef, calendarRef, {
      placement: 'bottom-start',
      offset: 4,
      shiftPadding: 8,
      autoSize: false, // Don't auto-size calendar width
      flip: true,
      shift: true,
      strategy: 'absolute',
    });

    const minDate = computed(() => {
      return props.min ? new Date(props.min) : null;
    });

    const maxDate = computed(() => {
      return props.max ? new Date(props.max) : null;
    });

    const isMinDate = computed(() => {
      if (!minDate.value) return false;
      const checkDate = new Date(currentDate.value);
      if (viewMode.value === 'year') {
        checkDate.setFullYear(Math.floor(checkDate.getFullYear() / 10) * 10);
      } else if (viewMode.value === 'month') {
        checkDate.setMonth(0, 1);
      }
      return checkDate <= minDate.value;
    });

    const isMaxDate = computed(() => {
      if (!maxDate.value) return false;
      const checkDate = new Date(currentDate.value);
      if (viewMode.value === 'year') {
        checkDate.setFullYear(Math.floor(checkDate.getFullYear() / 10) * 10 + 9, 11, 31);
      } else if (viewMode.value === 'month') {
        checkDate.setMonth(11, 31);
      } else {
        const lastDay = new Date(checkDate.getFullYear(), checkDate.getMonth() + 1, 0);
        checkDate.setDate(lastDay.getDate());
      }
      return checkDate >= maxDate.value;
    });

    // Methods
    const formatDateForDisplay = (date: Date): string => {
      if (!date || isNaN(date.getTime())) return '';

      if (props.granularity === 'year') {
        return date.getFullYear().toString();
      } else if (props.granularity === 'month') {
        return `${months[date.getMonth()]} ${date.getFullYear()}`;
      }

      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      return `${day}-${month}-${year}`;
    };

    const formatDateForValue = (date: Date): string => {
      if (!date || isNaN(date.getTime())) return '';

      if (props.granularity === 'year') {
        return date.getFullYear().toString();
      } else if (props.granularity === 'month') {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        return `${year}-${month}`;
      }

      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    const getWeekRange = (date: Date): { start: Date; end: Date } => {
      const d = new Date(date);
      const day = d.getDay();
      const diff = d.getDate() - day;
      const start = new Date(d.setDate(diff));
      start.setHours(0, 0, 0, 0);
      const end = new Date(start);
      end.setDate(start.getDate() + 6);
      end.setHours(23, 59, 59, 999);
      return { start, end };
    };

    const isDaySelected = (date: Date): boolean => {
      if (props.mode === 'single') {
        return selectedDates.value.some((d) => isSameDay(d, date));
      } else if (props.mode === 'multi') {
        return selectedDates.value.some((d) => isSameDay(d, date));
      }
      return false;
    };

    const isDayInRange = (date: Date): boolean => {
      if (props.mode !== 'range') return false;
      if (!selectedRange.value.start) return false;

      const checkDate = new Date(date);
      checkDate.setHours(0, 0, 0, 0);
      const start = new Date(selectedRange.value.start);
      start.setHours(0, 0, 0, 0);
      const end = selectedRange.value.end ? new Date(selectedRange.value.end) : null;
      if (end) end.setHours(0, 0, 0, 0);

      if (hoveredDate.value && !end) {
        const hover = new Date(hoveredDate.value);
        hover.setHours(0, 0, 0, 0);
        const rangeEnd = hover > start ? hover : start;
        const rangeStart = hover > start ? start : hover;
        return checkDate >= rangeStart && checkDate <= rangeEnd;
      }

      if (end) {
        return checkDate >= start && checkDate <= end;
      }

      return isSameDay(checkDate, start);
    };

    const isDayInWeekSelection = (date: Date): boolean => {
      if (props.mode !== 'week' || !selectedWeek.value) return false;
      const checkDate = new Date(date);
      checkDate.setHours(0, 0, 0, 0);
      return checkDate >= selectedWeek.value.start && checkDate <= selectedWeek.value.end;
    };

    const isDayDisabled = (date: Date): boolean => {
      const checkDate = new Date(date);
      checkDate.setHours(0, 0, 0, 0);

      if (minDate.value) {
        const min = new Date(minDate.value);
        min.setHours(0, 0, 0, 0);
        if (checkDate < min) return true;
      }

      if (maxDate.value) {
        const max = new Date(maxDate.value);
        max.setHours(0, 0, 0, 0);
        if (checkDate > max) return true;
      }

      return false;
    };

    const isSameDay = (date1: Date, date2: Date): boolean => {
      return (
        date1.getFullYear() === date2.getFullYear() &&
        date1.getMonth() === date2.getMonth() &&
        date1.getDate() === date2.getDate()
      );
    };

    const isYearSelected = (year: number): boolean => {
      if (props.granularity === 'year') {
        if (props.mode === 'single' && typeof props.modelValue === 'string') {
          return parseInt(props.modelValue) === year;
        }
      }
      return false;
    };

    const isYearDisabled = (year: number): boolean => {
      if (minDate.value && year < minDate.value.getFullYear()) return true;
      if (maxDate.value && year > maxDate.value.getFullYear()) return true;
      return false;
    };

    const isMonthSelected = (monthIndex: number): boolean => {
      if (props.granularity === 'month') {
        if (props.mode === 'single' && typeof props.modelValue === 'string') {
          const parts = props.modelValue.split('-');
          const year = parts[0];
          const month = parts[1];
          if (year && month) {
            return (
              parseInt(month) === monthIndex + 1 &&
              parseInt(year) === currentDate.value.getFullYear()
            );
          }
        }
      }
      return false;
    };

    const isMonthDisabled = (monthIndex: number): boolean => {
      const checkDate = new Date(currentDate.value.getFullYear(), monthIndex, 1);
      if (minDate.value && checkDate < minDate.value) return true;
      if (maxDate.value) {
        const maxMonth = new Date(maxDate.value.getFullYear(), maxDate.value.getMonth(), 1);
        if (checkDate > maxMonth) return true;
      }
      return false;
    };

    const syncCurrentDateToSelection = () => {
      if (props.modelValue) {
        if (props.mode === 'single' && typeof props.modelValue === 'string') {
          const date = new Date(props.modelValue);
          if (!isNaN(date.getTime())) {
            currentDate.value = date;
            return;
          }
        } else if (
          props.mode === 'range' &&
          typeof props.modelValue === 'object' &&
          props.modelValue &&
          'start' in props.modelValue
        ) {
          if (props.modelValue.start) {
            const date = new Date(props.modelValue.start);
            if (!isNaN(date.getTime())) {
              currentDate.value = date;
              return;
            }
          }
        } else if (
          props.mode === 'multi' &&
          Array.isArray(props.modelValue) &&
          props.modelValue.length > 0
        ) {
          if (props.modelValue[0]) {
            const date = new Date(props.modelValue[0]);
            if (!isNaN(date.getTime())) {
              currentDate.value = date;
              return;
            }
          }
        } else if (props.mode === 'week' && typeof props.modelValue === 'string') {
          const date = new Date(props.modelValue);
          if (!isNaN(date.getTime())) {
            currentDate.value = date;
            return;
          }
        }
      }
      // If no selection, default to current date
      currentDate.value = new Date();
    };

    const togglePicker = () => {
      if (props.disabled) return;
      const wasOpen = isOpen.value;
      isOpen.value = !isOpen.value;

      // When opening, sync currentDate to the selected date
      if (!wasOpen && isOpen.value) {
        syncCurrentDateToSelection();
      }

      if (props.granularity === 'year') {
        viewMode.value = 'year';
      } else if (props.granularity === 'month') {
        viewMode.value = 'month';
      } else {
        viewMode.value = 'date';
      }
    };

    const toggleViewMode = () => {
      if (viewMode.value === 'date') {
        viewMode.value = 'month';
      } else if (viewMode.value === 'month') {
        viewMode.value = 'year';
      } else {
        viewMode.value = 'date';
      }
    };

    const previousPeriod = () => {
      const newDate = new Date(currentDate.value);
      if (viewMode.value === 'year') {
        newDate.setFullYear(newDate.getFullYear() - 10);
      } else if (viewMode.value === 'month') {
        newDate.setFullYear(newDate.getFullYear() - 1);
      } else {
        newDate.setMonth(newDate.getMonth() - 1);
      }
      currentDate.value = newDate;
    };

    const nextPeriod = () => {
      const newDate = new Date(currentDate.value);
      if (viewMode.value === 'year') {
        newDate.setFullYear(newDate.getFullYear() + 10);
      } else if (viewMode.value === 'month') {
        newDate.setFullYear(newDate.getFullYear() + 1);
      } else {
        newDate.setMonth(newDate.getMonth() + 1);
      }
      currentDate.value = newDate;
    };

    const selectYear = (year: number) => {
      if (isYearDisabled(year)) return;

      const newDate = new Date(year, 0, 1);
      currentDate.value = newDate;

      if (props.granularity === 'year') {
        emitValue(year.toString());
        // Don't close - let user see the selection, or they can click outside
      } else {
        viewMode.value = 'month';
        // Stay open to allow month selection
      }
    };

    const selectMonth = (monthIndex: number) => {
      if (isMonthDisabled(monthIndex)) return;

      const newDate = new Date(currentDate.value.getFullYear(), monthIndex, 1);
      currentDate.value = newDate;

      if (props.granularity === 'month') {
        emitValue(formatDateForValue(newDate));
        // Don't close - let user see the selection, or they can click outside
      } else {
        viewMode.value = 'date';
        // Stay open to allow date selection
      }
    };

    const selectDay = (date: Date) => {
      if (isDayDisabled(date)) return;

      if (props.mode === 'single') {
        emitValue(formatDateForValue(date));
        isOpen.value = false;
      } else if (props.mode === 'range') {
        handleRangeSelection(date);
      } else if (props.mode === 'multi') {
        handleMultiSelection(date);
      } else if (props.mode === 'week') {
        const week = getWeekRange(date);
        emitValue(formatDateForValue(week.start));
        isOpen.value = false;
      }
    };

    const handleRangeSelection = (date: Date) => {
      const formatted = formatDateForValue(date);
      const current = props.modelValue as { start?: string; end?: string } | null;

      if (!current || !current.start) {
        emitValue({ start: formatted, end: '' });
      } else if (current.start && !current.end) {
        const startDate = new Date(current.start);
        const endDate = new Date(date);

        if (endDate < startDate) {
          emitValue({ start: formatted, end: current.start });
        } else {
          emitValue({ start: current.start, end: formatted });
        }
        isOpen.value = false;
      } else {
        emitValue({ start: formatted, end: '' });
      }
    };

    const handleMultiSelection = (date: Date) => {
      const formatted = formatDateForValue(date);
      const current = (props.modelValue as string[]) || [];
      const index = current.indexOf(formatted);

      if (index > -1) {
        const newDates = current.filter((_, i) => i !== index);
        emitValue(newDates.length > 0 ? newDates : null);
      } else {
        emitValue([...current, formatted]);
      }
    };

    const handleDayHover = (date: Date) => {
      if (props.mode === 'range' && selectedRange.value.start && !selectedRange.value.end) {
        hoveredDate.value = date;
      }
    };

    const clearSelection = () => {
      emitValue(null);
      isOpen.value = false;
    };

    const emitValue = (value: any) => {
      emit('update:modelValue', value);
      emit('change', value);
      emit('input', value);
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (pickerRef.value && !pickerRef.value.contains(event.target as Node)) {
        isOpen.value = false;
        hoveredDate.value = null;
      }
    };

    // Watch for modelValue changes to update currentDate
    watch(
      () => props.modelValue,
      (newValue) => {
        if (newValue) {
          if (props.mode === 'single' && typeof newValue === 'string') {
            const date = new Date(newValue);
            if (!isNaN(date.getTime())) {
              currentDate.value = date;
            }
          } else if (
            props.mode === 'range' &&
            typeof newValue === 'object' &&
            newValue &&
            'start' in newValue
          ) {
            if (newValue.start) {
              const date = new Date(newValue.start);
              if (!isNaN(date.getTime())) {
                currentDate.value = date;
              }
            }
          } else if (
            props.mode === 'multi' &&
            Array.isArray(newValue) &&
            newValue.length > 0 &&
            newValue[0]
          ) {
            const date = new Date(newValue[0]);
            if (!isNaN(date.getTime())) {
              currentDate.value = date;
            }
          } else if (props.mode === 'week' && typeof newValue === 'string') {
            const date = new Date(newValue);
            if (!isNaN(date.getTime())) {
              currentDate.value = date;
            }
          }
        } else {
          // If value is cleared, reset to current date
          currentDate.value = new Date();
        }
      },
      { immediate: true }
    );

    onMounted(() => {
      document.addEventListener('click', handleClickOutside);
    });

    onUnmounted(() => {
      document.removeEventListener('click', handleClickOutside);
    });

    return {
      pickerRef,
      triggerRef,
      calendarRef,
      isOpen,
      currentDate,
      viewMode,
      hoveredDate,
      weekDays,
      months,
      selectedDates,
      selectedRange,
      selectedWeek,
      hasValue,
      displayText,
      currentPeriodLabel,
      yearRange,
      calendarDays,
      floatingStyles,
      isMinDate,
      isMaxDate,
      togglePicker,
      toggleViewMode,
      previousPeriod,
      nextPeriod,
      selectYear,
      selectMonth,
      selectDay,
      handleDayHover,
      clearSelection,
      formatDateForDisplay,
      isDaySelected,
      isDayInRange,
      isDayInWeekSelection,
      isDayDisabled,
      isYearSelected,
      isYearDisabled,
      isMonthSelected,
      isMonthDisabled,
    };
  },
});
