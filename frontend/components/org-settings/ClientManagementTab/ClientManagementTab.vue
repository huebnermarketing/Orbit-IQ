<template>
  <div class="space-y-6">
    <div class="card p-6">
      <div class="flex items-center justify-between mb-6">
        <h3 class="text-lg font-semibold text-text-primary">Client Management</h3>
        <div class="flex items-center space-x-3">
          <button @click="exportClientsToExcel" class="btn-outline">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              ></path>
            </svg>
            Export Excel
          </button>
          <button @click="showCreateClientModal = true" class="btn-primary">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 4v16m8-8H4"
              ></path>
            </svg>
            Add Client
          </button>
        </div>
      </div>

      <!-- Search and Filters -->
      <div class="flex flex-col lg:flex-row gap-4 mb-6">
        <div class="flex-1">
          <input
            v-model="clientSearchQuery"
            type="text"
            placeholder="Search by company name..."
            class="input"
            @input="filterClients"
          />
        </div>
        <div class="flex flex-col sm:flex-row gap-3">
          <select v-model="clientTypeFilter" @change="filterClients" class="input w-full sm:w-40">
            <option value="">All Types</option>
            <option value="Agency">Agency</option>
            <option value="Direct Client">Direct Client</option>
          </select>
          <select v-model="clientAMFilter" @change="filterClients" class="input w-full sm:w-48">
            <option value="">All Account Managers</option>
            <option v-for="am in accountManagers" :key="am.id" :value="am.id">{{ am.name }}</option>
          </select>
          <button @click="clearClientFilters" class="btn-outline text-sm px-4 py-2">
            Clear Filters
          </button>
        </div>
      </div>

      <!-- Clients Table -->
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-border-light">
          <thead class="bg-surface-alt">
            <tr>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider"
              >
                Company
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider"
              >
                Contact
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider"
              >
                Account Managers
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider"
              >
                Type
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider"
              >
                Status
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="bg-surface divide-y divide-border-light">
            <tr v-for="client in filteredClients" :key="client.id" class="hover:bg-surface-alt">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div
                    class="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0 mr-3"
                  >
                    <img
                      v-if="client.logo_url"
                      :src="client.logo_url"
                      :alt="client.company_name"
                      class="w-full h-full object-cover"
                      @error="handleLogoError"
                    />
                    <div
                      v-else
                      class="w-full h-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center"
                    >
                      <span class="text-white font-bold text-sm">{{
                        getCompanyInitials(client.company_name)
                      }}</span>
                    </div>
                  </div>
                  <div>
                    <div class="text-sm font-medium text-text-primary">
                      {{ client.company_name }}
                    </div>
                    <div class="text-sm text-text-muted">{{ client.website || 'No website' }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div>
                  <div class="text-sm text-text-primary">{{ client.email }}</div>
                  <div class="text-sm text-text-muted">{{ client.phone || 'No phone' }}</div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div v-if="client.primary_account_manager" class="flex items-center">
                  <div
                    class="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center overflow-hidden flex-shrink-0"
                  >
                    <img
                      v-if="client.primary_account_manager.avatar"
                      :src="`/storage/${client.primary_account_manager.avatar}`"
                      :alt="client.primary_account_manager.name"
                      class="w-full h-full object-cover"
                    />
                    <span v-else class="text-white font-medium text-sm">{{
                      getInitials(client.primary_account_manager.name)
                    }}</span>
                  </div>
                  <div class="ml-3">
                    <div class="text-sm font-medium text-text-primary">
                      {{ client.primary_account_manager.name }}
                    </div>
                    <div class="text-sm text-text-muted">
                      {{ client.primary_account_manager.email }}
                    </div>
                  </div>
                </div>
                <div v-else class="text-sm text-text-muted">No primary AM assigned</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  :class="[
                    'inline-flex px-2 py-1 text-xs font-semibold rounded-full',
                    client.client_type === 'Agency'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-green-100 text-green-800',
                  ]"
                >
                  {{ client.client_type }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  :class="[
                    'inline-flex px-2 py-1 text-xs font-semibold rounded-full',
                    client.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800',
                  ]"
                >
                  {{ client.is_active ? 'Active' : 'Inactive' }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div class="flex items-center space-x-2">
                  <button
                    @click="viewClient(client)"
                    class="text-blue-600 hover:text-blue-900 p-1 rounded-md hover:bg-blue-50 transition-colors"
                    title="View client"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      ></path>
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      ></path>
                    </svg>
                  </button>
                  <button
                    @click="editClient(client)"
                    class="text-primary-600 hover:text-primary-900 p-1 rounded-md hover:bg-primary-50 transition-colors"
                    title="Edit client"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      ></path>
                    </svg>
                  </button>
                  <button
                    @click="deleteClient(client)"
                    class="text-red-600 hover:text-red-900 p-1 rounded-md hover:bg-red-50 transition-colors"
                    title="Delete client"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      ></path>
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="filteredClients.length === 0">
              <td colspan="6" class="px-6 py-4 text-center text-sm text-gray-500">
                <div v-if="clients.length === 0">
                  No clients found. Create your first client to get started.
                </div>
                <div v-else>
                  No clients match your current filters. Try adjusting your search criteria.
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>

  <!-- Create/Edit Client Modal -->
  <ClientModal
    :show="showCreateClientModal || showEditClientModal"
    :client="editingClient"
    :is-edit="showEditClientModal"
    @close="closeClientModal"
    @saved="handleClientSaved"
  />
</template>

<script lang="ts" src="./ClientManagementTab.ts"></script>

<style scoped src="./ClientManagementTab.css"></style>
