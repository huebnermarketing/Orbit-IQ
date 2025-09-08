<template>
  <div class="theme-selector">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-lg font-semibold text-text-primary">Theme</h3>
      <button
        v-if="currentTheme !== 'default'"
        @click="resetTheme"
        class="text-sm text-text-muted hover:text-text-primary transition-colors"
      >
        Reset to Default
      </button>
    </div>

    <div class="grid grid-cols-1 gap-3">
      <div
        v-for="theme in availableThemes"
        :key="theme.name"
        @click="applyTheme(theme.name)"
        :class="[
          'theme-option',
          currentTheme === theme.name ? 'theme-option-active' : 'theme-option-inactive'
        ]"
      >
        <div class="flex items-center space-x-3">
          <!-- Color Preview -->
          <div class="flex space-x-1">
            <div
              class="w-4 h-4 rounded-full border border-gray-200"
              :style="{ backgroundColor: theme.colors.primary }"
            ></div>
            <div
              class="w-4 h-4 rounded-full border border-gray-200"
              :style="{ backgroundColor: theme.colors.secondary }"
            ></div>
            <div
              class="w-4 h-4 rounded-full border border-gray-200"
              :style="{ backgroundColor: theme.colors.accent }"
            ></div>
          </div>

          <!-- Theme Info -->
          <div class="flex-1">
            <div class="font-medium text-sm">{{ theme.displayName }}</div>
            <div class="text-xs text-text-muted">{{ theme.name }}</div>
          </div>

          <!-- Active Indicator -->
          <div v-if="currentTheme === theme.name" class="text-primary-500">
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
            </svg>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { useTheme } from '@/utils/theme'

const { currentTheme, availableThemes, applyTheme, resetTheme } = useTheme()
</script>

<style scoped>
.theme-option {
  @apply p-3 rounded-lg border cursor-pointer transition-all duration-200;
}

.theme-option-active {
  @apply border-primary-500 bg-primary-50;
}

.theme-option-inactive {
  @apply border-border-light hover:border-primary-300 hover:bg-gray-50;
}

.theme-selector {
  @apply p-4 bg-surface rounded-xl border border-border-light;
}
</style>
