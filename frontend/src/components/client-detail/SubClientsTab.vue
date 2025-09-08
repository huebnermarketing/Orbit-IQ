<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <h3 class="text-lg font-semibold text-text-primary">Sub-Clients</h3>
      <button
        @click="openAddModal"
        class="btn-primary"
      >
        <svg class="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
        </svg>
        Add Sub-Client
      </button>
    </div>

    <!-- Sub-Clients List -->
    <div v-if="subClients.length > 0" class="card">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-border-light">
          <thead class="bg-surface-alt">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">
                Sub-Client Name
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">
                Email
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">
                Phone
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">
                Website
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="bg-surface divide-y divide-border-light">
            <tr v-for="subClient in subClients" :key="subClient.id" class="hover:bg-surface-alt">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-text-primary">{{ subClient.name }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-text-primary">{{ subClient.email }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-text-primary">{{ subClient.phone || '-' }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-text-primary">
                  <a 
                    v-if="subClient.website" 
                    :href="subClient.website" 
                    target="_blank" 
                    class="text-primary-600 hover:text-primary-800"
                  >
                    {{ subClient.website }}
                  </a>
                  <span v-else>-</span>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div class="flex items-center space-x-2">
                  <button
                    @click="editSubClient(subClient)"
                    class="text-primary-600 hover:text-primary-800 transition-colors"
                    title="Edit Sub-Client"
                  >
                    <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                    </svg>
                  </button>
                  <button
                    @click="deleteSubClient(subClient)"
                    class="text-red-600 hover:text-red-800 transition-colors"
                    title="Delete Sub-Client"
                  >
                    <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

    <!-- Empty State -->
    <div v-else class="card text-center py-12">
      <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
      </svg>
      <h3 class="mt-2 text-sm font-medium text-gray-900">No sub-clients</h3>
      <p class="mt-1 text-sm text-gray-500">Get started by adding a new sub-client.</p>
      <div class="mt-6">
        <button
          @click="openAddModal"
          class="btn-primary"
        >
          <svg class="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
          </svg>
          Add Sub-Client
        </button>
      </div>
    </div>

    <!-- Modals -->
    <SubClientModal
      v-if="showAddModal"
      :client-id="clientId"
      @close="closeAddModal"
      @saved="handleSubClientSaved"
    />

    <SubClientModal
      v-if="showEditModal"
      :client-id="clientId"
      :sub-client="editingSubClient"
      :is-edit="true"
      @close="closeEditModal"
      @saved="handleSubClientSaved"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { clientApi } from '@/utils/api'
import SubClientModal from '@/components/modals/SubClientModal.vue'

interface Props {
  clientId: string
}

const props = defineProps<Props>()

const subClients = ref<any[]>([])
const loading = ref(false)
const showAddModal = ref(false)
const showEditModal = ref(false)
const editingSubClient = ref<any>(null)

const loadSubClients = async () => {
  try {
    loading.value = true
    const response = await clientApi.getSubClients(props.clientId)
    subClients.value = response || []
  } catch (error) {
    console.error('Failed to load sub-clients:', error)
  } finally {
    loading.value = false
  }
}

const openAddModal = () => {
  showAddModal.value = true
}

const closeAddModal = () => {
  showAddModal.value = false
}

const editSubClient = (subClient: any) => {
  editingSubClient.value = subClient
  showEditModal.value = true
}

const closeEditModal = () => {
  showEditModal.value = false
  editingSubClient.value = null
}

const deleteSubClient = async (subClient: any) => {
  if (confirm(`Are you sure you want to delete "${subClient.name}"?`)) {
    try {
      await clientApi.deleteSubClient(props.clientId, subClient.id)
      await loadSubClients()
    } catch (error) {
      console.error('Failed to delete sub-client:', error)
      alert('Failed to delete sub-client. Please try again.')
    }
  }
}

const handleSubClientSaved = async () => {
  showAddModal.value = false
  showEditModal.value = false
  editingSubClient.value = null
  await loadSubClients()
}

onMounted(() => {
  loadSubClients()
})
</script>
