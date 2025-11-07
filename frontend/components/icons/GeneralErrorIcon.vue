<template>
  <svg
    class="error-icon"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="2"
      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
</template>

<script setup lang="ts">
defineOptions({
  name: 'GeneralErrorIcon'
});
</script>

<style scoped>
.error-icon {
  width: 6rem;
  height: 6rem;
}
</style>

