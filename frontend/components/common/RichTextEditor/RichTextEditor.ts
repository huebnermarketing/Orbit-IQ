import { ref, watch, onMounted, onUnmounted, nextTick } from 'vue';

export default defineComponent({
  name: 'RichTextEditor',
  props: {
    modelValue: {
      type: String,
      default: '',
    },
    placeholder: {
      type: String,
      default: 'Enter text...',
    },
    editorId: {
      type: String,
      default: () => `rich-text-editor-${Math.random().toString(36).substr(2, 9)}`,
    },
    minHeight: {
      type: String,
      default: '400px',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    toolbar: {
      type: Array,
      default: () => [
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
  emits: ['update:modelValue', 'change', 'blur', 'ready'],
  setup(props, { emit }) {
    const quill = ref<any>(null);
    const isLoading = ref(true);
    const editorContainerRef = ref<HTMLElement | null>(null);

    const initializeQuill = async () => {
      // Wait for DOM to be ready
      await nextTick();

      // Additional delay to ensure DOM is fully rendered
      await new Promise((resolve) => setTimeout(resolve, 100));

      const editorElement = document.getElementById(props.editorId);
      if (!editorElement) {
        console.error('❌ RichTextEditor container element not found:', props.editorId);
        isLoading.value = false;
        return;
      }

      // Ensure element is visible and has dimensions
      // Retry logic to wait for element to be properly rendered
      let retries = 0;
      const maxRetries = 10;
      while (retries < maxRetries) {
        const rect = editorElement.getBoundingClientRect();
        const isVisible =
          rect.width > 0 &&
          rect.height > 0 &&
          window.getComputedStyle(editorElement).display !== 'none' &&
          window.getComputedStyle(editorElement).visibility !== 'hidden';

        if (isVisible) {
          break;
        }

        retries++;
        if (retries < maxRetries) {
          await new Promise((resolve) => setTimeout(resolve, 50));
        } else {
          console.warn('⚠️ Editor element may not be fully visible, proceeding anyway');
        }
      }

      // Clear any existing content
      editorElement.innerHTML = '';

      try {
        console.log('📦 Loading Quill module...');
        const QuillModule = await import('quill');
        const QuillClass = QuillModule.default || QuillModule;
        // Get Delta class for safe image insertion
        const Delta = (QuillClass as any).import('delta') || (QuillModule as any).Delta;

        console.log('✅ Quill module loaded:', QuillClass);

        // Configure Quill with error handling for selection issues
        try {
          quill.value = new QuillClass(`#${props.editorId}`, {
            theme: 'snow',
            placeholder: props.placeholder,
            readOnly: props.disabled,
            modules: {
              toolbar: {
                container: props.toolbar,
              },
            },
          });
        } catch (initError) {
          console.error('Error creating Quill instance:', initError);
          throw initError;
        }

        // Wait for Quill to fully initialize and DOM to be ready
        await nextTick();

        // Ensure the editor container exists and is ready
        const editorContainer = quill.value.container;
        if (!editorContainer) {
          throw new Error('Quill container not found after initialization');
        }

        // Wait for the editor content area to be ready
        const editorContent = editorContainer.querySelector('.ql-editor');
        if (!editorContent) {
          // Wait a bit more for Quill to render
          await new Promise((resolve) => setTimeout(resolve, 100));
        }

        // Additional delay to ensure all Quill internals are ready
        await new Promise((resolve) => setTimeout(resolve, 100));

        // Add global error handler for Quill selection errors
        // This catches errors that occur in Quill's internal selection handling
        const originalErrorHandler = window.onerror;
        const quillErrorHandler: OnErrorEventHandler = (event, source, lineno, colno, error) => {
          // Check if this is a Quill selection error
          const errorMessage = typeof event === 'string' ? event : error?.message || '';
          const sourceStr = source || '';
          if (
            error &&
            error.message &&
            error.message.includes('Cannot read properties of null') &&
            (sourceStr.includes('quill') || errorMessage.includes('offset'))
          ) {
            console.debug('Quill selection error caught and suppressed');
            return true; // Suppress the error
          }
          // Let other errors through
          if (originalErrorHandler) {
            return originalErrorHandler(event, source, lineno, colno, error);
          }
          return false;
        };
        (quillErrorHandler as any).__isQuillHandler = true;
        (quillErrorHandler as any).__originalHandler = originalErrorHandler;
        window.onerror = quillErrorHandler;

        // Patch Quill's selection module to handle null elements gracefully
        // This prevents errors when Quill tries to access DOM elements that don't exist
        const selectionModule = quill.value.getModule('selection');
        if (selectionModule) {
          // Patch the update method
          if (selectionModule.update) {
            const originalUpdate = selectionModule.update.bind(selectionModule);
            selectionModule.update = function (...args: any[]) {
              try {
                // Check if the editor container and content exist before updating
                if (quill.value && quill.value.container) {
                  const editor = quill.value.container.querySelector('.ql-editor');
                  if (editor && editor.offsetParent !== null) {
                    return originalUpdate(...args);
                  }
                }
              } catch (error: any) {
                // Silently ignore selection update errors
                if (error && error.message && !error.message.includes('offset')) {
                  console.debug('Selection update skipped:', error);
                }
              }
            };
          }

          // Patch the getRange method to handle null elements
          if (selectionModule.getRange) {
            const originalGetRange = selectionModule.getRange.bind(selectionModule);
            selectionModule.getRange = function (...args: any[]) {
              try {
                if (quill.value && quill.value.container) {
                  const editor = quill.value.container.querySelector('.ql-editor');
                  if (editor && editor.offsetParent !== null) {
                    return originalGetRange(...args);
                  }
                }
                return null;
              } catch (error: any) {
                if (error && error.message && !error.message.includes('offset')) {
                  console.debug('Selection getRange skipped:', error);
                }
                return null;
              }
            };
          }
        }

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
                // Use a safer method to insert image that doesn't rely on selection
                const insertImageSafely = () => {
                  try {
                    // Get the editor length first
                    const length = quill.value.getLength();
                    const insertIndex = Math.max(0, length - 1);

                    // Use updateContents which is more reliable than insertEmbed
                    // Access Delta through Quill instance
                    const DeltaClass =
                      (quill.value.constructor as any).import('delta') ||
                      (quill.value.constructor as any).Delta ||
                      Delta;
                    const delta = new DeltaClass()
                      .retain(insertIndex)
                      .insert({ image: reader.result });
                    quill.value.updateContents(delta);
                  } catch (error) {
                    // If that fails, try using clipboard API
                    try {
                      const length = quill.value.getLength();
                      const DeltaClass =
                        (quill.value.constructor as any).import('delta') ||
                        (quill.value.constructor as any).Delta ||
                        Delta;
                      const delta = new DeltaClass()
                        .retain(length - 1)
                        .insert({ image: reader.result });
                      quill.value.updateContents(delta);
                    } catch (clipboardError) {
                      // Last resort: directly manipulate the DOM
                      const editor = quill.value.container.querySelector('.ql-editor');
                      if (editor) {
                        const img = document.createElement('img');
                        img.src = reader.result as string;
                        editor.appendChild(img);
                        // Trigger a text change to sync with Quill
                        quill.value.update();
                      } else {
                        console.error('Could not insert image: editor not found');
                      }
                    }
                  }
                };

                insertImageSafely();
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
                  // Use a safer method to insert image that doesn't rely on selection
                  const insertImageSafely = () => {
                    try {
                      // Get the editor length first
                      const length = quill.value.getLength();
                      const insertIndex = Math.max(0, length - 1);

                      // Use updateContents which is more reliable than insertEmbed
                      const DeltaClass =
                        (quill.value.constructor as any).import('delta') ||
                        (quill.value.constructor as any).Delta ||
                        Delta;
                      const delta = new DeltaClass()
                        .retain(insertIndex)
                        .insert({ image: reader.result });
                      quill.value.updateContents(delta);
                      console.log('✅ Image inserted via drag and drop');
                    } catch (error) {
                      // If that fails, try using clipboard API
                      try {
                        const length = quill.value.getLength();
                        const DeltaClass =
                          (quill.value.constructor as any).import('delta') ||
                          (quill.value.constructor as any).Delta ||
                          Delta;
                        const delta = new DeltaClass()
                          .retain(length - 1)
                          .insert({ image: reader.result });
                        quill.value.updateContents(delta);
                        console.log('✅ Image inserted via drag and drop (fallback method)');
                      } catch (clipboardError) {
                        // Last resort: directly manipulate the DOM
                        const editor = quill.value.container.querySelector('.ql-editor');
                        if (editor) {
                          const img = document.createElement('img');
                          img.src = reader.result as string;
                          editor.appendChild(img);
                          // Trigger a text change to sync with Quill
                          quill.value.update();
                          console.log('✅ Image inserted via drag and drop (DOM method)');
                        } else {
                          console.error('Could not insert image: editor not found');
                        }
                      }
                    }
                  };

                  insertImageSafely();
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
          toolbarElement.style.display = 'flex';
          toolbarElement.style.visibility = 'visible';
          toolbarElement.style.opacity = '1';
          toolbarElement.style.height = 'auto';
        }

        // Ensure toolbar is always visible by adding focus/blur handlers
        const editorElementForFocus = quill.value.container.querySelector('.ql-editor');
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
            emit('blur');
          });
        }

        // Listen for text changes
        quill.value.on('text-change', () => {
          try {
            const content = quill.value.root.innerHTML;
            emit('update:modelValue', content);
            emit('change', content);
          } catch (error) {
            console.error('Error handling text change:', error);
          }
        });

        // Set initial content
        try {
          if (props.modelValue) {
            quill.value.clipboard.dangerouslyPasteHTML(props.modelValue);
          } else {
            // Set empty content - Quill will handle the placeholder
            quill.value.setText('');
            // Don't set selection during initialization as it can cause errors in Quill 2.0
            // The editor will be ready for user interaction after initialization
          }
        } catch (error) {
          console.error('Error setting initial content:', error);
        }

        isLoading.value = false;
        emit('ready', quill.value);

        console.log('🎉 RichTextEditor initialized successfully!');
      } catch (err: any) {
        console.error('❌ Error initializing RichTextEditor:', err);
        if (err.stack) {
          console.error('Stack trace:', err.stack);
        }
        isLoading.value = false;
      }
    };

    // Watch for modelValue changes from outside
    watch(
      () => props.modelValue,
      (newValue) => {
        if (quill.value && quill.value.root.innerHTML !== newValue) {
          const selection = quill.value.getSelection();
          quill.value.clipboard.dangerouslyPasteHTML(newValue || '');
          if (selection) {
            quill.value.setSelection(selection);
          }
        }
      }
    );

    // Watch for disabled prop changes
    watch(
      () => props.disabled,
      (newValue) => {
        if (quill.value) {
          quill.value.enable(!newValue);
        }
      }
    );

    // Initialize on mount
    onMounted(() => {
      nextTick(() => {
        setTimeout(() => {
          initializeQuill();
        }, 100);
      });
    });

    // Cleanup on unmount
    onUnmounted(() => {
      if (quill.value) {
        quill.value = null;
      }
      // Restore original error handler if we set one
      if (window.onerror && (window.onerror as any).__isQuillHandler) {
        window.onerror = (window.onerror as any).__originalHandler;
      }
    });

    // Expose methods for parent components
    const getContent = () => {
      return quill.value ? quill.value.root.innerHTML : '';
    };

    const setContent = (content: string) => {
      if (quill.value) {
        quill.value.clipboard.dangerouslyPasteHTML(content);
      }
    };

    const focus = () => {
      if (quill.value) {
        const editor = quill.value.container.querySelector('.ql-editor');
        if (editor) {
          (editor as HTMLElement).focus();
        }
      }
    };

    const blur = () => {
      if (quill.value) {
        quill.value.blur();
      }
    };

    const handleTextareaInput = (event: Event) => {
      const target = event.target as HTMLTextAreaElement;
      emit('update:modelValue', target.value);
    };

    return {
      quill,
      isLoading,
      editorContainerRef,
      getContent,
      setContent,
      focus,
      blur,
      handleTextareaInput,
    };
  },
});
