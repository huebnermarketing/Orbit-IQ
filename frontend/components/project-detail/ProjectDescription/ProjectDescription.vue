<template>
  <!-- Right Column - Project Description Editor -->
  <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden self-start">
    <!-- Header -->
    <div class="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-3">
          <div class="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
            <i class="far fa-file-alt text-blue-600 text-lg"></i>
          </div>
          <div>
            <h3 class="text-lg font-semibold text-gray-900">Project Description</h3>
            <p class="text-sm text-gray-500">Rich text editor with formatting options</p>
          </div>
        </div>
        <div class="flex items-center space-x-2">
          <span
            class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"
          >
            <i class="far fa-check-circle mr-1 text-xs"></i>
            Auto-save
          </span>
        </div>
      </div>
    </div>

    <!-- Editor Container -->
    <div class="p-6">
      <div class="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
        <!-- Rich Text Editor -->
        <div id="project-description-editor" class="min-h-96">
          <!-- Fallback textarea if Quill fails to load -->
          <textarea
            v-if="!isQuillInitialized"
            :value="project?.description || ''"
            @input="updateDescription"
            @blur="saveProjectDescription"
            placeholder="Enter project description..."
            class="w-full h-96 p-4 border-0 resize-none focus:ring-0 focus:outline-none text-gray-700 placeholder-gray-400"
          ></textarea>
        </div>
      </div>

      <!-- Editor Footer -->
      <div class="mt-4 pb-2 flex items-center justify-between text-xs text-gray-500">
        <div class="flex items-center space-x-4">
          <span class="flex items-center">
            <i class="fa-solid fa-circle-info mr-1 text-xs"></i>
            Supports bold, italic, lists, and images
          </span>
        </div>
        <div class="flex items-center space-x-2">
          <span class="flex items-center">
            <div class="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
            Changes saved automatically
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" src="./ProjectDescription.ts"></script>
<style scoped src="./ProjectDescription.css"></style>
