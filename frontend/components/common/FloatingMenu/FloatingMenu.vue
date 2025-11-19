<template>
  <div class="floating-menu-wrapper">
    <div ref="triggerRef" @click="toggleMenu">
      <slot name="trigger" :isOpen="isOpen" />
    </div>
    <Transition name="menu">
      <div
        v-if="isOpen"
        ref="floatingRef"
        :style="floatingStyles"
        class="floating-menu fixed z-50 bg-surface border border-border-light rounded-lg shadow-lg"
        @click.stop
      >
        <slot name="content" :close="closeMenu" />
      </div>
    </Transition>
  </div>
</template>

<script lang="ts" src="./FloatingMenu.ts"></script>
<style scoped src="./FloatingMenu.css"></style>

