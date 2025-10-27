import { ref, reactive, computed, watch, defineComponent } from 'vue';
import { getContrastColor, getRandomColor } from '~/composables/useHelpers';

export default defineComponent({
  name: 'OrganizationRoleModal',
  props: {
    role: {
      type: Object as () => any,
      required: false,
    },
  },
  emits: ['close', 'success'],

  setup(props, { emit }) {
    const { $organizationApi } = useNuxtApp();
    const isLocked = computed(() => props.role?.is_locked || false);

    const loading = ref(false);
    const error = ref('');

    const isEditing = computed(() => !!props.role);

    const form = reactive({
      name: '',
      description: '',
      color: '#4D6CFA',
      sort_order: 0,
      is_active: true,
    });

    watch(
      () => props.role,
      (newRole) => {
        if (newRole) {
          form.name = newRole.name || '';
          form.description = newRole.description || '';
          form.color = newRole.color || '#4D6CFA';
          form.sort_order = newRole.sort_order || 0;
          form.is_active = newRole.is_active ?? true;
        } else {
          form.name = '';
          form.description = '';
          form.color = '#4D6CFA';
          form.sort_order = 0;
          form.is_active = true;
        }
      },
      { immediate: true }
    );

    const handleSubmit = async () => {
      loading.value = true;
      error.value = '';

      try {
        if (isEditing.value) {
          await $organizationApi.updateOrganizationRole(props.role.id, form);
        } else {
          await $organizationApi.createOrganizationRole(form);
        }

        emit('success');
        emit('close');
      } catch (err: any) {
        error.value = err.data?.message || 'Failed to save role. Please try again.';
      } finally {
        loading.value = false;
      }
    };

    return {
      form,
      loading,
      error,
      isEditing,
      handleSubmit,
      isLocked,
      getContrastColor,
      getRandomColor,
    };
  },
});
