import { defineComponent, ref, computed, onMounted, watch, nextTick } from 'vue';
import type { Project } from '~/types';

export default defineComponent({
  name: 'ProjectDescription',
  props: {
    project: {
      type: Object as () => Project | null,
      default: null,
    },
    projectId: {
      type: String,
      required: true,
    },
  },
  emits: ['description-updated'],
  setup(props, { emit }) {
    const { $projectApi } = useNuxtApp();
    const quill = ref<any>(null);
    const isQuillInitialized = computed(() => quill.value !== null);

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

        if (quill.value) {
          // Quill editor
          content = quill.value.root.innerHTML;
        } else {
          // Fallback textarea - get content from project data
          content = props.project.description || '';
        }

        // Only save if content has changed
        if (content !== props.project.description) {
          await $projectApi.updateProject(props.projectId, {
            description: content,
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
        quill.value = new QuillClass('#project-description-editor', {
          theme: 'snow',
          placeholder: 'Enter project description...',
          modules: {
            toolbar: {
              container: [
                ['bold', 'italic', 'underline'],
                [{ header: [1, 2, 3, false] }],
                [{ list: 'ordered' }, { list: 'bullet' }],
                [{ indent: '-1' }, { indent: '+1' }],
                [{ align: [] }],
                ['image'],
                ['clean'],
              ],
            },
          },
        });

        // Custom image handler with drag and drop support
        const toolbar = quill.value.getModule('toolbar');
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
                const range = quill.value.getSelection();
                quill.value.insertEmbed(range.index, 'image', reader.result);
              };
              reader.readAsDataURL(file);
            }
          };
        });

        // Add drag and drop support
        const editorElementForDrop = quill.value.container.querySelector('.ql-editor');
        if (editorElementForDrop) {
          editorElementForDrop.addEventListener('dragover', (e: DragEvent) => {
            e.preventDefault();
            (editorElementForDrop as HTMLElement).classList.add('drag-over');
          });

          editorElementForDrop.addEventListener('dragleave', (e: DragEvent) => {
            e.preventDefault();
            (editorElementForDrop as HTMLElement).classList.remove('drag-over');
          });

          editorElementForDrop.addEventListener('drop', (e: DragEvent) => {
            e.preventDefault();
            (editorElementForDrop as HTMLElement).classList.remove('drag-over');

            const files = e.dataTransfer?.files;
            if (files && files.length > 0) {
              const file = files[0];
              if (file && file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = () => {
                  const range = quill.value.getSelection() || { index: quill.value.getLength() };
                  quill.value.insertEmbed(range.index, 'image', reader.result);
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
        const toolbarElement = quill.value.getModule('toolbar').container;
        if (toolbarElement) {
          (toolbarElement as HTMLElement).style.display = 'flex';
          (toolbarElement as HTMLElement).style.visibility = 'visible';
          (toolbarElement as HTMLElement).style.opacity = '1';
          (toolbarElement as HTMLElement).style.height = 'auto';
        }

        // Listen for text changes
        quill.value.on('text-change', () => {
          if (props.project) {
            emit('description-updated', quill.value.root.innerHTML);
          }
        });

        // Set initial content if editing
        if (props.project?.description) {
          quill.value.clipboard.dangerouslyPasteHTML(props.project.description);
        }

        // Remove focus from editor to prevent auto-focus on page load
        quill.value.blur();

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
    watch(
      () => props.project,
      (newProject) => {
        if (
          newProject &&
          quill.value &&
          !quill.value.getText().trim()
        ) {
          // Only set content if editor is empty (initial load)
          quill.value.root.innerHTML = newProject.description || '';
        }
      },
      { deep: true }
    );

    return {
      quill,
      isQuillInitialized,
      updateDescription,
      saveProjectDescription,
    };
  },
});
