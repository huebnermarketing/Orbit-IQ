import { ref, reactive, computed, watch, defineComponent } from 'vue';
import { getContrastColor, getRandomColor } from '~/composables/useHelpers';

export default defineComponent({
  name: 'TaskStatusModal',
  props: {
    show: {
      type: Boolean,
      required: true,
    },
    taskStatus: {
      type: Object as () => any,
      required: false,
    },
    isEdit: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  emits: ['close', 'saved'],

  setup(props, { emit }) {
    const { $taskApi } = useNuxtApp();
    const loading = ref(false);
    const error = ref('');

    const isLocked = computed(() => props.taskStatus?.is_locked || false);

    const form = reactive({
      name: '',
      category: '',
      color: '#3B82F6',
      is_active: true,
      sort_order: 0,
    });

    const categoryOptions = {
      todo: 'ToDo',
      in_progress: 'In Progress',
      done: 'Done',
    };

    const getCategoryLabel = (category: string) => {
      return categoryOptions[category as keyof typeof categoryOptions] || category;
    };

    const initializeForm = () => {
      error.value = '';

      if (props.isEdit && props.taskStatus) {
        form.name = props.taskStatus.name || '';
        form.category = props.taskStatus.category || '';
        form.color = props.taskStatus.color || '#3B82F6';
        form.is_active = props.taskStatus.is_active ?? true;
        form.sort_order = props.taskStatus.sort_order || 0;
      } else {
        form.name = '';
        form.category = '';
        form.color = '#3B82F6';
        form.is_active = true;
        form.sort_order = 0;
      }
    };

    const handleSubmit = async () => {
      loading.value = true;
      error.value = '';

      try {
        const statusData = {
          name: form.name,
          category: form.category,
          color: form.color,
          is_active: form.is_active,
          sort_order: form.sort_order,
        };
        if (props.isEdit && props.taskStatus) {
          await $taskApi.updateTaskStatus(props.taskStatus.id, statusData);
        } else {
          await $taskApi.createTaskStatus(statusData);
        }

        emit('saved');
        emit('close');
      } catch (err: any) {
        console.error('Error saving task status:', err);

        if (err.data?.errors) {
          const errors = err.data.errors;
          const errorMessages = Object.values(errors).flat();
          error.value = errorMessages.join(', ');
        } else if (err.data?.message) {
          error.value = err.data.message;
        } else {
          error.value = 'Failed to save task status. Please try again.';
        }
      } finally {
        loading.value = false;
      }
    };

    watch(
      () => props.show,
      (newShow) => {
        if (newShow) {
          initializeForm();
        }
      }
    );

    watch(
      () => props.taskStatus,
      () => {
        if (props.show) {
          initializeForm();
        }
      },
      { deep: true }
    );

    return {
      form,
      loading,
      error,
      isLocked,
      getContrastColor,
      getRandomColor,
      handleSubmit,
      getCategoryLabel,
      initializeForm,
    };
  },
});
