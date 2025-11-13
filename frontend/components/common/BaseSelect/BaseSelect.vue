<template>
  <div class="w-full" :class="wrapperClass" ref="wrapperRef">
    <div class="relative w-full" :class="{ 'opacity-60 cursor-not-allowed': disabled }">
      <button
        :id="id"
        type="button"
        :disabled="disabled"
        :class="[selectClass, disabled ? 'bg-surface-alt cursor-not-allowed opacity-60' : '']"
        @click="toggleDropdown"
        @blur="handleBlur"
        @focus="handleFocus"
        @keydown="handleKeydown"
      >
        <span class="flex-1 text-left truncate">
          <span v-if="displayValue === placeholder" class="text-text-placeholder">
            {{ displayValue }}
          </span>
          <span v-else>{{ displayValue }}</span>
        </span>
        <div class="base-select-chevron" :class="{ 'rotate-180': isOpen }">
          <i class="fas fa-chevron-down"></i>
        </div>
      </button>
      <Transition name="dropdown">
        <div
          v-if="isOpen"
          class="absolute z-50 w-full mt-1 bg-surface border border-border-light rounded-lg shadow-lg max-h-60 flex flex-col top-full"
        >
          <div
            v-if="searchable"
            class="relative flex items-center px-3 py-2 border-b border-border-light"
          >
            <div class="absolute left-3 text-text-muted pointer-events-none">
              <i class="fas fa-search"></i>
            </div>
            <input
              ref="searchInputRef"
              v-model="searchQuery"
              type="text"
              class="w-full pl-9 pr-8 py-2 text-sm bg-surface border-0 outline-none text-text-primary placeholder-text-placeholder focus:outline-none"
              placeholder="Search..."
              @click.stop
              @keydown.stop
            />
            <button
              v-if="searchQuery"
              type="button"
              class="absolute right-3 text-text-muted hover:text-text-primary transition-colors duration-150 p-1"
              @click.stop="clearSearch"
            >
              <i class="fas fa-times"></i>
            </button>
          </div>
          <div class="base-select-dropdown-inner py-1 overflow-auto">
            <div
              v-if="searchable && searchQuery && filteredOptions.length === 0"
              class="px-4 py-3 text-sm text-text-muted text-center"
            >
              No results found
            </div>
            <button
              v-if="placeholder && (!searchable || !searchQuery)"
              type="button"
              class="w-full px-4 py-2 text-left text-sm text-text-primary hover:bg-surface-alt transition-colors duration-150 focus:outline-none focus:bg-surface-alt"
              :class="{ 'bg-surface-alt font-medium': modelValue === '' }"
              @click="selectOption('')"
            >
              {{ placeholder }}
            </button>
            <button
              v-for="option in filteredOptions"
              :key="getOptionValue(option)"
              type="button"
              class="base-select-option"
              :class="{
                'bg-surface-alt font-medium': getOptionValue(option) === modelValue,
              }"
              :disabled="isOptionDisabled(option)"
              @click="selectOption(getOptionValue(option))"
            >
              {{ getOptionLabel(option) }}
            </button>
          </div>
        </div>
      </Transition>
    </div>
    <p v-if="errorMessage" class="mt-1.5 text-sm text-error-500">{{ errorMessage }}</p>
    <p v-if="hint && !errorMessage" class="mt-1.5 text-sm text-text-muted">{{ hint }}</p>
  </div>
</template>

<script lang="ts" src="./BaseSelect.ts"></script>
<style scoped src="./BaseSelect.css"></style>
