<template>
  <Teleport to="body">
    <div class="toast-container">
      <TransitionGroup name="fade" tag="div" class="toast-list">
        <div
          v-for="toast in toasts"
          :key="toast.id"
          :class="getToastClasses(toast.type)"
          class="toast-item"
          role="alert"
        >
          <span class="toast-message">
            <span class="toast-icon">
              <component :is="getToastIcon(toast.type)" />
            </span>
            {{ toast.message }}
          </span>
          <button
            type="button"
            class="toast-close"
            @click="removeToast(toast.id)"
            aria-label="Close"
          >
            <CloseIcon />
          </button>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script lang="ts" src="./ToastContainer.ts"></script>
<style scoped src="./ToastContainer.css"></style>