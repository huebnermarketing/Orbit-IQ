import { defineComponent, onMounted, watch, nextTick } from 'vue';

// Types
interface Project {
  id: number;
  name: string;
  description?: string;
}

export default defineComponent({
  name: 'ProjectDescription',
  props: {
    project: {
      type: Object as () => Project | null,
      default: null
    },
    projectId: {
      type: String,
      required: true
    }
  },
  emits: ['description-updated'],
  setup(props, { emit }) {
    const { $projectApi } = useNuxtApp();
    
    // State
    let quill: any = null;

    // Methods
    const updateDescription = (event: Event) => {
      const target = event.target as HTMLTextAreaElement;
      if (props.project) {
        emit('description-updated', target.value);
      }
    };

    const saveProjectDescription = async () => {
      if (!props.project) return;

      try {
        let content = '';
        
        if (quill) {
          // Quill editor
          content = quill.root.innerHTML;
        } else {
          // Fallback textarea - get content from project data
          content = props.project.description || '';
        }
        
        // Only save if content has changed
        if (content !== props.project.description) {
          await $projectApi.updateProject(props.projectId, {
            description: content
          });
          
          // Emit updated description
          emit('description-updated', content);
          console.log('Project description auto-saved successfully');
        }
      } catch (error) {
        console.error('Failed to auto-save project description:', error);
      }
    };

    const initializeDescriptionEditor = async () => {
      console.log('Starting description editor initialization...');
      
      // Check if the element exists
      const editorElement = document.getElementById('project-description-editor');
      if (!editorElement) {
        console.error('❌ Description editor element not found');
        return;
      }
      
      console.log('✅ Editor element found:', editorElement);
      
      // Clear any existing content
      editorElement.innerHTML = '';
      
      try {
        console.log('📦 Loading Quill module...');
        const QuillModule = await import('quill');
        const QuillClass = QuillModule.default || QuillModule;
        
        console.log('✅ Quill module loaded:', QuillClass);
        
        // Configure Quill with minimal options
        quill = new QuillClass('#project-description-editor', {
          theme: 'snow',
          placeholder: 'Enter project description...',
          modules: {
            toolbar: {
              container: [
                ['bold', 'italic', 'underline'],
                [{ 'header': [1, 2, 3, false] }],
                [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                [{ 'indent': '-1'}, { 'indent': '+1' }],
                [{ 'align': [] }],
                ['image'],
                ['clean']
              ]
            }
          }
        });
        
        // Custom image handler with drag and drop support
        const toolbar = quill.getModule('toolbar');
        toolbar.addHandler('image', () => {
          const input = document.createElement('input');
          input.setAttribute('type', 'file');
          input.setAttribute('accept', 'image/*');
          input.click();
          
          input.onchange = () => {
            const file = input.files?.[0];
            if (file) {
              const reader = new FileReader();
              reader.onload = () => {
                const range = quill.getSelection();
                quill.insertEmbed(range.index, 'image', reader.result);
              };
              reader.readAsDataURL(file);
            }
          };
        });
        
        // Add drag and drop support
        const editorElementForDrop = quill.container.querySelector('.ql-editor');
        if (editorElementForDrop) {
          editorElementForDrop.addEventListener('dragover', (e: DragEvent) => {
            e.preventDefault();
            editorElementForDrop.classList.add('drag-over');
          });
          
          editorElementForDrop.addEventListener('dragleave', (e: DragEvent) => {
            e.preventDefault();
            editorElementForDrop.classList.remove('drag-over');
          });
          
          editorElementForDrop.addEventListener('drop', (e: DragEvent) => {
            e.preventDefault();
            editorElementForDrop.classList.remove('drag-over');
            
            const files = e.dataTransfer?.files;
            if (files && files.length > 0) {
              const file = files[0];
              if (file && file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = () => {
                  const range = quill.getSelection() || { index: quill.getLength() };
                  quill.insertEmbed(range.index, 'image', reader.result);
                  console.log('✅ Image inserted via drag and drop');
                };
                reader.readAsDataURL(file);
              } else {
                console.log('❌ Only image files are supported for drag and drop');
              }
            }
          });
        }
        
        // Force toolbar to be visible immediately
        const toolbarElement = quill.getModule('toolbar').container;
        if (toolbarElement) {
          toolbarElement.style.display = 'flex';
          toolbarElement.style.visibility = 'visible';
          toolbarElement.style.opacity = '1';
          toolbarElement.style.height = 'auto';
        }
        
        // Ensure toolbar is always visible by adding focus/blur handlers
        const editorElementForFocus = quill.container.querySelector('.ql-editor');
        if (editorElementForFocus) {
          editorElementForFocus.addEventListener('focus', () => {
            if (toolbarElement) {
              toolbarElement.style.display = 'flex';
              toolbarElement.style.visibility = 'visible';
              toolbarElement.style.opacity = '1';
            }
          });
          
          editorElementForFocus.addEventListener('blur', () => {
            if (toolbarElement) {
              toolbarElement.style.display = 'flex';
              toolbarElement.style.visibility = 'visible';
              toolbarElement.style.opacity = '1';
            }
            // Auto-save on blur
            saveProjectDescription();
          });
        }
        
        console.log('✅ Quill instance created:', quill);
        
        // Debug toolbar
        const toolbarModule = quill.getModule('toolbar');
        console.log('🔧 Toolbar module:', toolbarModule);
        
        // Check if toolbar element exists
        setTimeout(() => {
          const toolbarElement = document.querySelector('#project-description-editor .ql-toolbar') as HTMLElement;
          console.log('🔧 Toolbar element:', toolbarElement);
          
          if (toolbarElement) {
            console.log('✅ Toolbar found and visible');
            toolbarElement.style.display = 'flex';
            toolbarElement.style.visibility = 'visible';
            toolbarElement.style.opacity = '1';
          } else {
            console.log('❌ Toolbar not found');
          }
        }, 100);
        
        // Listen for text changes
        quill.on('text-change', () => {
          if (props.project) {
            emit('description-updated', quill.root.innerHTML);
          }
        });
        
        // Set initial content if editing
        if (props.project?.description) {
          quill.clipboard.dangerouslyPasteHTML(props.project.description);
        }
        
        // Remove focus from editor to prevent auto-focus on page load
        quill.blur();
        
        console.log('🎉 Description editor initialized successfully!');
        
      } catch (error: any) {
        console.error('❌ Error initializing description editor:', error);
        if (error.stack) {
          console.error('Stack trace:', error.stack);
        }
      }
    };

    // Lifecycle
    onMounted(() => {
      nextTick(() => {
        setTimeout(() => {
          initializeDescriptionEditor();
        }, 100);
      });
    });

    // Watch for project data to initialize editor with content (only when project first loads)
    watch(() => props.project, (newProject) => {
      if (newProject && quill && !quill.getText().trim()) {
        // Only set content if editor is empty (initial load)
        quill.root.innerHTML = newProject.description || '';
      }
    }, { deep: true });

    return {
      quill,
      updateDescription,
      saveProjectDescription,
    };
  },
});
