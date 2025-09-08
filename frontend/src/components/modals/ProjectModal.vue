<template>
  <div v-if="show" class="fixed inset-0 z-50 overflow-y-auto">
    <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
      <!-- Background overlay -->
      <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" @click="$emit('close')"></div>

      <!-- Modal panel -->
      <div class="inline-block align-bottom bg-surface rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
        <div class="bg-surface px-6 pt-6 pb-4">
          <div class="flex items-center justify-between mb-6">
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
                  <option v-for="client in clients" :key="client.id" :value="client.id">
                    {{ client.company_name }}
                  </option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-text-primary mb-2">
                  Select Sub-Client
                </label>
                <select v-model="form.sub_client_id" class="input" :disabled="!form.client_id">
                  <option value="">Select Sub-Client</option>
                  <option v-for="subClient in subClients" :key="subClient.id" :value="subClient.id">
                    {{ subClient.name }}
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
                <select v-model="form.am_id" required class="input">
                  <option value="">Select AM</option>
                  <option v-for="am in amUsers" :key="am.id" :value="am.id">
                    {{ am.name }} ({{ am.email }})
                  </option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-text-primary mb-2">
                  Project Manager
                </label>
                <select v-model="form.pm_id" class="input">
                  <option value="">Select PM</option>
                  <option v-for="pm in pmUsers" :key="pm.id" :value="pm.id">
                    {{ pm.name }} ({{ pm.email }})
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

            <!-- Project Description -->
            <div>
              <label class="block text-sm font-medium text-text-primary mb-2">
                Project Description
              </label>
              <div class="border border-border-light rounded-lg">
                <ckeditor
                  v-model="form.description"
                  :editor="editor"
                  :config="editorConfig"
                ></ckeditor>
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
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch, computed, onMounted } from 'vue'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'
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

// CK Editor setup
const editor = ClassicEditor
const editorConfig = {
  toolbar: ['heading', '|', 'bold', 'italic', 'link', 'bulletedList', 'numberedList', '|', 'outdent', 'indent', '|', 'blockQuote', 'insertTable', 'undo', 'redo'],
  placeholder: 'Enter project description...'
}

// Data arrays
const clients = ref([])
const subClients = ref([])
const amUsers = ref([])
const pmUsers = ref([])
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
  form.sub_client_id = ''
  if (form.client_id) {
    try {
      const response = await clientApi.getSubClients(form.client_id)
      subClients.value = response.data || []
    } catch (error) {
      console.error('Failed to load sub-clients:', error)
      subClients.value = []
    }
  } else {
    subClients.value = []
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
    clients.value = response.data || []
  } catch (error) {
    console.error('Failed to load clients:', error)
  }
}

const loadAMUsers = async () => {
  try {
    const response = await authApi.getAMUsers()
    amUsers.value = response.data || []
  } catch (error) {
    console.error('Failed to load AM users:', error)
  }
}

const loadPMUsers = async () => {
  try {
    const response = await authApi.getPMUsers()
    pmUsers.value = response.data || []
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
