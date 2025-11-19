<template>
  <p v-if="error" class="mt-1 text-sm text-error-500">{{ error }}</p>
</template>

<script setup lang="ts">
defineProps<{
  error: string;
}>();
</script>

