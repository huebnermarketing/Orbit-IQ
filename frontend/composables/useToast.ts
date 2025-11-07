import { ref } from 'vue';

export interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
}

const toasts = ref<Toast[]>([]);
let toastCounter = 0;

export const useToast = () => {
  const addToast = (message: string, type: Toast['type'] = 'info') => {
    // Ensure unique ID by combining timestamp with a counter
    const id = Date.now() * 1000 + toastCounter++;
    toasts.value.push({ id, message, type });

    // Auto-remove after 5 seconds
    setTimeout(() => removeToast(id), 5000);
  };

  const removeToast = (id: number) => {
    toasts.value = toasts.value.filter((t) => t.id !== id);
  };

  return {
    toasts,
    addToast,
    removeToast,
  };
};
