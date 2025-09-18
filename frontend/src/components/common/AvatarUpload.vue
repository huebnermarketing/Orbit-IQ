<template>
  <div class="relative inline-block mx-auto text-center">
    <!-- Avatar Display -->
    <div class="relative group" :style="{ width: size + 'px', height: size + 'px' }">
      <div 
        class="w-full h-full bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white font-bold overflow-hidden"
        :class="{ 'cursor-pointer': !disabled }"
        :style="{ fontSize: Math.max(12, size / 4) + 'px' }"
        @click="!disabled && $refs.fileInput.click()"
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
      <div 
        v-if="!disabled"
        class="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer z-10"
        @click="$refs.fileInput.click()"
      >
        <svg class="text-white" :style="{ width: Math.max(16, size / 4) + 'px', height: Math.max(16, size / 4) + 'px' }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path>
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path>
        </svg>
      </div>
      
      <!-- Loading Overlay -->
      <div 
        v-if="uploading"
        class="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center z-20"
      >
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
      </div>
      
    </div>
    
    <!-- Hidden File Input -->
    <input
      ref="fileInput"
      type="file"
      accept="image/*"
      class="hidden"
      @change="handleFileSelect"
    />
    
    <!-- Error Message -->
    <div v-if="error" class="mt-2 text-sm text-red-600 text-center">
      {{ error }}
    </div>
    
    <!-- Upload Progress -->
    <div v-if="uploading && uploadProgress > 0" class="mt-2 space-y-1">
      <div class="w-full bg-gray-200 rounded-full h-2">
        <div 
          class="bg-primary-600 h-2 rounded-full transition-all duration-300"
          :style="{ width: uploadProgress + '%' }"
        ></div>
      </div>
      <p class="text-xs text-gray-600 text-center">{{ uploadProgress }}% uploaded</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import imageCompression from 'browser-image-compression'
import { getInitials } from '@/utils/helpers'

interface Props {
  avatarUrl?: string
  name?: string
  size?: number
  disabled?: boolean
  maxFileSize?: number // in MB
  maxWidthOrHeight?: number
  quality?: number
}

const props = withDefaults(defineProps<Props>(), {
  size: 96,
  disabled: false,
  maxFileSize: 2, // 2MB
  maxWidthOrHeight: 400,
  quality: 0.8
})

const emit = defineEmits<{
  upload: [file: File]
  error: [message: string]
}>()

const uploading = ref(false)
const uploadProgress = ref(0)
const error = ref('')

const initials = computed(() => {
  return getInitials(props.name || '')
})

const altText = computed(() => {
  return props.name ? `${props.name}'s avatar` : 'User avatar'
})

const handleFileSelect = async (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  
  if (!file) return
  
  // Reset error
  error.value = ''
  
  // Validate file type
  if (!file.type.startsWith('image/')) {
    error.value = 'Please select a valid image file'
    emit('error', error.value)
    return
  }
  
  // Validate file size
  const fileSizeMB = file.size / (1024 * 1024)
  if (fileSizeMB > props.maxFileSize) {
    error.value = `File size must be less than ${props.maxFileSize}MB`
    emit('error', error.value)
    return
  }
  
  try {
    uploading.value = true
    uploadProgress.value = 0
    
    // Compress and optimize the image
    const compressedFile = await imageCompression(file, {
      maxSizeMB: props.maxFileSize,
      maxWidthOrHeight: props.maxWidthOrHeight,
      useWebWorker: true,
      quality: props.quality,
      onProgress: (progress) => {
        uploadProgress.value = Math.round(progress)
      }
    })
    
    // Reset progress
    uploadProgress.value = 0
    
    // Emit the compressed file
    emit('upload', compressedFile)
    
  } catch (err) {
    console.error('Image compression failed:', err)
    error.value = 'Failed to process image. Please try again.'
    emit('error', error.value)
  } finally {
    uploading.value = false
    uploadProgress.value = 0
    // Reset file input
    target.value = ''
  }
}

const handleImageError = (event: Event) => {
  console.error('Avatar image failed to load:', props.avatarUrl)
  console.error('Image error event:', event)
}

const handleImageLoad = () => {
  console.log('Avatar image loaded successfully:', props.avatarUrl)
}

// Expose methods for parent component
defineExpose({
  clearError: () => { error.value = '' }
})
</script>
