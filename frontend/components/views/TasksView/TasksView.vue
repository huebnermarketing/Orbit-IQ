<template>
  <div>
    <div class="mb-8">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold text-text-primary mb-2">Tasks</h1>
          <p class="text-text-secondary">Manage and track your tasks</p>
        </div>
        <button class="btn btn-primary">
          <i class="fas fa-plus mr-2"></i>
          New Task
        </button>
      </div>
    </div>

    <div class="card p-6">
      <div class="text-center py-12">
        <div class="w-16 h-16 bg-accent-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <i class="fas fa-tasks text-accent-600 text-2xl"></i>
        </div>
        <h3 class="text-lg font-semibold text-text-primary mb-2">No tasks yet</h3>
        <p class="text-text-secondary mb-6">Create your first task to get started</p>
        <button class="btn btn-primary">
          <i class="fas fa-plus mr-2"></i>
          Create Task
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" src="./TasksView.ts"></script>
<style scoped src="./TasksView.css"></style>