import { ref, computed, defineComponent } from 'vue';
import imageCompression from 'browser-image-compression';

// Helper function to get initials
function getInitials(name: string): string {
  if (!name) return '?';

  const parts = name
    .trim()
    .split(/\s+/)
    .filter((p) => p.length > 0);
  if (parts.length === 0) return '?';

  if (parts.length === 1) {
    return parts[0]!.charAt(0).toUpperCase();
  }

  return (parts[0]!.charAt(0) + parts[parts.length - 1]!.charAt(0)).toUpperCase();
}

export default defineComponent({
  name: 'AvatarUpload',
  props: {
    avatarUrl: { type: String, default: '' },
    name: { type: String, default: '' },
    size: { type: Number, default: 96 },
    disabled: { type: Boolean, default: false },
    maxFileSize: { type: Number, default: 2 }, // 2MB
    maxWidthOrHeight: { type: Number, default: 400 },
    quality: { type: Number, default: 0.8 },
  },
  emits: ['upload', 'error'],

  setup(props, { emit }) {
    // Refs
    const uploading = ref(false);
    const uploadProgress = ref(0);
    const error = ref('');
    const fileInputRef = ref<HTMLInputElement | null>(null);

    // Computed
    const initials = computed(() => {
      return getInitials(props.name || '');
    });

    const altText = computed(() => {
      return props.name ? `${props.name}'s avatar` : 'User avatar';
    });

    // Methods
    const handleFileSelect = async (event: Event) => {
      const target = event.target as HTMLInputElement;
      const file = target.files?.[0];

      if (!file) return;

      // Reset error
      error.value = '';

      // Validate file type
      if (!file.type.startsWith('image/')) {
        error.value = 'Please select a valid image file';
        emit('error', error.value);
        return;
      }

      // Validate file size
      const fileSizeMB = file.size / (1024 * 1024);
      if (fileSizeMB > props.maxFileSize) {
        error.value = `File size must be less than ${props.maxFileSize}MB`;
        emit('error', error.value);
        return;
      }

      try {
        uploading.value = true;
        uploadProgress.value = 0;

        // Compress and optimize the image
        const compressedFile = await imageCompression(file, {
          maxSizeMB: props.maxFileSize,
          maxWidthOrHeight: props.maxWidthOrHeight,
          useWebWorker: true,
          initialQuality: props.quality,
          onProgress: (progress) => {
            uploadProgress.value = Math.round(progress);
          },
        });

        // Reset progress
        uploadProgress.value = 0;

        // Emit the compressed file
        emit('upload', compressedFile);
      } catch (err) {
        console.error('Image compression failed:', err);
        error.value = 'Failed to process image. Please try again.';
        emit('error', error.value);
      } finally {
        uploading.value = false;
        uploadProgress.value = 0;
        // Reset file input
        target.value = '';
      }
    };

    const handleImageError = (event: Event) => {
      console.error('Avatar image failed to load:', props.avatarUrl);
      console.error('Image error event:', event);
    };

    const handleImageLoad = () => {
      console.log('Avatar image loaded successfully:', props.avatarUrl);
    };

    const clearError = () => {
      error.value = '';
    };

    // Expose methods for parent component
    // defineExpose({
    //   clearError,
    // });

    return {
      uploading,
      uploadProgress,
      error,
      fileInputRef,
      initials,
      altText,
      handleFileSelect,
      handleImageError,
      handleImageLoad,
      clearError,
    };
  },
});
