import { defineComponent, ref, reactive, watch } from 'vue';

interface ProjectType {
  id?: number;
  name: string;
  description: string;
  color: string;
  sort_order: number;
  is_active: boolean;
  is_system_defined?: boolean;
}

export default defineComponent({
  name: 'ProjectTypeModal',
  props: {
    show: {
      type: Boolean,
      required: true,
    },
    projectType: {
      type: Object as () => ProjectType | null,
      default: null,
    },
    isEdit: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['close', 'saved'],
  setup(props, { emit }) {
    const { $projectApi } = useNuxtApp();
    const loading = ref(false);
    const error = ref('');

    const form = reactive<ProjectType>({
      name: '',
      description: '',
      color: '#3B82F6',
      sort_order: 0,
      is_active: true,
    });

    watch(
      () => props.projectType,
      (newProjectType) => {
        if (newProjectType) {
          form.name = newProjectType.name || '';
          form.description = newProjectType.description || '';
          form.color = newProjectType.color || '#3B82F6';
          form.sort_order = newProjectType.sort_order || 0;
          form.is_active = newProjectType.is_active ?? true;
        } else {
          form.name = '';
          form.description = '';
          form.color = '#3B82F6';
          form.sort_order = 0;
          form.is_active = true;
        }
      },
      { immediate: true }
    );

    const handleSubmit = async () => {
      error.value = '';
      loading.value = true;

      try {
        let response;
        if (props.isEdit && props.projectType?.id) {
          response = await $projectApi.updateProjectType(props.projectType.id, form);
        } else {
          response = await $projectApi.createProjectType(form);
        }

        emit('saved', response as ProjectType);
      } catch (err: any) {
        if (err.data?.errors) {
          const errors = err.data.errors;
          const firstError = Object.values(errors)[0] as string[];
          error.value = firstError[0] || 'Validation failed';
        } else {
          error.value = err.data?.message || 'Failed to save project type. Please try again.';
        }
      } finally {
        loading.value = false;
      }
    };

    return {
      form,
      loading,
      error,
      handleSubmit,
    };
  },
});
