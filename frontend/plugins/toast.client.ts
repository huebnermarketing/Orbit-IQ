import { defineNuxtPlugin } from '#app';
import { useToast } from '~/composables/useToast';

export default defineNuxtPlugin((nuxtApp) => {
  const { addToast } = useToast();

  const toast = {
    success: (msg: string) => addToast(msg, 'success'),
    error: (msg: string) => addToast(msg, 'error'),
    info: (msg: string) => addToast(msg, 'info'),
    warning: (msg: string) => addToast(msg, 'warning'),
  };

  // Make $toast available globally
  nuxtApp.vueApp.config.globalProperties.$toast = toast;
  nuxtApp.provide('toast', toast);
});
