<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-2xl font-bold text-text-primary">Client Persons</h2>
        <p class="text-text-muted">Manage client persons for {{ client?.company_name }}</p>
      </div>
      <button
        @click="showAddModal = true"
        class="btn-primary"
      >
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
        </svg>
        Add Client Person
      </button>
    </div>

    <!-- Filters -->
    <div class="flex items-center space-x-4">
      <div class="flex-1">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search by name or email..."
          class="input"
        />
      </div>
      <select v-model="statusFilter" class="input w-48">
        <option value="">All Status</option>
        <option value="pending">Pending</option>
        <option value="active">Active</option>
        <option value="inactive">Inactive</option>
      </select>
    </div>

    <!-- Table -->
    <div class="bg-surface rounded-xl shadow-sm border border-border-light overflow-hidden">
      <div v-if="loading" class="p-8 text-center">
        <div class="inline-flex items-center">
          <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-primary-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Loading client persons...
        </div>
      </div>

      <div v-else-if="filteredClientPersons.length === 0" class="p-8 text-center">
        <div class="w-16 h-16 bg-surface rounded-2xl flex items-center justify-center mx-auto mb-4">
          <svg class="w-8 h-8 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path>
          </svg>
        </div>
        <h3 class="text-lg font-medium text-text-primary mb-2">No client persons found</h3>
        <p class="text-text-muted mb-4">Get started by adding the first client person for this company.</p>
        <button @click="showAddModal = true" class="btn-primary">
          Add Client Person
        </button>
      </div>

      <div v-else class="overflow-x-auto">
        <table class="min-w-full divide-y divide-border-light">
          <thead class="bg-surface-alt">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">
                Client Person
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">
                Contact
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">
                Status
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">
                Added
              </th>
              <th class="px-6 py-3 text-right text-xs font-medium text-text-muted uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="bg-surface divide-y divide-border-light">
            <tr v-for="person in filteredClientPersons" :key="person.id" class="hover:bg-surface-alt">
              <!-- Client Person Info -->
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center overflow-hidden shadow-md">
                    <span class="text-white font-bold text-sm">
                      {{ person.name?.charAt(0)?.toUpperCase() || 'U' }}
                    </span>
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-medium text-text-primary">{{ person.name }}</div>
                    <div class="text-sm text-text-muted">ID: {{ person.id }}</div>
                  </div>
                </div>
              </td>

              <!-- Contact Info -->
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-text-primary">{{ person.email }}</div>
                <div v-if="person.phone" class="text-sm text-text-muted">{{ person.phone }}</div>
              </td>

              <!-- Status -->
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="getStatusBadgeClass(person.status)" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium">
                  <span :class="getStatusDotClass(person.status)" class="w-1.5 h-1.5 rounded-full mr-1.5"></span>
                  {{ person.status.charAt(0).toUpperCase() + person.status.slice(1) }}
                </span>
              </td>

              <!-- Added Date -->
              <td class="px-6 py-4 whitespace-nowrap text-sm text-text-muted">
                {{ formatDate(person.created_at) }}
              </td>

              <!-- Actions -->
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div class="flex items-center justify-end space-x-2">
                  <!-- Resend Invitation (for pending) -->
                  <button
                    v-if="person.status === 'pending'"
                    @click="resendInvitation(person)"
                    :disabled="resendingInvitation === person.id"
                    class="text-primary-600 hover:text-primary-900 transition-colors"
                    title="Resend Invitation"
                  >
                    <svg v-if="resendingInvitation !== person.id" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                    </svg>
                    <svg v-else class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  </button>

                  <!-- Edit -->
                  <button
                    @click="editClientPerson(person)"
                    class="text-primary-600 hover:text-primary-900 transition-colors"
                    title="Edit"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                    </svg>
                  </button>

                  <!-- Delete -->
                  <button
                    @click="deleteClientPerson(person)"
                    class="text-error-600 hover:text-error-900 transition-colors"
                    title="Delete"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modals -->
    <ClientPersonModal
      :show="showAddModal || showEditModal"
      :client-id="clientId"
      :client-person="selectedClientPerson"
      :is-edit="showEditModal"
      @close="closeModals"
      @saved="handleClientPersonSaved"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { clientApi } from '@/utils/api'
import ClientPersonModal from '@/components/modals/ClientPersonModal.vue'

interface Props {
  clientId: string
  client?: any
}

const props = defineProps<Props>()

const loading = ref(false)
const clientPersons = ref<any[]>([])
const searchQuery = ref('')
const statusFilter = ref('')
const showAddModal = ref(false)
const showEditModal = ref(false)
const selectedClientPerson = ref<any>(null)
const resendingInvitation = ref<string | null>(null)

const filteredClientPersons = computed(() => {
  let filtered = clientPersons.value

  // Filter by search query
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(person => 
      person.name.toLowerCase().includes(query) ||
      person.email.toLowerCase().includes(query)
    )
  }

  // Filter by status
  if (statusFilter.value) {
    filtered = filtered.filter(person => person.status === statusFilter.value)
  }

  return filtered
})

const loadClientPersons = async () => {
  loading.value = true
  try {
    const response = await clientApi.getClientPersons(props.clientId)
    clientPersons.value = response || []
  } catch (error) {
    console.error('Failed to load client persons:', error)
  } finally {
    loading.value = false
  }
}

const editClientPerson = (person: any) => {
  selectedClientPerson.value = person
  showEditModal.value = true
}

const deleteClientPerson = async (person: any) => {
  if (confirm(`Are you sure you want to delete ${person.name}?`)) {
    try {
      await clientApi.deleteClientPerson(props.clientId, person.id)
      await loadClientPersons()
    } catch (error) {
      console.error('Failed to delete client person:', error)
    }
  }
}

const resendInvitation = async (person: any) => {
  resendingInvitation.value = person.id
  try {
    await clientApi.resendInvitation(props.clientId, person.id)
    await loadClientPersons()
  } catch (error) {
    console.error('Failed to resend invitation:', error)
  } finally {
    resendingInvitation.value = null
  }
}

const closeModals = () => {
  showAddModal.value = false
  showEditModal.value = false
  selectedClientPerson.value = null
}

const handleClientPersonSaved = async () => {
  closeModals()
  await loadClientPersons()
}

const getStatusBadgeClass = (status: string) => {
  switch (status) {
    case 'pending':
      return 'bg-yellow-100 text-yellow-800'
    case 'active':
      return 'bg-green-100 text-green-800'
    case 'inactive':
      return 'bg-gray-100 text-gray-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

const getStatusDotClass = (status: string) => {
  switch (status) {
    case 'pending':
      return 'bg-yellow-400'
    case 'active':
      return 'bg-green-400'
    case 'inactive':
      return 'bg-gray-400'
    default:
      return 'bg-gray-400'
  }
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

onMounted(() => {
  loadClientPersons()
})
</script>
