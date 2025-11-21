<template>
  <ProjectDetailView :project-id="$route.params.id" />
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'auth',
});
</script>
