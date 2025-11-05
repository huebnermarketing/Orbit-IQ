<template>
  <ProjectDetail :project-id="$route.params.id as string" />
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'auth'
});
</script>