<template>
  <!-- Right Column - Project Description Editor -->
  <div class="bg-white rounded-xl border border-gray-200 shadow-sm">
    <!-- Header -->
    <div class="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-xl">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-3">
          <div class="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
            <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
          </div>
          <div>
            <h3 class="text-lg font-semibold text-gray-900">Project Description</h3>
            <p class="text-sm text-gray-500">Rich text editor with formatting options</p>
          </div>
        </div>
        <div class="flex items-center space-x-2">
          <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
            </svg>
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
            v-if="!quill"
            :value="project?.description || ''"
            @input="updateDescription"
            @blur="saveProjectDescription"
            placeholder="Enter project description..."
            class="w-full h-96 p-4 border-0 resize-none focus:ring-0 focus:outline-none text-gray-700 placeholder-gray-400"
          ></textarea>
        </div>
      </div>
      
      <!-- Editor Footer -->
      <div class="mt-4 flex items-center justify-between text-xs text-gray-500">
        <div class="flex items-center space-x-4">
          <span class="flex items-center">
            <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
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
