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
            <button class="btn btn-primary w-full">Primary Button</button>
            <button class="btn btn-secondary w-full">Secondary Button</button>
            <button class="btn btn-outline w-full">Outline Button</button>
          </div>
        </div>

        <!-- Status Badges -->
        <div class="card p-4">
          <h4 class="text-sm font-medium text-text-secondary mb-3">Status Badges</h4>
          <div class="space-y-2">
            <div><span class="badge badge-success">Active Status</span></div>
            <div><span class="badge badge-warning">Pending Status</span></div>
            <div><span class="badge badge-error">Inactive Status</span></div>
          </div>
        </div>

        <!-- Cards -->
        <div class="card p-4">
          <h4 class="text-sm font-medium text-text-secondary mb-3">Card Component</h4>
          <div class="space-y-2">
            <p class="text-text-primary text-sm">This is a card with primary text</p>
            <p class="text-text-secondary text-xs">And secondary text for descriptions</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" src="./ColorShowcase.ts"></script>
<style scoped src="./ColorShowcase.css"></style>