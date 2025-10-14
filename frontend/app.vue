<template>
  <div id="app" class="min-h-screen bg-background">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>
<script setup lang="ts">
useHead({
  titleTemplate: '%s - Nuxt 4 CSR App',
  meta: [
    {
      name: 'description',
      content: 'A modern Nuxt 4 CSR application with TailwindCSS and TypeScript'
    }
  ]
})
</script>
<style scoped>
#app {
  @apply font-sans antialiased;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* Ensure smooth transitions */
* {
  @apply transition-colors duration-200;
}

/* Custom scrollbar */
::-webkit-scrollbar {
  @apply w-2;
}

::-webkit-scrollbar-track {
  @apply bg-surface;
}

::-webkit-scrollbar-thumb {
  @apply bg-border-medium rounded-full;
}

::-webkit-scrollbar-thumb:hover {
  @apply bg-border-dark;
}
</style>