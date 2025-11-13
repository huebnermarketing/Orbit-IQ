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
      content: 'A modern Nuxt 4 CSR application with TailwindCSS and TypeScript',
    },
  ],
});
</script>
<style scoped>
#app {
  /* font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
    'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji',
    'Segoe UI Symbol', 'Noto Color Emoji'; */
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* Ensure smooth transitions */
* {
  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke;
  transition-duration: 200ms;
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 0.5rem;
}

::-webkit-scrollbar-track {
  background-color: var(--color-surface);
}

::-webkit-scrollbar-thumb {
  background-color: var(--color-border-medium);
  border-radius: 9999px;
}

::-webkit-scrollbar-thumb:hover {
  background-color: var(--color-border-dark);
}
</style>
