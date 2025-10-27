import { defineComponent, ref, reactive } from 'vue';

export default defineComponent({
  setup() {
    const { $authApi } = useNuxtApp();
    const loading = ref(false);
    const error = ref('');
    const submitted = ref(false);

    const form = reactive({
      email: '',
    });

    const handleSubmit = async () => {
      loading.value = true;
      error.value = '';

      try {
        await $authApi.forgotPassword(form.email);
        submitted.value = true;
      } catch (err: any) {
        error.value = err.data?.message || 'An error occurred. Please try again.';
      } finally {
        loading.value = false;
      }
    };

    return {
      loading,
      error,
      submitted,
      form,
      handleSubmit,
    };
  },
});
