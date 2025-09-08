<template>
  <div class="color-showcase space-y-8">
    <!-- Brand Colors -->
    <div class="color-section">
      <h3 class="text-lg font-semibold text-text-primary mb-4">Brand Colors</h3>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <!-- Primary -->
        <div class="color-group">
          <h4 class="text-sm font-medium text-text-secondary mb-3">Primary</h4>
          <div class="space-y-2">
            <div v-for="shade in [50, 100, 200, 300, 400, 500, 600, 700, 800, 900]" :key="shade" 
                 class="flex items-center space-x-3">
              <div 
                class="w-12 h-12 rounded-lg border border-gray-200"
                :style="{ backgroundColor: getColorValue(`primary-${shade}`) }"
              ></div>
              <div>
                <div class="text-sm font-medium text-text-primary">primary-{{ shade }}</div>
                <div class="text-xs text-text-muted">{{ getColorValue(`primary-${shade}`) }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Secondary -->
        <div class="color-group">
          <h4 class="text-sm font-medium text-text-secondary mb-3">Secondary</h4>
          <div class="space-y-2">
            <div v-for="shade in [50, 100, 200, 300, 400, 500, 600, 700, 800, 900]" :key="shade" 
                 class="flex items-center space-x-3">
              <div 
                class="w-12 h-12 rounded-lg border border-gray-200"
                :style="{ backgroundColor: getColorValue(`secondary-${shade}`) }"
              ></div>
              <div>
                <div class="text-sm font-medium text-text-primary">secondary-{{ shade }}</div>
                <div class="text-xs text-text-muted">{{ getColorValue(`secondary-${shade}`) }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Accent -->
        <div class="color-group">
          <h4 class="text-sm font-medium text-text-secondary mb-3">Accent</h4>
          <div class="space-y-2">
            <div v-for="shade in [50, 100, 200, 300, 400, 500, 600, 700, 800, 900]" :key="shade" 
                 class="flex items-center space-x-3">
              <div 
                class="w-12 h-12 rounded-lg border border-gray-200"
                :style="{ backgroundColor: getColorValue(`accent-${shade}`) }"
              ></div>
              <div>
                <div class="text-sm font-medium text-text-primary">accent-{{ shade }}</div>
                <div class="text-xs text-text-muted">{{ getColorValue(`accent-${shade}`) }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Semantic Colors -->
    <div class="color-section">
      <h3 class="text-lg font-semibold text-text-primary mb-4">Semantic Colors</h3>
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
        <!-- Success -->
        <div class="color-group">
          <h4 class="text-sm font-medium text-text-secondary mb-3">Success</h4>
          <div class="space-y-2">
            <div v-for="shade in [50, 100, 200, 300, 400, 500, 600, 700, 800, 900]" :key="shade" 
                 class="flex items-center space-x-3">
              <div 
                class="w-12 h-12 rounded-lg border border-gray-200"
                :style="{ backgroundColor: getColorValue(`success-${shade}`) }"
              ></div>
              <div>
                <div class="text-sm font-medium text-text-primary">success-{{ shade }}</div>
                <div class="text-xs text-text-muted">{{ getColorValue(`success-${shade}`) }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Warning -->
        <div class="color-group">
          <h4 class="text-sm font-medium text-text-secondary mb-3">Warning</h4>
          <div class="space-y-2">
            <div v-for="shade in [50, 100, 200, 300, 400, 500, 600, 700, 800, 900]" :key="shade" 
                 class="flex items-center space-x-3">
              <div 
                class="w-12 h-12 rounded-lg border border-gray-200"
                :style="{ backgroundColor: getColorValue(`warning-${shade}`) }"
              ></div>
              <div>
                <div class="text-sm font-medium text-text-primary">warning-{{ shade }}</div>
                <div class="text-xs text-text-muted">{{ getColorValue(`warning-${shade}`) }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Error -->
        <div class="color-group">
          <h4 class="text-sm font-medium text-text-secondary mb-3">Error</h4>
          <div class="space-y-2">
            <div v-for="shade in [50, 100, 200, 300, 400, 500, 600, 700, 800, 900]" :key="shade" 
                 class="flex items-center space-x-3">
              <div 
                class="w-12 h-12 rounded-lg border border-gray-200"
                :style="{ backgroundColor: getColorValue(`error-${shade}`) }"
              ></div>
              <div>
                <div class="text-sm font-medium text-text-primary">error-{{ shade }}</div>
                <div class="text-xs text-text-muted">{{ getColorValue(`error-${shade}`) }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Info -->
        <div class="color-group">
          <h4 class="text-sm font-medium text-text-secondary mb-3">Info</h4>
          <div class="space-y-2">
            <div v-for="shade in [50, 100, 200, 300, 400, 500, 600, 700, 800, 900]" :key="shade" 
                 class="flex items-center space-x-3">
              <div 
                class="w-12 h-12 rounded-lg border border-gray-200"
                :style="{ backgroundColor: getColorValue(`info-${shade}`) }"
              ></div>
              <div>
                <div class="text-sm font-medium text-text-primary">info-{{ shade }}</div>
                <div class="text-xs text-text-muted">{{ getColorValue(`info-${shade}`) }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Component Examples -->
    <div class="color-section">
      <h3 class="text-lg font-semibold text-text-primary mb-4">Component Examples</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <!-- Buttons -->
        <div class="card p-4">
          <h4 class="text-sm font-medium text-text-secondary mb-3">Buttons</h4>
          <div class="space-y-2">
            <button class="btn-primary w-full">Primary Button</button>
            <button class="btn-secondary w-full">Secondary Button</button>
            <button class="btn-outline w-full">Outline Button</button>
            <button class="btn-danger w-full">Danger Button</button>
            <button class="btn-success w-full">Success Button</button>
            <button class="btn-warning w-full">Warning Button</button>
          </div>
        </div>

        <!-- Status Badges -->
        <div class="card p-4">
          <h4 class="text-sm font-medium text-text-secondary mb-3">Status Badges</h4>
          <div class="space-y-2">
            <span class="status-active">Active Status</span>
            <span class="status-inactive">Inactive Status</span>
            <span class="status-pending">Pending Status</span>
          </div>
        </div>

        <!-- Alerts -->
        <div class="card p-4">
          <h4 class="text-sm font-medium text-text-secondary mb-3">Alerts</h4>
          <div class="space-y-2">
            <div class="alert-success">Success message</div>
            <div class="alert-warning">Warning message</div>
            <div class="alert-error">Error message</div>
            <div class="alert-info">Info message</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, onUnmounted } from 'vue'

// Reactive color values that update with theme changes
const colorValues = ref<Record<string, string>>({})

// Function to get the actual CSS custom property value
const getColorValue = (colorClass: string) => {
  return colorValues.value[colorClass] || '#000000'
}

// Function to update color values from CSS custom properties
const updateColorValues = () => {
  const root = document.documentElement
  const computedStyle = getComputedStyle(root)
  
  // Brand colors
  const brandColors = ['primary', 'secondary', 'accent']
  const shades = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900]
  
  brandColors.forEach(color => {
    shades.forEach(shade => {
      const cssVar = `--color-${color}-${shade}`
      const value = computedStyle.getPropertyValue(cssVar).trim()
      if (value) {
        colorValues.value[`${color}-${shade}`] = value
      } else {
        // Fallback to default values if CSS var is not set
        const fallbackColors = {
          'primary-500': '#0F7173',
          'secondary-500': '#4D6CFA',
          'accent-500': '#0B5563',
        }
        colorValues.value[`${color}-${shade}`] = fallbackColors[`${color}-500` as keyof typeof fallbackColors] || '#000000'
      }
    })
  })
  
  // Semantic colors (these are static)
  const semanticColors = ['success', 'warning', 'error', 'info']
  const semanticColorMap = {
    'success': '#22c55e',
    'warning': '#f59e0b', 
    'error': '#ef4444',
    'info': '#3b82f6',
  }
  
  semanticColors.forEach(color => {
    shades.forEach(shade => {
      const baseColor = semanticColorMap[color as keyof typeof semanticColorMap]
      // Generate shades for semantic colors (simplified)
      const value = shade === 500 ? baseColor : baseColor
      colorValues.value[`${color}-${shade}`] = value
    })
  })
  
}

// Listen for theme changes
const handleThemeChange = () => {
  updateColorValues()
}

onMounted(() => {
  // Add a small delay to ensure theme is applied
  setTimeout(() => {
    updateColorValues()
  }, 100)
  window.addEventListener('theme-changed', handleThemeChange)
})

onUnmounted(() => {
  window.removeEventListener('theme-changed', handleThemeChange)
})
</script>

<style scoped>
.color-showcase {
  @apply p-6 bg-surface rounded-xl border border-border-light;
}

.color-section {
  @apply space-y-4;
}

.color-group {
  @apply space-y-2;
}
</style>
