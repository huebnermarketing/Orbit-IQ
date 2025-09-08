<template>
  <AppLayout>
    <div class="space-y-6">
      <!-- Client Header -->
      <div class="bg-surface shadow rounded-lg p-6">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-4">
            <div class="w-16 h-16 bg-surface-alt rounded-xl flex items-center justify-center overflow-hidden">
              <img 
                v-if="client?.logo_url" 
                :src="client.logo_url" 
                :alt="client?.company_name"
                class="w-full h-full object-cover"
                @error="handleLogoError"
              />
              <div v-else class="w-full h-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center">
                <span class="text-white font-bold text-xl">
                  {{ client?.company_name?.charAt(0)?.toUpperCase() || 'C' }}
                </span>
              </div>
            </div>
            <div>
              <h1 class="text-2xl font-bold text-text-primary">{{ client?.company_name || 'Loading...' }}</h1>
              <p class="text-text-secondary">{{ client?.email || 'Loading...' }}</p>
              <div class="flex items-center space-x-4 mt-2">
                <span 
                  :class="[
                    'status-badge',
                    client?.client_type === 'Agency' 
                      ? 'bg-info-100 text-info-800 border-info-200' 
                      : 'bg-success-100 text-success-800 border-success-200'
                  ]"
                >
                  {{ client?.client_type }}
                </span>
                <span 
                  :class="[
                    'status-badge',
                    client?.is_active 
                      ? 'status-active' 
                      : 'status-inactive'
                  ]"
                >
                  {{ client?.is_active ? 'Active' : 'Inactive' }}
                </span>
              </div>
            </div>
          </div>
          <div class="flex items-center space-x-3">
            <button
              @click="editClient"
              class="btn-outline"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
              </svg>
              Edit Client
            </button>
            <button
              @click="goBack"
              class="btn-outline"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
              </svg>
              Back to Clients
            </button>
          </div>
        </div>
      </div>

      <!-- Tabs -->
      <div class="bg-surface shadow rounded-lg">
        <div class="border-b border-border-light">
          <nav class="-mb-px flex space-x-8 px-6" aria-label="Tabs">
            <button
              v-for="tab in tabs"
              :key="tab.id"
              @click="activeTab = tab.id"
              :class="[
                'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm',
                activeTab === tab.id
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-text-muted hover:text-text-primary hover:border-border-medium'
              ]"
            >
              {{ tab.name }}
            </button>
          </nav>
        </div>

        <div class="p-6">
          <!-- Loading State -->
          <div v-if="loading" class="flex items-center justify-center py-12">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            <span class="ml-2 text-text-muted">Loading client data...</span>
          </div>

          <!-- Company Overview Tab -->
          <div v-else-if="activeTab === 'overview'" class="space-y-8">
            <div class="grid grid-cols-1 gap-8 lg:grid-cols-2">
              <!-- Company Information -->
              <div class="relative overflow-hidden bg-gradient-to-br from-surface to-surface-alt rounded-2xl shadow-xl border border-border-light">
                <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-500 via-secondary-500 to-primary-600"></div>
                <div class="p-8">
                  <div class="mb-6">
                    <h3 class="text-xl font-bold text-text-primary">Company Information</h3>
                    <p class="text-sm text-text-muted">Business details and contact information</p>
                  </div>
                  
                  <div class="space-y-6">
                    <div class="grid grid-cols-1 gap-4">
                      <div class="group">
                        <label class="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">Company Name</label>
                        <div class="text-lg font-semibold text-text-primary group-hover:text-primary-600 transition-colors">
                          {{ client?.company_name }}
                        </div>
                      </div>
                      
                      <div class="group">
                        <label class="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">Email Address</label>
                        <div class="flex items-center space-x-2">
                          <svg class="w-4 h-4 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                          </svg>
                          <span class="text-text-primary font-medium">{{ client?.email }}</span>
                        </div>
                      </div>
                      
                      <div class="group">
                        <label class="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">Phone Number</label>
                        <div class="flex items-center space-x-2">
                          <svg class="w-4 h-4 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                          </svg>
                          <span class="text-text-primary font-medium">{{ client?.phone || 'Not provided' }}</span>
                        </div>
                      </div>
                      
                      <div class="group">
                        <label class="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">Website</label>
                        <div class="flex items-center space-x-2">
                          <svg class="w-4 h-4 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                          </svg>
                          <a v-if="client?.website" :href="client.website" target="_blank" class="text-primary-600 hover:text-primary-700 font-medium transition-colors flex items-center space-x-1">
                            <span>{{ client.website }}</span>
                            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                            </svg>
                          </a>
                          <span v-else class="text-text-muted italic">Not provided</span>
                        </div>
                      </div>
                      
                      <div class="group">
                        <label class="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">Address</label>
                        <div class="flex items-start space-x-2">
                          <svg class="w-4 h-4 text-text-muted mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                          </svg>
                          <span class="text-text-primary font-medium">{{ client?.address || 'No address provided' }}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div class="flex items-center justify-between pt-4 border-t border-border-light">
                      <div class="flex items-center space-x-4">
                        <div class="flex items-center space-x-2">
                          <span class="text-xs font-semibold text-text-muted uppercase tracking-wider">Type</span>
                          <span 
                            :class="[
                              'inline-flex px-3 py-1 text-xs font-bold rounded-full',
                              client?.client_type === 'Agency' 
                                ? 'bg-blue-100 text-blue-800 border border-blue-200' 
                                : 'bg-green-100 text-green-800 border border-green-200'
                            ]"
                          >
                            {{ client?.client_type }}
                          </span>
                        </div>
                        <div class="flex items-center space-x-2">
                          <span class="text-xs font-semibold text-text-muted uppercase tracking-wider">Status</span>
                          <span 
                            :class="[
                              'inline-flex px-3 py-1 text-xs font-bold rounded-full',
                              client?.is_active 
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' 
                                : 'bg-red-100 text-red-800 border border-red-200'
                            ]"
                          >
                            <div 
                              :class="[
                                'w-2 h-2 rounded-full mr-2',
                                client?.is_active ? 'bg-emerald-500' : 'bg-red-500'
                              ]"
                            ></div>
                            {{ client?.is_active ? 'Active' : 'Inactive' }}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Account Managers -->
              <div class="relative overflow-hidden bg-gradient-to-br from-surface to-surface-alt rounded-2xl shadow-xl border border-border-light">
                <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>
                <div class="p-8">
                  <div class="mb-6">
                    <h3 class="text-xl font-bold text-text-primary">Account Managers</h3>
                    <p class="text-sm text-text-muted">Team members managing this client</p>
                  </div>
                  
                  <div class="space-y-8">
                    <!-- Primary Account Manager -->
                    <div class="bg-surface-alt rounded-xl p-6 shadow-sm border border-border-light">
                      <div class="flex items-center mb-4">
                        <div class="w-8 h-8 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
                          <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                          </svg>
                        </div>
                        <h4 class="ml-3 text-sm font-bold text-text-primary uppercase tracking-wider">Primary Manager</h4>
                      </div>
                      
                      <div v-if="client?.primary_account_manager" class="flex items-center space-x-4">
                        <div class="w-14 h-14 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-2xl flex items-center justify-center overflow-hidden shadow-lg">
                          <img 
                            v-if="client.primary_account_manager.avatar" 
                            :src="`/storage/${client.primary_account_manager.avatar}`" 
                            :alt="client.primary_account_manager.name"
                            class="w-full h-full object-cover"
                          />
                          <span v-else class="text-white font-bold text-lg">
                            {{ client.primary_account_manager.name?.charAt(0)?.toUpperCase() || 'U' }}
                          </span>
                        </div>
                        <div class="flex-1">
                          <div class="text-lg font-bold text-text-primary">{{ client.primary_account_manager.name }}</div>
                          <div class="text-sm text-text-muted flex items-center space-x-1">
                            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                            </svg>
                            <span>{{ client.primary_account_manager.email }}</span>
                          </div>
                        </div>
                      </div>
                      <div v-else class="text-center py-8">
                        <div class="w-16 h-16 bg-surface rounded-2xl flex items-center justify-center mx-auto mb-3">
                          <svg class="w-8 h-8 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path>
                          </svg>
                        </div>
                        <p class="text-sm text-text-muted font-medium">No primary account manager assigned</p>
                      </div>
                    </div>

                    <!-- Secondary Account Managers -->
                    <div class="bg-surface-alt rounded-xl p-6 shadow-sm border border-border-light">
                      <div class="flex items-center mb-4">
                        <div class="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                          <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                          </svg>
                        </div>
                        <h4 class="ml-3 text-sm font-bold text-text-primary uppercase tracking-wider">Secondary Managers</h4>
                      </div>
                      
                      <div v-if="client?.secondary_account_managers && client.secondary_account_managers.length > 0" class="space-y-4">
                        <div v-for="manager in client.secondary_account_managers" :key="manager.id" class="flex items-center space-x-4 p-3 bg-surface rounded-xl hover:bg-surface-alt transition-colors">
                          <div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center overflow-hidden shadow-md">
                            <img 
                              v-if="manager.avatar" 
                              :src="`/storage/${manager.avatar}`" 
                              :alt="manager.name"
                              class="w-full h-full object-cover"
                            />
                            <span v-else class="text-white font-bold text-sm">
                              {{ manager.name?.charAt(0)?.toUpperCase() || 'U' }}
                            </span>
                          </div>
                          <div class="flex-1">
                            <div class="text-base font-semibold text-text-primary">{{ manager.name }}</div>
                            <div class="text-sm text-text-muted flex items-center space-x-1">
                              <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                              </svg>
                              <span>{{ manager.email }}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div v-else class="text-center py-8">
                        <div class="w-16 h-16 bg-surface rounded-2xl flex items-center justify-center mx-auto mb-3">
                          <svg class="w-8 h-8 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                          </svg>
                        </div>
                        <p class="text-sm text-text-muted font-medium">No secondary account managers assigned</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Client Persons Tab -->
          <div v-if="activeTab === 'persons'" class="space-y-6">
            <ClientPersonsTab 
              :client-id="client?.id" 
              :client="client"
            />
          </div>

          <!-- Sub-Clients Tab -->
          <div v-if="activeTab === 'sub-clients'" class="space-y-6">
            <SubClientsTab 
              :client-id="client?.id" 
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Edit Client Modal -->
    <ClientModal
      v-if="showEditModal"
      :key="`client-${client?.id}-${client?.updated_at || Date.now()}`"
      :show="showEditModal"
      :client="client"
      :is-edit="true"
      @close="showEditModal = false"
      @saved="handleClientSaved"
    />
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AppLayout from '@/components/layout/AppLayout.vue'
import ClientModal from '@/components/modals/ClientModal.vue'
import ClientPersonsTab from '@/components/clients/ClientPersonsTab.vue'
import SubClientsTab from '@/components/client-detail/SubClientsTab.vue'
import { clientApi } from '@/utils/api'

const route = useRoute()
const router = useRouter()

const client = ref(null)
const loading = ref(false)
const showEditModal = ref(false)
const activeTab = ref('overview')

const tabs = [
  { id: 'overview', name: 'Company Overview' },
  { id: 'persons', name: 'Client Persons' },
  { id: 'sub-clients', name: 'Sub-Clients' }
]

const loadClient = async () => {
  loading.value = true
  try {
    const response = await clientApi.getClient(route.params.id as string)
    // The backend returns the client directly, not wrapped in data
    client.value = response
  } catch (error) {
    console.error('Failed to load client:', error)
    router.push('/org-settings')
  } finally {
    loading.value = false
  }
}

const editClient = async () => {
  // Force refresh client data to ensure we have the latest information
  await loadClient()
  showEditModal.value = true
}

const handleClientSaved = async () => {
  showEditModal.value = false
  // Reload client data to reflect changes
  await loadClient()
}

const goBack = () => {
  router.push('/org-settings')
}

const handleLogoError = (event) => {
  // Hide the broken image and show the fallback
  event.target.style.display = 'none'
  const fallback = event.target.nextElementSibling
  if (fallback) {
    fallback.style.display = 'flex'
  }
}

onMounted(() => {
  loadClient()
})
</script>
