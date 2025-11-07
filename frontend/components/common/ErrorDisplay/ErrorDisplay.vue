<template>
  <div class="error-display-container">
    <div class="error-content">
      <!-- Icon -->
      <div class="error-icon-wrapper" :class="iconWrapperClass">
        <component :is="iconComponent" :class="iconClass" />
      </div>

      <!-- Title -->
      <h1 class="error-title">{{ errorTitle }}</h1>

      <!-- Message -->
      <p class="error-description">{{ errorMessage }}</p>

      <!-- Additional Details (optional) -->
      <div v-if="errorDetails" class="error-details">
        <p class="error-details-text">{{ errorDetails }}</p>
      </div>

      <!-- Actions -->
      <div v-if="errorActions && errorActions.length > 0" class="error-actions">
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

      <!-- Default Actions if none provided -->
      <div v-else class="error-actions">
        <button @click="goBack" class="btn-secondary">
          <i class="fas fa-undo mr-2"></i>
          Go Back
        </button>
        <NuxtLink to="/dashboard" class="btn-primary">
          <i class="fas fa-home mr-2"></i>
          Go to Dashboard
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script lang="ts" src="./ErrorDisplay.ts"></script>
<style scoped src="./ErrorDisplay.css"></style>

