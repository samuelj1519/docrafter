<template>
  <div class="menu-bar bg-white rounded-lg shadow-sm p-4 flex flex-col gap-4 h-full">
    <!-- Header with function buttons -->
    <div class="function-buttons flex items-center gap-2">
      <button
        @click="$emit('toggleSidebar')"
        class="toggle-btn w-6 h-6 rounded hover:bg-gray-100 flex items-center justify-center transition-colors border-none outline-none"
        title="Toggle sidebar"
      >
        <svg class="w-4 h-4 text-gray-600" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd" />
        </svg>
      </button>
      <button 
        @click="store.newContent()" 
        class="w-10 h-10 bg-blue-500 hover:bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl transition-colors border-none outline-none"
        title="Add new page"
      >
        +
      </button>
    </div>

    <!-- History List -->
    <div class="history-section flex-1 min-h-0 flex flex-col">
      <h3 class="text-sm font-semibold text-gray-700 mb-3 flex-shrink-0">History</h3>
      <div class="history-list overflow-y-auto flex-1">
        <template v-for="[date, items] in store.historyByDate.slice(0, showAllHistory ? store.historyByDate.length : 1)" :key="date">
          <div class="date-group mb-4">
            <div class="date-header text-xs text-gray-500 mb-2">{{ formatDate(date) }}</div>
            <div class="items space-y-2">
              <div 
                v-for="item in items.slice(0, showAllHistory ? items.length : 10)" 
                :key="item.id"
                @click="store.loadContent(item.id)"
                class="history-item p-2 bg-gray-50 hover:bg-gray-100 rounded-lg cursor-pointer transition-colors"
              >
                <div class="item-title text-sm font-medium text-gray-800 truncate">{{ item.title }}</div>
                <div class="item-preview text-xs text-gray-600 truncate">{{ item.previewText }}</div>
                <div class="item-tags flex gap-1 mt-1">
                  <span 
                    v-for="tag in item.tags.slice(0, 3)" 
                    :key="tag"
                    class="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded"
                  >
                    {{ tag }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </template>
        
        <button 
          v-if="!showAllHistory && store.history.length > 10"
          @click="showAllHistory = true"
          class="expand-btn w-full text-sm text-blue-600 hover:bg-blue-50 py-2 rounded-lg transition-colors border-none outline-none"
        >
          Show More ({{ store.history.length - 10 }} more)
        </button>
      </div>
    </div>

    <!-- Tag List -->
    <div class="tag-section flex-shrink-0">
      <h3 class="text-sm font-semibold text-gray-700 mb-3">Tags</h3>
      <div class="tag-list space-y-2 max-h-32 overflow-y-auto">
        <div 
          v-for="tag in sortedTags" 
          :key="tag.name"
          class="tag-item bg-gray-50 hover:bg-gray-100 px-3 py-2 rounded-lg flex justify-between items-center cursor-pointer transition-colors"
          draggable="true"
        >
          <span class="text-sm text-gray-700">{{ tag.name }}</span>
          <span class="text-xs text-gray-500">{{ tag.count }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useEditorStore } from '@/stores/editor'

defineEmits<{
  toggleSidebar: []
}>()

defineProps<{
  isVisible: boolean
}>()

const store = useEditorStore()
const showAllHistory = ref(false)

const sortedTags = computed(() => {
  return [...store.allTags].sort((a, b) => b.lastUsed.getTime() - a.lastUsed.getTime())
})

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)

  if (date.toDateString() === today.toDateString()) {
    return 'Today'
  } else if (date.toDateString() === yesterday.toDateString()) {
    return 'Yesterday'
  } else {
    return date.toLocaleDateString()
  }
}
</script>