<template>
  <div v-if="show" class="fixed inset-0 z-50 overflow-hidden">
    <!-- Background overlay -->
    <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" @click="$emit('close')"></div>

    <!-- Full screen modal -->
    <div class="fixed inset-0 flex items-center justify-center p-0">
      <div class="bg-surface w-full h-full flex flex-col shadow-xl">
        <!-- Header -->
        <div class="flex items-center justify-between px-6 py-4 border-b border-border-light">
          <h3 class="text-2xl font-bold text-text-primary">
            {{ isEdit ? 'Edit Project' : 'Create New Project' }}
          </h3>
          <button
            @click="$emit('close')"
            class="text-text-muted hover:text-text-primary transition-colors"
          >
            <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <!-- Main Content - 50/50 Split -->
        <div class="flex-1 flex overflow-hidden">
          <!-- Left Side - Form Fields -->
          <div class="w-1/2 p-6 overflow-y-auto">

          <form @submit.prevent="handleSubmit" class="space-y-6">
            <!-- Project Name and Number -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-text-primary mb-2">
                  Project Name <span class="text-error-500">*</span>
                </label>
                <input
                  v-model="form.name"
                  type="text"
                  required
                  class="input"
                  placeholder="Enter project name"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-text-primary mb-2">
                  Project Number <span class="text-error-500">*</span>
                </label>
                <input
                  v-model="form.project_number"
                  type="text"
                  required
                  class="input"
                  placeholder="Auto-generated"
                />
                <p class="text-xs text-text-muted mt-1">6-digit number (auto-generated, can be modified)</p>
              </div>
            </div>

            <!-- Client and Sub-Client -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-text-primary mb-2">
                  Choose Client <span class="text-error-500">*</span>
                </label>
                <select v-model="form.client_id" required class="input" @change="onClientChange">
                  <option value="">Select Client</option>
                  <option v-for="client in (clients || [])" :key="client?.id" :value="client?.id">
                    {{ client?.company_name }}
                  </option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-text-primary mb-2">
                  Select Sub-Client
                </label>
                <select v-model="form.sub_client_id" class="input" :disabled="!form.client_id">
                  <option value="">Select Sub-Client</option>
                  <option v-for="subClient in (subClients || [])" :key="subClient?.id" :value="subClient?.id">
                    {{ subClient?.name }}
                  </option>
                </select>
              </div>
            </div>

            <!-- Funding Source and Hour Type -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-text-primary mb-2">
                  Funding Source <span class="text-error-500">*</span>
                </label>
                <select v-model="form.funding_source" required class="input">
                  <option value="">Select Funding Source</option>
                  <option value="fixed">Fixed</option>
                  <option value="hourly">Hourly</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-text-primary mb-2">
                  Hour Type <span class="text-error-500">*</span>
                </label>
                <select v-model="form.hour_type" required class="input">
                  <option value="">Select Hour Type</option>
                  <option value="billable">Billable</option>
                  <option value="non_billable">Non-Billable</option>
                  <option value="internal">Internal</option>
                </select>
              </div>
            </div>

            <!-- AM and PM -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-text-primary mb-2">
                  Account Manager <span class="text-error-500">*</span>
                </label>
                <select v-model="form.am_id" required class="input" @change="onAMChange">
                  <option value="">Select AM</option>
                  <option v-for="am in (amUsers || [])" :key="am?.id" :value="am?.id">
                    {{ am?.name }} ({{ am?.email }})
                  </option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-text-primary mb-2">
                  Project Manager
                </label>
                <select v-model="form.pm_id" class="input" :disabled="!form.am_id">
                  <option value="">Select PM</option>
                  <option v-for="pm in filteredPMUsers" :key="pm?.id" :value="pm?.id">
                    {{ pm?.name }} ({{ pm?.email }})
                  </option>
                </select>
              </div>
            </div>

            <!-- Start Date and Due Date -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-text-primary mb-2">
                  Start Date
                </label>
                <input
                  v-model="form.start_date"
                  type="date"
                  class="input"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-text-primary mb-2">
                  Due Date
                </label>
                <input
                  v-model="form.due_date"
                  type="date"
                  class="input"
                />
              </div>
            </div>

            <!-- Internal Team and Client Team -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-text-primary mb-2">
                  Internal Team
                </label>
                <div class="relative">
                  <input
                    v-model="internalTeamSearch"
                    type="text"
                    class="input"
                    placeholder="Search internal users..."
                    @focus="showInternalTeamDropdown = true"
                    @blur="hideInternalTeamDropdown"
                  />
                  <div v-if="showInternalTeamDropdown" class="absolute z-10 w-full mt-1 bg-surface border border-border-light rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    <div v-for="user in filteredInternalUsers" :key="user.id" 
                         class="px-4 py-2 hover:bg-surface-alt cursor-pointer flex items-center justify-between"
                         @click="toggleInternalUser(user)">
                      <span>{{ user.name }} ({{ user.email }})</span>
                      <input type="checkbox" :checked="form.internal_team.includes(user.id)" class="ml-2" />
                    </div>
                  </div>
                </div>
                <div v-if="form.internal_team.length > 0" class="mt-2 flex flex-wrap gap-2">
                  <span v-for="userId in form.internal_team" :key="userId" 
                        class="inline-flex items-center px-2 py-1 bg-primary-100 text-primary-800 text-xs rounded-full">
                    {{ getInternalUserById(userId)?.name }}
                    <button type="button" @click="removeInternalUser(userId)" class="ml-1 text-primary-600 hover:text-primary-800">×</button>
                  </span>
                </div>
              </div>
              <div>
                <label class="block text-sm font-medium text-text-primary mb-2">
                  Client Team
                </label>
                <div class="relative">
                  <input
                    v-model="clientTeamSearch"
                    type="text"
                    class="input"
                    placeholder="Search client users..."
                    @focus="showClientTeamDropdown = true"
                    @blur="hideClientTeamDropdown"
                  />
                  <div v-if="showClientTeamDropdown" class="absolute z-10 w-full mt-1 bg-surface border border-border-light rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    <div v-for="user in filteredClientUsers" :key="user.id" 
                         class="px-4 py-2 hover:bg-surface-alt cursor-pointer flex items-center justify-between"
                         @click="toggleClientUser(user)">
                      <span>{{ user.name }} ({{ user.email }})</span>
                      <input type="checkbox" :checked="form.client_team.includes(user.id)" class="ml-2" />
                    </div>
                  </div>
                </div>
                <div v-if="form.client_team.length > 0" class="mt-2 flex flex-wrap gap-2">
                  <span v-for="userId in form.client_team" :key="userId" 
                        class="inline-flex items-center px-2 py-1 bg-success-100 text-success-800 text-xs rounded-full">
                    {{ getClientUserById(userId)?.name }}
                    <button type="button" @click="removeClientUser(userId)" class="ml-1 text-success-600 hover:text-success-800">×</button>
                  </span>
                </div>
              </div>
            </div>

            <!-- User Groups and Teams -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-text-primary mb-2">
                  Add User Groups
                </label>
                <div class="relative">
                  <input
                    v-model="userGroupSearch"
                    type="text"
                    class="input"
                    placeholder="Search user groups..."
                    @focus="showUserGroupDropdown = true"
                    @blur="hideUserGroupDropdown"
                  />
                  <div v-if="showUserGroupDropdown" class="absolute z-10 w-full mt-1 bg-surface border border-border-light rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    <div v-for="group in filteredUserGroups" :key="group.id" 
                         class="px-4 py-2 hover:bg-surface-alt cursor-pointer flex items-center justify-between"
                         @click="toggleUserGroup(group)">
                      <span>{{ group.name }}</span>
                      <input type="checkbox" :checked="form.user_groups.includes(group.id)" class="ml-2" />
                    </div>
                  </div>
                </div>
                <div v-if="form.user_groups.length > 0" class="mt-2 flex flex-wrap gap-2">
                  <span v-for="groupId in form.user_groups" :key="groupId" 
                        class="inline-flex items-center px-2 py-1 bg-info-100 text-info-800 text-xs rounded-full">
                    {{ getUserGroupById(groupId)?.name }}
                    <button type="button" @click="removeUserGroup(groupId)" class="ml-1 text-info-600 hover:text-info-800">×</button>
                  </span>
                </div>
              </div>
              <div>
                <label class="block text-sm font-medium text-text-primary mb-2">
                  Add Teams
                </label>
                <div class="relative">
                  <input
                    v-model="teamSearch"
                    type="text"
                    class="input"
                    placeholder="Search teams..."
                    @focus="showTeamDropdown = true"
                    @blur="hideTeamDropdown"
                  />
                  <div v-if="showTeamDropdown" class="absolute z-10 w-full mt-1 bg-surface border border-border-light rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    <div v-for="team in filteredTeams" :key="team.id" 
                         class="px-4 py-2 hover:bg-surface-alt cursor-pointer flex items-center justify-between"
                         @click="toggleTeam(team)">
                      <span>{{ team.name }}</span>
                      <input type="checkbox" :checked="form.teams.includes(team.id)" class="ml-2" />
                    </div>
                  </div>
                </div>
                <div v-if="form.teams.length > 0" class="mt-2 flex flex-wrap gap-2">
                  <span v-for="teamId in form.teams" :key="teamId" 
                        class="inline-flex items-center px-2 py-1 bg-warning-100 text-warning-800 text-xs rounded-full">
                    {{ getTeamById(teamId)?.name }}
                    <button type="button" @click="removeTeam(teamId)" class="ml-1 text-warning-600 hover:text-warning-800">×</button>
                  </span>
                </div>
              </div>
            </div>

            <!-- Error Message -->
            <div v-if="error" class="alert-error">
              <div class="flex">
                <svg class="w-5 h-5 text-error-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <div class="ml-3">
                  <p class="text-sm text-error-800">{{ error }}</p>
                </div>
              </div>
            </div>

            <!-- Form Actions -->
            <div class="flex items-center justify-end space-x-3 pt-6 border-t border-border-light">
              <button
                type="button"
                @click="$emit('close')"
                class="btn-outline"
              >
                Discard
              </button>
              <button
                type="submit"
                :disabled="loading"
                class="btn-primary"
              >
                <svg v-if="loading" class="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {{ loading ? 'Saving...' : 'Submit' }}
              </button>
            </div>
          </form>
          </div>

          <!-- Right Side - Project Description -->
          <div class="w-1/2 p-6 border-l border-border-light">
            <div class="h-full flex flex-col">
              <label class="block text-sm font-medium text-text-primary mb-4">
                Project Description
              </label>
              <div class="flex-1 border border-border-light rounded-lg overflow-hidden relative">
                <!-- Loading state -->
                <div v-if="!quill" class="min-h-[400px] flex items-center justify-center bg-gray-50">
                  <div class="text-center">
                    <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                    <p class="text-gray-600">Loading editor...</p>
                  </div>
                </div>
                
                <!-- Quill Editor Container -->
                <div id="quill-editor" class="min-h-[400px]" v-show="quill"></div>
                
                <!-- Fallback textarea in case Quill fails -->
                <textarea
                  v-if="!quill"
                  v-model="form.description"
                  class="w-full h-full p-4 border-0 resize-none focus:outline-none absolute inset-0"
                  style="min-height: 400px; font-family: -apple-system, BlinkMacSystemFont, San Francisco, Segoe UI, Roboto, Helvetica Neue, sans-serif; font-size: 14px; line-height: 1.5; direction: ltr; text-align: left;"
                  placeholder="Enter project description..."
                ></textarea>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
/* Import Quill styles globally */
@import 'quill/dist/quill.snow.css';
</style>

<style scoped>
/* Custom styles for Quill in modal */
.ql-editor {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  font-size: 14px;
  line-height: 1.5;
  direction: ltr;
  text-align: left;
}

/* Ensure Quill editor container has proper height */
#quill-editor {
  min-height: 400px;
}

/* Force toolbar visibility */
:deep(.ql-toolbar) {
  display: flex !important;
  visibility: visible !important;
  opacity: 1 !important;
  background: white;
  border: 1px solid #ccc;
  border-bottom: none;
  height: 42px !important;
  min-height: 42px !important;
  padding: 8px 12px !important;
}

:deep(.ql-container) {
  border: 1px solid #ccc;
  border-top: none;
}

:deep(.ql-toolbar .ql-formats) {
  display: flex !important;
  align-items: center !important;
}

:deep(.ql-toolbar button) {
  display: inline-block !important;
  visibility: visible !important;
  opacity: 1 !important;
}

/* Drag and drop visual feedback */
:deep(.ql-editor) {
  transition: border-color 0.2s ease;
}

:deep(.ql-editor.drag-over) {
  border: 2px dashed #007bff !important;
  background-color: #f8f9fa;
}
</style>

<script setup lang="ts">
import { ref, reactive, watch, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { clientApi, authApi } from '@/utils/api'

interface Project {
  id?: number
  name: string
  project_number: string
  description: string
  client_id: string
  sub_client_id?: string
  funding_source: string
  hour_type: string
  am_id: string
  pm_id?: string
  start_date: string
  due_date: string
  internal_team: string[]
  client_team: string[]
  user_groups: string[]
  teams: string[]
  color: string
}

interface Props {
  show: boolean
  project?: Project | null
  isEdit?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  project: null,
  isEdit: false
})

const emit = defineEmits<{
  close: []
  saved: [project: Project]
}>()

const loading = ref(false)
const error = ref('')

// Quill Editor
let quill: any = null

const initializeQuill = async () => {
  console.log('Starting Quill initialization...')
  
  // Check if the element exists
  const editorElement = document.getElementById('quill-editor')
  if (!editorElement) {
    console.error('❌ Quill editor element not found')
    return
  }
  
  console.log('✅ Editor element found:', editorElement)
  
  // Clear any existing content
  editorElement.innerHTML = ''
  
  try {
    console.log('📦 Loading Quill module...')
    const QuillModule = await import('quill')
    const QuillClass = QuillModule.default || QuillModule
    
    console.log('✅ Quill module loaded:', QuillClass)
    
    // Configure Quill with minimal options
    quill = new QuillClass('#quill-editor', {
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
    })
    
    // Custom image handler with drag and drop support
    const toolbar = quill.getModule('toolbar')
    toolbar.addHandler('image', () => {
      const input = document.createElement('input')
      input.setAttribute('type', 'file')
      input.setAttribute('accept', 'image/*')
      input.click()
      
      input.onchange = () => {
        const file = input.files[0]
        if (file) {
          const reader = new FileReader()
          reader.onload = () => {
            const range = quill.getSelection()
            quill.insertEmbed(range.index, 'image', reader.result)
          }
          reader.readAsDataURL(file)
        }
      }
    })
    
    // Add drag and drop support
    const editorElement = quill.container.querySelector('.ql-editor')
    if (editorElement) {
      editorElement.addEventListener('dragover', (e) => {
        e.preventDefault()
        editorElement.classList.add('drag-over')
      })
      
      editorElement.addEventListener('dragleave', (e) => {
        e.preventDefault()
        editorElement.classList.remove('drag-over')
      })
      
      editorElement.addEventListener('drop', (e) => {
        e.preventDefault()
        editorElement.classList.remove('drag-over')
        
        const files = e.dataTransfer.files
        if (files.length > 0) {
          const file = files[0]
          if (file.type.startsWith('image/')) {
            const reader = new FileReader()
            reader.onload = () => {
              const range = quill.getSelection() || { index: quill.getLength() }
              quill.insertEmbed(range.index, 'image', reader.result)
              console.log('✅ Image inserted via drag and drop')
            }
            reader.readAsDataURL(file)
          } else {
            console.log('❌ Only image files are supported for drag and drop')
          }
        }
      })
    }
    
    // Force toolbar to be visible immediately
    const toolbarElement = quill.getModule('toolbar').container
    if (toolbarElement) {
      toolbarElement.style.display = 'flex'
      toolbarElement.style.visibility = 'visible'
      toolbarElement.style.opacity = '1'
      toolbarElement.style.height = 'auto'
    }
    
    // Ensure toolbar is always visible by adding focus/blur handlers
    const editorElementForFocus = quill.container.querySelector('.ql-editor')
    if (editorElementForFocus) {
      editorElementForFocus.addEventListener('focus', () => {
        if (toolbarElement) {
          toolbarElement.style.display = 'flex'
          toolbarElement.style.visibility = 'visible'
          toolbarElement.style.opacity = '1'
        }
      })
      
      editorElementForFocus.addEventListener('blur', () => {
        if (toolbarElement) {
          toolbarElement.style.display = 'flex'
          toolbarElement.style.visibility = 'visible'
          toolbarElement.style.opacity = '1'
        }
      })
    }
    
    console.log('✅ Quill instance created:', quill)
    
    // Debug toolbar
    const toolbarModule = quill.getModule('toolbar')
    console.log('🔧 Toolbar module:', toolbarModule)
    
    // Check if toolbar element exists
    setTimeout(() => {
      const toolbarElement = document.querySelector('#quill-editor .ql-toolbar')
      console.log('🔧 Toolbar element:', toolbarElement)
      
      if (toolbarElement) {
        console.log('✅ Toolbar found and visible')
        toolbarElement.style.display = 'flex'
        toolbarElement.style.visibility = 'visible'
        toolbarElement.style.opacity = '1'
      } else {
        console.log('❌ Toolbar not found')
      }
    }, 100)
    
    // Listen for text changes
    quill.on('text-change', () => {
      form.description = quill.root.innerHTML
    })
    
    // Set initial content if editing
    if (form.description) {
      quill.clipboard.dangerouslyPasteHTML(form.description)
    } else {
      // Add a small invisible character to ensure toolbar shows
      quill.setText('\u200B') // Zero-width space
      quill.setSelection(0, 0) // Reset cursor to start
    }
    
    console.log('🎉 Quill editor initialized successfully!')
    
  } catch (error: any) {
    console.error('❌ Error initializing Quill:', error)
    if (error.stack) {
      console.error('Stack trace:', error.stack)
    }
  }
}


// Data arrays
const clients = ref([])
const subClients = ref([])
const amUsers = ref([])
const pmUsers = ref([])
const allPMUsers = ref([]) // Store all PM users for filtering
const internalUsers = ref([])
const clientUsers = ref([])
const userGroups = ref([])
const teams = ref([])

// Search states
const internalTeamSearch = ref('')
const clientTeamSearch = ref('')
const userGroupSearch = ref('')
const teamSearch = ref('')

// Dropdown states
const showInternalTeamDropdown = ref(false)
const showClientTeamDropdown = ref(false)
const showUserGroupDropdown = ref(false)
const showTeamDropdown = ref(false)

const form = reactive<Project>({
  name: '',
  project_number: '',
  description: '',
  client_id: '',
  sub_client_id: '',
  funding_source: '',
  hour_type: '',
  am_id: '',
  pm_id: '',
  start_date: '',
  due_date: '',
  internal_team: [],
  client_team: [],
  user_groups: [],
  teams: [],
  color: '#3B82F6'
})

// Generate 6-digit project number
const generateProjectNumber = () => {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

// Computed properties for filtered data
const filteredPMUsers = computed(() => {
  console.log('Computing filtered PM users for AM:', form.am_id)
  
  if (!form.am_id) {
    console.log('No AM selected, returning empty PM list')
    return [] // No PMs shown if no AM is selected
  }
  
  // Find the selected AM
  const selectedAM = amUsers.value.find(am => am.id === form.am_id)
  console.log('Selected AM:', selectedAM)
  
  if (!selectedAM || !selectedAM.assigned_p_ms || selectedAM.assigned_p_ms.length === 0) {
    console.log('AM has no assigned PMs, returning empty list')
    return [] // No PMs if AM has no assigned PMs
  }
  
  // Get the IDs of PMs assigned to this AM
  const assignedPMIds = selectedAM.assigned_p_ms.map(pm => pm.id)
  console.log('Assigned PM IDs:', assignedPMIds)
  
  // Filter PMs to show only those assigned to this AM
  const filteredPMs = allPMUsers.value.filter(pm => assignedPMIds.includes(pm.id))
  console.log('Filtered PMs for AM:', filteredPMs)
  return filteredPMs
})

const filteredInternalUsers = computed(() => {
  if (!internalTeamSearch.value) return internalUsers.value
  return internalUsers.value.filter(user => 
    user.name.toLowerCase().includes(internalTeamSearch.value.toLowerCase()) ||
    user.email.toLowerCase().includes(internalTeamSearch.value.toLowerCase())
  )
})

const filteredClientUsers = computed(() => {
  if (!clientTeamSearch.value) return clientUsers.value
  return clientUsers.value.filter(user => 
    user.name.toLowerCase().includes(clientTeamSearch.value.toLowerCase()) ||
    user.email.toLowerCase().includes(clientTeamSearch.value.toLowerCase())
  )
})

const filteredUserGroups = computed(() => {
  if (!userGroupSearch.value) return userGroups.value
  return userGroups.value.filter(group => 
    group.name.toLowerCase().includes(userGroupSearch.value.toLowerCase())
  )
})

const filteredTeams = computed(() => {
  if (!teamSearch.value) return teams.value
  return teams.value.filter(team => 
    team.name.toLowerCase().includes(teamSearch.value.toLowerCase())
  )
})

// Helper functions
const getInternalUserById = (id: string) => internalUsers.value.find(user => user.id === id)
const getClientUserById = (id: string) => clientUsers.value.find(user => user.id === id)
const getUserGroupById = (id: string) => userGroups.value.find(group => group.id === id)
const getTeamById = (id: string) => teams.value.find(team => team.id === id)

// Client change handler
const onClientChange = async () => {
  console.log('onClientChange called with client_id:', form.client_id)
  form.sub_client_id = ''
  form.am_id = '' // Reset AM when client changes
  form.pm_id = '' // Reset PM when client changes
  
  if (form.client_id) {
    try {
      console.log('Loading sub-clients for client:', form.client_id)
      // Load sub-clients for the selected client
      const subClientsResponse = await clientApi.getSubClients(form.client_id)
      console.log('Sub-clients response:', subClientsResponse)
      // The API returns the data directly, not wrapped in a data property
      subClients.value = subClientsResponse || []
      
      console.log('Loading client details for client:', form.client_id)
      // Load client details to get primary account manager
      const clientResponse = await clientApi.getClient(form.client_id)
      console.log('Client response:', clientResponse)
      // The API returns the data directly, not wrapped in a data property
      const client = clientResponse
      
      if (client && client.primary_account_manager_id) {
        console.log('Client has primary AM:', client.primary_account_manager_id)
        console.log('Available AM users:', amUsers.value)
        // Find the primary AM in the AM users list and set it
        const primaryAM = amUsers.value.find(am => am.id === client.primary_account_manager_id)
        if (primaryAM) {
          console.log('Found primary AM:', primaryAM)
          form.am_id = primaryAM.id
          // Auto-populate PM when AM is set
          await onAMChange()
        } else {
          console.log('Primary AM not found in AM users list')
        }
      } else {
        console.log('Client has no primary AM or client data is missing')
      }
    } catch (error) {
      console.error('Failed to load client data:', error)
      subClients.value = []
    }
  } else {
    subClients.value = []
  }
}

// Account Manager change handler
const onAMChange = async () => {
  form.pm_id = '' // Reset PM when AM changes
  
  if (form.am_id) {
    try {
      // Find the selected AM user
      const selectedAM = amUsers.value.find(am => am.id === form.am_id)
      if (selectedAM && selectedAM.assigned_p_ms && selectedAM.assigned_p_ms.length > 0) {
        // If AM has only one assigned PM, auto-select it
        if (selectedAM.assigned_p_ms.length === 1) {
          const assignedPM = allPMUsers.value.find(pm => pm.id === selectedAM.assigned_p_ms[0].id)
          if (assignedPM) {
            form.pm_id = assignedPM.id
          }
        }
        // If AM has multiple PMs, let user choose (don't auto-select)
      }
    } catch (error) {
      console.error('Failed to load assigned PMs:', error)
    }
  }
}

// Team/User management functions
const toggleInternalUser = (user: any) => {
  const index = form.internal_team.indexOf(user.id)
  if (index > -1) {
    form.internal_team.splice(index, 1)
  } else {
    form.internal_team.push(user.id)
  }
}

const removeInternalUser = (userId: string) => {
  const index = form.internal_team.indexOf(userId)
  if (index > -1) {
    form.internal_team.splice(index, 1)
  }
}

const toggleClientUser = (user: any) => {
  const index = form.client_team.indexOf(user.id)
  if (index > -1) {
    form.client_team.splice(index, 1)
  } else {
    form.client_team.push(user.id)
  }
}

const removeClientUser = (userId: string) => {
  const index = form.client_team.indexOf(userId)
  if (index > -1) {
    form.client_team.splice(index, 1)
  }
}

const toggleUserGroup = (group: any) => {
  const index = form.user_groups.indexOf(group.id)
  if (index > -1) {
    form.user_groups.splice(index, 1)
  } else {
    form.user_groups.push(group.id)
  }
}

const removeUserGroup = (groupId: string) => {
  const index = form.user_groups.indexOf(groupId)
  if (index > -1) {
    form.user_groups.splice(index, 1)
  }
}

const toggleTeam = (team: any) => {
  const index = form.teams.indexOf(team.id)
  if (index > -1) {
    form.teams.splice(index, 1)
  } else {
    form.teams.push(team.id)
  }
}

const removeTeam = (teamId: string) => {
  const index = form.teams.indexOf(teamId)
  if (index > -1) {
    form.teams.splice(index, 1)
  }
}

// Dropdown visibility handlers
const hideInternalTeamDropdown = () => {
  setTimeout(() => { showInternalTeamDropdown.value = false }, 200)
}

const hideClientTeamDropdown = () => {
  setTimeout(() => { showClientTeamDropdown.value = false }, 200)
}

const hideUserGroupDropdown = () => {
  setTimeout(() => { showUserGroupDropdown.value = false }, 200)
}

const hideTeamDropdown = () => {
  setTimeout(() => { showTeamDropdown.value = false }, 200)
}

// Load data functions
const loadClients = async () => {
  try {
    const response = await clientApi.getClients()
    console.log('Clients response:', response)
    // The API returns paginated data, so we need to access the 'data' property
    clients.value = response.data || []
    console.log('Loaded clients:', clients.value)
  } catch (error) {
    console.error('Failed to load clients:', error)
    clients.value = [] // Ensure clients is always an array
  }
}

const loadAMUsers = async () => {
  try {
    const response = await authApi.getAMUsers()
    console.log('AM users response:', response)
    // The API returns the data directly, not wrapped in a data property
    amUsers.value = response || []
    console.log('Loaded AM users:', amUsers.value)
  } catch (error) {
    console.error('Failed to load AM users:', error)
  }
}

const loadPMUsers = async () => {
  try {
    const response = await authApi.getPMUsers()
    console.log('PM users response:', response)
    // The API returns the data directly, not wrapped in a data property
    allPMUsers.value = response || []
    pmUsers.value = response || [] // Keep for backward compatibility
    console.log('Loaded PM users:', allPMUsers.value)
  } catch (error) {
    console.error('Failed to load PM users:', error)
  }
}

const loadInternalUsers = async () => {
  try {
    const response = await authApi.getUsers({ role: 'user' })
    internalUsers.value = response.data || []
  } catch (error) {
    console.error('Failed to load internal users:', error)
  }
}

const loadClientUsers = async () => {
  try {
    const response = await authApi.getUsers({ role: 'client' })
    clientUsers.value = response.data || []
  } catch (error) {
    console.error('Failed to load client users:', error)
  }
}

const loadUserGroups = async () => {
  try {
    const response = await authApi.getUserGroups()
    userGroups.value = response.data || []
  } catch (error) {
    console.error('Failed to load user groups:', error)
  }
}

const loadTeams = async () => {
  try {
    const response = await authApi.getTeams()
    teams.value = response.data || []
  } catch (error) {
    console.error('Failed to load teams:', error)
  }
}

// Watch for project changes to populate form
watch(() => props.project, (newProject) => {
  if (newProject) {
    form.name = newProject.name || ''
    form.project_number = newProject.project_number || ''
    form.description = newProject.description || ''
    form.client_id = newProject.client_id || ''
    form.sub_client_id = newProject.sub_client_id || ''
    form.funding_source = newProject.funding_source || ''
    form.hour_type = newProject.hour_type || ''
    form.am_id = newProject.am_id || ''
    form.pm_id = newProject.pm_id || ''
    form.start_date = newProject.start_date || ''
    form.due_date = newProject.due_date || ''
    form.internal_team = newProject.internal_team || []
    form.client_team = newProject.client_team || []
    form.user_groups = newProject.user_groups || []
    form.teams = newProject.teams || []
    form.color = newProject.color || '#3B82F6'
    
    // Load sub-clients if client is selected
    if (form.client_id) {
      onClientChange()
    }
  } else {
    // Reset form and generate new project number
    form.name = ''
    form.project_number = generateProjectNumber()
    form.description = ''
    form.client_id = ''
    form.sub_client_id = ''
    form.funding_source = ''
    form.hour_type = ''
    form.am_id = ''
    form.pm_id = ''
    form.start_date = ''
    form.due_date = ''
    form.internal_team = []
    form.client_team = []
    form.user_groups = []
    form.teams = []
    form.color = '#3B82F6'
    subClients.value = []
  }
}, { immediate: true })

// Load data on mount
onMounted(async () => {
  await Promise.all([
    loadClients(),
    loadAMUsers(),
    loadPMUsers(),
    loadInternalUsers(),
    loadClientUsers(),
    loadUserGroups(),
    loadTeams()
  ])
})

// Watch for modal visibility and initialize Quill when shown
watch(() => props.show, (newShow) => {
  if (newShow) {
    // Initialize Quill editor when modal is shown - use nextTick to ensure DOM is ready
    nextTick(async () => {
      setTimeout(async () => {
        await initializeQuill()
      }, 500)
    })
  } else {
    // Clean up when modal is hidden
    if (quill) {
      quill = null
    }
  }
}, { immediate: true })

onUnmounted(() => {
  if (quill) {
    quill = null
  }
})

const handleSubmit = async () => {
  error.value = ''
  loading.value = true

  try {
    // TODO: Implement API call
    await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API call
    
    const projectData: Project = {
      ...form,
      id: props.isEdit ? props.project?.id : Date.now() // Mock ID
    }

    emit('saved', projectData)
  } catch (err) {
    error.value = 'Failed to save project. Please try again.'
  } finally {
    loading.value = false
  }
}
</script>
