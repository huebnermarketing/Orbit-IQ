<template>
  <!-- Team Members Card -->
  <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
    <!-- Header -->
    <div class="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-violet-50 to-purple-50">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-3">
          <div class="w-8 h-8 bg-violet-100 rounded-lg flex items-center justify-center">
            <UsersIcon class="text-violet-600" :size="'medium'" />
          </div>
          <div>
            <h3 class="text-lg font-semibold text-gray-900">Team Members</h3>
            <p class="text-sm text-gray-500">Groups and individual team members</p>
          </div>
        </div>
        <!-- Edit Mode Action Buttons -->
        <div v-if="isEditingTeamMembers" class="flex items-center space-x-2">
          <button type="button" @click="discardTeamMembersChanges" class="btn-outline">
            Discard
          </button>
          <button
            type="button"
            @click="saveTeamMembers"
            :disabled="savingTeamMembers"
            class="btn-primary"
          >
            <div
              v-if="savingTeamMembers"
              class="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-1 inline-block"
            ></div>
            Save
          </button>
        </div>
        <!-- View Mode Edit Button -->
        <button
          v-else
          @click="enableEditing"
          v-tooltip="'edit'"
          :disabled="loadingTeamMembers"
          class="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <div
            v-if="loadingTeamMembers"
            class="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-700"
          ></div>
          <i v-else class="fas fa-edit w-5 h-5"></i>
        </button>
      </div>
    </div>

    <!-- Content -->
    <div class="p-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Group Teams -->
        <div class="bg-gray-50 rounded-lg p-3 border border-gray-100">
          <label class="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">
            Group Teams
          </label>
          <BaseMultiSelect
            v-if="isEditingTeamMembers"
            v-model="editingTeamMembers.teams"
            :options="teamOptions"
            placeholder="Select group teams..."
            size="sm"
            @change="updateInternalTeamFromGroupsAndTeams"
          />
          <div v-else class="flex flex-wrap gap-1">
            <span
              v-for="team in selectedTeams"
              :key="team.id"
              class="base-multiselect-tag inline-flex items-center px-2 py-0.5 text-xs rounded-full flex-shrink-0 my-0.5 max-w-full"
            >
              {{ team.name }}
            </span>
            <span v-if="selectedTeams.length === 0" class="text-sm text-gray-500">-</span>
          </div>
        </div>

        <!-- Individual Members -->
        <div class="bg-gray-50 rounded-lg p-3 border border-gray-100">
          <label class="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">
            Individual Members
          </label>
          <BaseMultiSelect
            v-if="isEditingTeamMembers"
            v-model="editingTeamMembers.internal_team"
            :options="internalUserOptions"
            placeholder="Select individual members..."
            size="sm"
          />
          <div v-else class="flex flex-wrap gap-1">
            <span
              v-for="member in selectedMembers"
              :key="member.id"
              class="base-multiselect-tag inline-flex items-center px-2 py-0.5 text-xs rounded-full flex-shrink-0 my-0.5 max-w-full"
            >
              {{ member.name }}
            </span>
            <span v-if="selectedMembers.length === 0" class="text-sm text-gray-500">-</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" src="./TeamMembers.ts"></script>
<style scoped src="./TeamMembers.css"></style>
