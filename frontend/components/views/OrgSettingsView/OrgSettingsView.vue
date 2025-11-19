<template>
  <div class="w-full space-y-8">
    <!-- Header -->
    <div class="card p-6">
      <h1 class="text-3xl font-bold text-text-primary">Organization Settings</h1>
      <p class="text-text-secondary mt-2">
        Manage your organization's users, settings, and configurations
      </p>
    </div>

    <!-- Settings Tabs -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
      <!-- Navigation -->
      <div class="lg:col-span-2">
        <nav class="space-y-2">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            @click="saveActiveTab(tab.id)"
            :class="[
              'w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors',
              activeTab === tab.id
                ? 'bg-primary-50 text-primary-600 border-r-2 border-primary-500'
                : 'text-text-secondary hover:bg-surface-alt hover:text-text-primary',
            ]"
          >
            <i :class="tab.icon" class="w-5 h-5 mr-3"></i>
            {{ tab.name }}
          </button>
        </nav>
      </div>

      <!-- Content -->
      <div class="lg:col-span-10">
        <!-- Company Profile Tab -->
        <CompanyProfileTab v-if="activeTab === 'org-profile'" />

        <!-- User Management Tab -->
        <UserManagementTab v-if="activeTab === 'users'" />

        <!-- Organization Roles Tab -->
        <OrganizationRolesTab v-if="activeTab === 'org-roles'" />

        <!-- Teams Tab -->
        <TeamsTab v-if="activeTab === 'teams'" />

        <!-- User Groups Tab -->
        <UserGroupsTab v-if="activeTab === 'user-groups'" />

        <!-- Client Management Tab -->
        <ClientManagementTab v-if="activeTab === 'clients'" />

        <!-- Project Status Tab -->
        <ProjectStatusTab v-if="activeTab === 'project-status'" />

        <!-- Task Status Tab -->
        <TaskStatusTab v-if="activeTab === 'task-status'" />

        <!-- Project Types Tab -->
        <ProjectTypesTab v-if="activeTab === 'project-types'" />

        <!-- Global Notifications Tab -->
        <GlobalNotificationsTab v-if="activeTab === 'notifications'" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" src="./OrgSettingsView.ts"></script>
<style scoped src="./OrgSettingsView.css"></style>
