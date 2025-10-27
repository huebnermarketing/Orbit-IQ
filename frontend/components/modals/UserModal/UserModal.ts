import { ref, reactive, computed, onMounted, defineComponent } from 'vue';
import { useAuthStore } from '~/stores/auth';

export default defineComponent({
  name: 'UserModal',
  props: {
    user: {
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
    const { $organizationApi, $userApi } = useNuxtApp();
    const authStore = useAuthStore();
    const loading = ref(false);
    const error = ref('');

    const form = reactive({
      name: '',
      email: '',
      password: '',
      password_confirmation: '',
      role: 'user',
      organization_role_ids: [] as number[],
      assigned_pm_id: '',
      timezone: 'UTC',
      is_active: true,
      avatar: '',
    });

    const currentUser = computed(() => authStore.user);
    const organizationRoles = ref<any[]>([]);
    const amUsers = ref<any[]>([]);
    const pmUsers = ref<any[]>([]);

    const canCreateSuperAdmin = computed(() => currentUser.value?.role === 'super_admin');
    const isPMSelected = computed(() =>
      form.organization_role_ids.some((roleId: number) => {
        const role = organizationRoles.value.find((r: any) => r.id === roleId);
        return role?.name === 'PM';
      })
    );
    const isAMSelected = computed(() =>
      form.organization_role_ids.some((roleId: number) => {
        const role = organizationRoles.value.find((r: any) => r.id === roleId);
        return role?.name === 'AM';
      })
    );
    const isClientLinkedUser = computed(() => {
      if (props.user?.organization_roles) {
        return props.user.organization_roles.some((role: any) => role.id === 14);
      }
      return props.user?.organization_role_id === 14;
    });
    const canEditEmail = computed(() => currentUser.value?.role === 'super_admin');
    const availableOrganizationRoles = computed(() =>
      organizationRoles.value.filter((role: any) => role.id !== 14)
    );
    const timezones = computed(() => [
      { value: 'UTC', label: 'UTC' },
      { value: 'America/New_York', label: 'Eastern Time' },
      { value: 'America/Denver', label: 'Mountain Time' },
      { value: 'Asia/Kolkata', label: 'IST (India Standard Time)' },
    ]);

    const loadOrganizationRoles = async () => {
      try {
        const response = (await $organizationApi.getOrganizationRoles()) as any[];
        organizationRoles.value = response;
      } catch (error) {
        console.error('Failed to load organization roles:', error);
      }
    };

    const loadAMUsers = async () => {
      try {
        const response = (await $userApi.getAMUsers()) as any[];
        amUsers.value = response;
      } catch (error) {
        console.error('Failed to load AM users:', error);
      }
    };

    const loadPMUsers = async () => {
      try {
        const response = (await $userApi.getPMUsers()) as any[];
        pmUsers.value = response;
      } catch (error) {
        console.error('Failed to load PM users:', error);
      }
    };

    const handleAvatarUpload = async (file: File) => {
      try {
        const formData = new FormData();
        formData.append('avatar', file);
        const response = (await $userApi.uploadAvatar(formData)) as { avatar?: string };
        if (response.avatar) {
          form.avatar = response.avatar;
        }
      } catch (error) {
        console.error('Failed to upload avatar:', error);
        throw error;
      }
    };

    const handleAvatarError = (error: string) => {
      console.error('Avatar upload error:', error);
    };

    const handleSubmit = async () => {
      loading.value = true;
      error.value = '';

      try {
        if (props.isEdit) {
          await $userApi.updateUser(props.user.id, {
            name: form.name,
            email: form.email,
            role: form.role,
            organization_role_ids: form.organization_role_ids,
            assigned_pm_id: form.assigned_pm_id,
            timezone: form.timezone,
            is_active: form.is_active,
            avatar: form.avatar,
          });
        } else {
          await $userApi.createUser(form);
        }
        emit('saved');
      } catch (err: any) {
        error.value = err.data?.message || 'An error occurred. Please try again.';
      } finally {
        loading.value = false;
      }
    };

    onMounted(async () => {
      await Promise.all([loadOrganizationRoles(), loadAMUsers(), loadPMUsers()]);
      if (props.isEdit && props.user) {
        form.name = props.user.name || '';
        form.email = props.user.email || '';
        form.role = props.user.role || 'user';
        form.organization_role_ids =
          props.user.organization_roles?.map((role: any) => role.id) || [];
        form.assigned_pm_id = props.user.assigned_pm_id || '';
        form.timezone = props.user.timezone || 'UTC';
        form.is_active = props.user.is_active !== undefined ? props.user.is_active : true;
        form.avatar = props.user.avatar || '';
      }
    });

    // Expose variables for template usage (required for external script files)
    // This replaces the need for `defineExpose` in a script setup context
    return {
      loading,
      error,
      form,
      isEdit: computed(() => props.isEdit),
      isClientLinkedUser,
      isAMSelected,
      isPMSelected,
      canCreateSuperAdmin,
      canEditEmail,
      availableOrganizationRoles,
      pmUsers,
      amUsers,
      timezones,
      handleSubmit,
      handleAvatarUpload,
      handleAvatarError,
      organizationRoles, // Make sure to return all variables used in template or exposed
      currentUser,
    };
  },
});
