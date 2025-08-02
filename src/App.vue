<template>
  <div class="app bg-gray-100 h-screen overflow-hidden">
    <div class="flex h-full gap-4 p-4">
      <!-- Left Menu Bar -->
      <Transition name="sidebar">
        <MenuBar 
          v-if="sidebarVisible"
          class="w-80 flex-shrink-0" 
          :isVisible="sidebarVisible"
          @toggleSidebar="toggleSidebar"
        />
      </Transition>
      
      <!-- Collapsed Sidebar Toggle Button -->
      <button
        v-if="!sidebarVisible"
        @click="toggleSidebar"
        class="collapsed-toggle w-12 h-12 bg-white rounded-lg shadow-sm hover:shadow-md flex items-center justify-center transition-all border-none outline-none flex-shrink-0"
        title="Show sidebar"
      >
        <svg class="w-5 h-5 text-gray-600" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd" />
        </svg>
      </button>
      
      <!-- Main Module -->
      <MainModule class="flex-1 min-h-0" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import MenuBar from '@/components/MenuBar.vue'
import MainModule from '@/components/MainModule.vue'

const sidebarVisible = ref(true)

const toggleSidebar = () => {
  sidebarVisible.value = !sidebarVisible.value
}
</script>

<style>
* {
  box-sizing: border-box;
}

html, body {
  margin: 0;
  padding: 0;
  height: 100%;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  overflow: hidden;
}

.app {
  user-select: none;
}

/* Sidebar animation */
.sidebar-enter-active,
.sidebar-leave-active {
  transition: all 0.3s ease;
  transform-origin: left;
}

.sidebar-enter-from {
  opacity: 0;
  transform: translateX(-100%);
}

.sidebar-leave-to {
  opacity: 0;
  transform: translateX(-100%);
}

.collapsed-toggle {
  cursor: pointer;
}

.collapsed-toggle:hover {
  transform: translateX(2px);
}
</style>