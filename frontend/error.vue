<template>
  <div id="app" class="min-h-screen bg-background">
    <NuxtLayout>
      <ErrorDisplay :error="error" />
    </NuxtLayout>
  </div>
</template>

<script lang="ts">
export default defineComponent({
  name: 'ErrorPage',
  props: {
    error: {
      type: Object as () => {
        statusCode?: number;
        code?: number;
        statusMessage?: string;
        message?: string;
        stack?: string;
        data?: any;
        path?: string;
      },
      default: () => ({})
    }
  },
  setup() {
    return {};
  }
});
</script>

