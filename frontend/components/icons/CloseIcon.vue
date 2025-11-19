<template>
  <svg
    :class="['close-icon', `close-icon-${size}`]"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      stroke-linecap="round"
      stroke-linejoin="round"
      :stroke-width="strokeWidth"
      d="M6 18L18 6M6 6l12 12"
    />
  </svg>
</template>

<script setup lang="ts">
interface Props {
  size?: 'small' | 'medium' | 'large';
  strokeWidth?: number;
}

withDefaults(defineProps<Props>(), {
  size: 'medium',
  strokeWidth: 2.5,
});
</script>

<style scoped>
.close-icon {
  display: block;
}

.close-icon-small {
  width: 0.625rem;
  height: 0.625rem;
}

.close-icon-medium {
  width: 1.5rem;
  height: 1.5rem;
}

.close-icon-large {
  width: 1.875rem;
  height: 1.875rem;
}
</style>
