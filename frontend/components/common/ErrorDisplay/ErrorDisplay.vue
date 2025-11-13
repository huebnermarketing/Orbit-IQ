<template>
  <div class="flex items-center justify-center min-h-[60vh] py-12 px-4">
    <div class="flex flex-col items-center gap-8">
      <div class="card p-8">
        <div class="text-center max-w-md w-full">
          <!-- Icon -->
          <div class="flex justify-center mb-6" :class="iconWrapperClass">
            <component :is="iconComponent" class="w-24 h-24" :class="iconClass" />
          </div>

          <!-- Status Code -->
          <div v-if="statusCode" class="text-6xl font-bold text-gray-900 mb-4">
            {{ statusCode }}
          </div>

          <!-- Error Message -->
          <p class="text-lg text-gray-600">{{ errorMessage }}</p>
        </div>
      </div>

      <!-- Actions (outside card, below) -->
      <div
        v-if="errorActions && errorActions.length > 0"
        class="flex flex-col sm:flex-row gap-4 justify-center"
      >
        <template v-for="(action, index) in errorActions" :key="index">
          <NuxtLink
            v-if="action.type === 'link'"
            :to="action.to"
            :class="getActionClass(action.variant)"
          >
            <i v-if="action.icon" :class="action.icon" class="mr-2"></i>
            {{ action.label }}
          </NuxtLink>
          <button
            v-else
            @click="action.handler"
            :class="getActionClass(action.variant)"
            :disabled="action.disabled"
          >
            <i v-if="action.icon" :class="action.icon" class="mr-2"></i>
            {{ action.label }}
          </button>
        </template>
      </div>
    </div>
  </div>
</template>

<script lang="ts" src="./ErrorDisplay.ts"></script>
<style scoped src="./ErrorDisplay.css"></style>
