<template>
  <!-- Financial Info Card -->
  <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
    <!-- Header -->
    <div class="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-emerald-50 to-teal-50">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-3">
          <div class="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
            <i class="fas fa-dollar-sign text-emerald-600 text-lg"></i>
          </div>
          <div>
            <h3 class="text-lg font-semibold text-gray-900">Financial Info</h3>
            <p class="text-sm text-gray-500">Budget and funding details</p>
          </div>
        </div>
        <div class="flex items-center space-x-2">
          <!-- Edit Mode Action Buttons -->
          <div v-if="isEditingFinancialInfo" class="flex items-center space-x-2">
            <button type="button" @click="discardFinancialInfoChanges" class="btn-outline">
              Discard
            </button>
            <button
              type="button"
              @click="saveFinancialInfo"
              :disabled="savingFinancialInfo"
              class="btn-primary"
            >
              <div
                v-if="savingFinancialInfo"
                class="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-1 inline-block"
              ></div>
              Save
            </button>
          </div>
          <!-- View Mode Buttons -->
          <template v-else>
            <button
              @click="enableEditing"
              v-tooltip="'edit'"
              :disabled="loadingFinancialInfo"
              class="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div
                v-if="loadingFinancialInfo"
                class="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-700"
              ></div>
              <i v-else class="fas fa-edit w-5 h-5"></i>
            </button>
            <button
              @click="toggleSection"
              class="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <i
                class="fa-solid fa-angle-down"
                :style="{ transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }"
              ></i>
            </button>
          </template>
        </div>
      </div>
    </div>

    <!-- Content -->
    <transition name="slide-fade">
      <div v-show="isExpanded" class="p-6">
        <div class="grid grid-cols-2 gap-6">
          <!-- Project Hour Type -->
          <div class="bg-gray-50 rounded-lg p-3 border border-gray-100">
            <label class="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2"
              >Project Hour Type</label
            >
            <BaseSelect
              v-if="isEditingFinancialInfo"
              v-model="editingFinancialInfo.hour_type"
              :options="hourTypeOptions"
              placeholder="Select Hour Type"
              size="sm"
              wrapper-class="bg-white"
            />
            <p v-else class="text-sm font-medium text-gray-900 capitalize">
              {{ project?.hour_type || 'Billable' }}
            </p>
          </div>

          <!-- Funding Source -->
          <div class="bg-gray-50 rounded-lg p-3 border border-gray-100">
            <label class="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2"
              >Funding Source</label
            >
            <BaseSelect
              v-if="isEditingFinancialInfo"
              v-model="editingFinancialInfo.funding_source"
              :options="fundingSourceOptions"
              placeholder="Select Funding Source"
              size="sm"
              wrapper-class="bg-white"
            />
            <p v-else class="text-sm font-medium text-gray-900 capitalize">
              {{ project?.funding_source || '-' }}
            </p>
          </div>

          <!-- Project Type -->
          <div class="bg-gray-50 rounded-lg p-3 border border-gray-100">
            <label class="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2"
              >Project Type</label
            >
            <BaseSelect
              v-if="isEditingFinancialInfo"
              v-model="editingFinancialInfo.project_type_id"
              :options="projectTypeOptions"
              placeholder="Select Project Type"
              size="sm"
              wrapper-class="bg-white"
            />
            <div v-else>
              <span
                v-if="project?.project_type"
                :style="{ backgroundColor: project.project_type.color, color: 'white' }"
                class="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold shadow-sm"
              >
                {{ project.project_type.name }}
              </span>
              <span v-else class="text-xs text-gray-500">-</span>
            </div>
          </div>

          <!-- Estimate -->
          <div class="bg-gray-50 rounded-lg p-3 border border-gray-100">
            <label class="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2"
              >Estimate</label
            >
            <input
              v-if="isEditingFinancialInfo"
              v-model="editingFinancialInfo.budget"
              type="text"
              class="w-full text-sm font-medium bg-white border border-gray-300 rounded px-2 py-1 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500"
              placeholder="Enter estimate"
            />
            <p v-else class="text-sm text-blue-600 underline cursor-pointer hover:text-blue-700">
              {{ project?.budget || '-' }}
            </p>
          </div>

          <!-- Bucket Code -->
          <div class="bg-gray-50 rounded-lg p-3 border border-gray-100">
            <label class="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2"
              >Bucket Code</label
            >
            <input
              v-if="isEditingFinancialInfo"
              v-model="editingFinancialInfo.job_code"
              type="text"
              class="w-full text-sm font-medium bg-white border border-gray-300 rounded px-2 py-1 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500"
              placeholder="Enter bucket code"
            />
            <p v-else class="text-sm font-medium text-gray-900">
              {{
                project?.job_code ||
                (project?.client?.company_name || 'Client') +
                  ' ' +
                  (project?.project_type?.name || 'Project') +
                  ' Agreement'
              }}
            </p>
          </div>

          <!-- Invoice Number -->
          <div class="bg-gray-50 rounded-lg p-3 border border-gray-100">
            <label class="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2"
              >Invoice Number</label
            >
            <input
              v-if="isEditingFinancialInfo"
              v-model="editingFinancialInfo.invoice_number"
              type="text"
              class="w-full text-sm font-medium bg-white border border-gray-300 rounded px-2 py-1 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500"
              placeholder="Enter invoice number"
            />
            <p v-else class="text-sm text-blue-600 underline cursor-pointer hover:text-blue-700">
              {{ project?.invoice_number || 'Invoice Number' }}
            </p>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script lang="ts" src="./FinancialInfo.ts"></script>
<style scoped src="./FinancialInfo.css"></style>
