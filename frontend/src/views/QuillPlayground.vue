<template>
  <div class="min-h-screen bg-gray-100 p-8">
    <div class="max-w-4xl mx-auto">
      <h1 class="text-3xl font-bold text-gray-900 mb-8">Quill Editor Playground</h1>
      
      <div class="bg-white rounded-lg shadow-lg p-6">
        <h2 class="text-xl font-semibold mb-4">Test Quill Editor</h2>
        <p class="text-gray-600 mb-6">This is a simple playground to test Quill editor functionality.</p>
        
        <!-- Quill Editor Container -->
        <div class="border border-gray-300 rounded-lg overflow-hidden">
          <div id="quill-editor" class="min-h-[400px]"></div>
        </div>
        
        <!-- Controls -->
        <div class="mt-6 flex gap-4">
          <button 
            @click="getContent" 
            class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Get Content
          </button>
          <button 
            @click="setContent" 
            class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Set Sample Content
          </button>
          <button 
            @click="clearContent" 
            class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Clear
          </button>
        </div>
        
        <!-- Content Display -->
        <div class="mt-6">
          <h3 class="text-lg font-medium mb-2">Editor Content:</h3>
          <div class="bg-gray-50 p-4 rounded border min-h-[100px]">
            <pre class="whitespace-pre-wrap">{{ editorContent }}</pre>
          </div>
        </div>
        
        <!-- HTML Output -->
        <div class="mt-6">
          <h3 class="text-lg font-medium mb-2">HTML Output:</h3>
          <div class="bg-gray-50 p-4 rounded border min-h-[100px]">
            <pre class="whitespace-pre-wrap">{{ htmlContent }}</pre>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const editorContent = ref('')
const htmlContent = ref('')
let quill: any = null

onMounted(() => {
  // Dynamically import Quill to avoid SSR issues
  import('quill').then((Quill) => {
    const QuillClass = Quill.default || Quill
    
    // Configure Quill
    const toolbarOptions = [
      ['bold', 'italic', 'underline'],
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'indent': '-1'}, { 'indent': '+1' }],
      [{ 'align': [] }],
      ['image'],
      ['clean']
    ]
    
    quill = new QuillClass('#quill-editor', {
      theme: 'snow',
      placeholder: 'Start typing...',
      modules: {
        toolbar: toolbarOptions
      }
    })
    
    // Listen for text changes
    quill.on('text-change', () => {
      editorContent.value = quill.getText()
      htmlContent.value = quill.root.innerHTML
    })
    
    // Set initial content
    setContent()
  }).catch((error) => {
    console.error('Failed to load Quill:', error)
  })
})

onUnmounted(() => {
  if (quill) {
    quill = null
  }
})

const getContent = () => {
  if (quill) {
    editorContent.value = quill.getText()
    htmlContent.value = quill.root.innerHTML
  }
}

const setContent = () => {
  if (quill) {
    const sampleContent = `
# Welcome to Quill Editor

This is a **bold text** example.

This is an *italic text* example.

This is an __underlined text__ example.

## Features:
- Bold, italic, underline formatting
- Headers (H1-H6)
- Lists (ordered and unordered)
- Image insertion
- Text alignment

### Try it out:
1. Type some text
2. Select text and use toolbar buttons
3. Test different formatting options

Happy editing! 🎉
    `
    quill.clipboard.dangerouslyPasteHTML(sampleContent)
  }
}

const clearContent = () => {
  if (quill) {
    quill.setText('')
    editorContent.value = ''
    htmlContent.value = ''
  }
}
</script>

<style>
/* Import Quill styles */
@import 'quill/dist/quill.snow.css';

/* Custom styles for the playground */
.ql-editor {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  font-size: 14px;
  line-height: 1.5;
}

.ql-toolbar {
  border-top: 1px solid #ccc;
  border-left: 1px solid #ccc;
  border-right: 1px solid #ccc;
}

.ql-container {
  border-bottom: 1px solid #ccc;
  border-left: 1px solid #ccc;
  border-right: 1px solid #ccc;
}
</style>
