import { defineComponent, ref, reactive, computed, onMounted, watch } from 'vue';
export default defineComponent({
  name: 'UserGroupModal',
  props: {
    userGroup: {
      type: Object,
      default: null,
    },
    isEdit: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['close', 'saved'],
  setup(props, { emit }) {
    const { $userApi } = useNuxtApp();
    const loading = ref(false);
    const error = ref('');
    const availableUsers = ref<any[]>([]);
    const userSearchQuery = ref('');

    const form = reactive({
      name: '',
      description: '',
      color: '#3B82F6',
      is_active: true,
      user_ids: [] as number[],
    });

    const filteredUsers = computed(() => {
      if (!userSearchQuery.value) {
        return availableUsers.value;
      }

      const query = userSearchQuery.value.toLowerCase();
      return availableUsers.value.filter(
        (user) =>
          user.name.toLowerCase().includes(query) || user.email.toLowerCase().includes(query)
      );
    });

    const selectedUsers = computed(() => {
      return availableUsers.value.filter((user) => form.user_ids.includes(user.id));
    });

    const loadAvailableUsers = async () => {
      try {
        const response = (await $userApi.getActiveUsers()) as any[];
        availableUsers.value = response;
      } catch (error) {
        console.error('Failed to load users:', error);
      }
    };

    const toggleUser = (user: any) => {
      const index = form.user_ids.indexOf(user.id);
      if (index > -1) {
        form.user_ids.splice(index, 1);
      } else {
        form.user_ids.push(user.id);
      }
    };

    const removeUser = (userId: number) => {
      const index = form.user_ids.indexOf(userId);
      if (index > -1) {
        form.user_ids.splice(index, 1);
      }
    };

    const initializeForm = () => {
      if (props.isEdit && props.userGroup) {
        form.name = props.userGroup.name || '';
        form.description = props.userGroup.description || '';
        form.color = props.userGroup.color || '#3B82F6';
        form.is_active = props.userGroup.is_active !== false;
        form.user_ids = props.userGroup.users
          ? props.userGroup.users.map((user: any) => user.id)
          : [];
      } else {
        form.name = '';
        form.description = '';
        form.color = '#3B82F6';
        form.is_active = true;
        form.user_ids = [];
      }
      userSearchQuery.value = '';
    };

    watch(() => props.userGroup, initializeForm, { immediate: true });

    const handleSubmit = async () => {
      loading.value = true;
      error.value = '';

      try {
        const data = {
          name: form.name,
          description: form.description,
          color: form.color,
          is_active: form.is_active,
          user_ids: form.user_ids,
        };

        if (props.isEdit && props.userGroup) {
          await $userApi.updateUserGroup(props.userGroup.id, data);
        } else {
          await $userApi.createUserGroup(data);
        }

        emit('saved');
      } catch (err: any) {
        console.error('Failed to save user group:', err);
        error.value = err.data?.message || 'Failed to save user group. Please try again.';
      } finally {
        loading.value = false;
      }
    };

    onMounted(() => {
      loadAvailableUsers();
      initializeForm();
    });

    return {
      loading,
      error,
      availableUsers,
      userSearchQuery,
      form,
      filteredUsers,
      selectedUsers,
      loadAvailableUsers,
      toggleUser,
      removeUser,
      initializeForm,
      handleSubmit,
    };
  },
});
