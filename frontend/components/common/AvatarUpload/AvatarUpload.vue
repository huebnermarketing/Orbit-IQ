<template>
  <div class="relative inline-block mx-auto text-center">
    <!-- Avatar Display -->
    <div class="relative group" :style="{ width: size + 'px', height: size + 'px' }">
      <div
        class="avatar-container"
        :class="{ 'cursor-pointer': !disabled }"
        :style="{ fontSize: Math.max(12, size / 4) + 'px' }"
        @click="!disabled && fileInputRef?.click()"
      >
        <img
          v-if="avatarUrl"
          :src="avatarUrl"
          :alt="altText"
          class="w-full h-full object-cover"
          @error="handleImageError"
          @load="handleImageLoad"
        />
        <span v-else>{{ initials }}</span>
      </div>

      <!-- Upload Overlay -->
      <div v-if="!disabled" class="upload-overlay" @click="fileInputRef?.click()">
        <svg
          class="text-white"
          :style="{ width: Math.max(16, size / 4) + 'px', height: Math.max(16, size / 4) + 'px' }"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
          ></path>
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
          ></path>
        </svg>
      </div>

      <!-- Loading Overlay -->
      <div v-if="uploading" class="loading-overlay">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
      </div>
    </div>

    <!-- Hidden File Input -->
    <input
      ref="fileInputRef"
      type="file"
      accept="image/*"
      class="hidden"
      @change="handleFileSelect"
    />

    <!-- Error Message -->
    <div v-if="error" class="error-message">
      {{ error }}
    </div>

    <!-- Upload Progress -->
    <div v-if="uploading && uploadProgress > 0" class="progress-container">
      <div class="progress-bar-bg">
        <div class="progress-bar" :style="{ width: uploadProgress + '%' }"></div>
      </div>
      <p class="progress-text">{{ uploadProgress }}% uploaded</p>
    </div>
  </div>
</template>

<script lang="ts" src="./AvatarUpload.ts"></script>
<style scoped src="./AvatarUpload.css"></style>
