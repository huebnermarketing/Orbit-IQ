<template>
  <div class="rich-text-editor-wrapper">
    <!-- Loading state -->
    <div v-if="isLoading" class="rich-text-editor-loading" :style="{ minHeight }">
      <div class="text-center">
        <div
          class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-2"
        ></div>
        <p class="text-gray-600">Loading editor...</p>
      </div>
    </div>

    <!-- Quill Editor Container -->
    <div
      :id="editorId"
      ref="editorContainerRef"
      class="rich-text-editor-container"
      :class="{ 'rich-text-editor-disabled': disabled }"
      :style="{
        height: minHeight === '100%' ? '100%' : minHeight,
        minHeight: minHeight === '100%' ? '0' : minHeight,
        visibility: isLoading ? 'hidden' : 'visible',
        opacity: isLoading ? 0 : 1,
      }"
    ></div>

    <!-- Fallback textarea in case Quill fails -->
    <textarea
      v-if="!quill && !isLoading"
      :value="modelValue"
      @input="handleTextareaInput"
      @blur="$emit('blur')"
      :placeholder="placeholder"
      :disabled="disabled"
      class="rich-text-editor-fallback"
      :style="{ minHeight }"
    ></textarea>
  </div>
</template>

<script lang="ts" src="./RichTextEditor.ts"></script>
<style scoped src="./RichTextEditor.css"></style>
