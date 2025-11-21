<template>
  <svg
    :class="['clipboard-list-icon', `clipboard-list-icon-${size}`]"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      stroke-linecap="round"
      stroke-linejoin="round"
      :stroke-width="strokeWidth"
      d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
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
  strokeWidth: 2,
});
</script>

<style scoped>
.clipboard-list-icon {
  display: block;
}

.clipboard-list-icon-small {
  width: 1rem;
  height: 1rem;
}

.clipboard-list-icon-medium {
  width: 1.25rem;
  height: 1.25rem;
}

.clipboard-list-icon-large {
  width: 1.5rem;
  height: 1.5rem;
}
</style>
