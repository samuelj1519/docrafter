<template>
  <div class="main-header px-4 py-2">
    <!-- Title, Tags and Function Buttons Row -->
    <div class="flex justify-between items-center">
      <!-- Title and Tags -->
      <div class="title-and-tags-section flex items-center gap-6">
        <!-- Title -->
        <div class="title-section">
          <input
            v-if="isEditingTitle"
            v-model="tempTitle"
            @blur="saveTitle"
            @keyup.enter="saveTitle"
            @keyup.escape="cancelEditTitle"
            class="text-xl font-semibold bg-transparent border-none outline-none text-gray-800 w-full"
            ref="titleInput"
            autofocus
          />
          <h1 
            v-else
            @click="startEditTitle"
            class="text-xl font-semibold text-gray-800 cursor-pointer hover:bg-gray-50 rounded px-2 py-1 -mx-2 -my-1"
          >
            {{ store.currentContent.title }}
          </h1>
        </div>
        
        <!-- Tags -->
        <div class="tags-section">
          <div class="flex flex-wrap gap-2 items-center">
            <!-- Current Tags -->
            <div 
              v-for="tag in store.currentContent.tags" 
              :key="tag"
              class="tag relative bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm group h-7 min-w-fit flex items-center"
            >
              <span>{{ tag }}</span>
              <button 
                @click="removeTag(tag)"
                class="absolute -top-1 -right-1 w-4 h-4 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-all border-none outline-none"
              >
                ×
              </button>
            </div>
            
            <!-- Add Tag Button/Input -->
            <div class="relative">
              <!-- Add Tag Input (when editing) -->
              <input
                v-if="showAddTagInput"
                v-model="newTag"
                @keyup.enter="addNewTag"
                @keyup.escape="hideAddTagInput"
                @blur="onInputBlur"
                @input="showTagSuggestions = true"
                placeholder="Add Tag"
                class="text-sm px-3 py-1 border border-gray-200 rounded-full outline-none focus:border-blue-500 h-7 min-w-20"
                ref="tagInput"
                autofocus
              />
              
              <!-- Add Tag Button (default state) -->
              <button
                v-else
                @click="showAddTagInputField"
                class="w-7 h-7 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center text-gray-600 text-lg transition-colors border-none outline-none"
                title="Add tag"
              >
                +
              </button>
              
              <!-- Tag Suggestions -->
              <div 
                v-if="showTagSuggestions && filteredSuggestions.length > 0 && showAddTagInput"
                class="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-32 overflow-y-auto"
              >
                <div
                  v-for="suggestion in filteredSuggestions"
                  :key="suggestion.name"
                  @mousedown="selectSuggestion(suggestion.name)"
                  class="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                >
                  {{ suggestion.name }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Right Side: Function Buttons -->
      <div class="function-buttons flex gap-2">
        <!-- View Mode Toggle -->
        <div class="view-toggle bg-gray-100 rounded-lg flex">
          <button
            @click="toggleEditMode"
            :class="[
              'px-4 py-2 text-sm font-medium transition-colors rounded-l-lg border-none outline-none',
              !store.isPreviewMode && !store.isSplitView
                ? 'bg-blue-500 text-white' 
                : 'text-gray-600 hover:bg-gray-200'
            ]"
          >
            Edit
          </button>
          <button
            @click="store.toggleSplitView"
            :class="[
              'px-4 py-2 text-sm font-medium transition-colors border-none outline-none',
              store.isSplitView 
                ? 'bg-blue-500 text-white' 
                : 'text-gray-600 hover:bg-gray-200'
            ]"
          >
            Split
          </button>
          <button
            @click="store.togglePreview"
            :class="[
              'px-4 py-2 text-sm font-medium transition-colors rounded-r-lg border-none outline-none',
              store.isPreviewMode 
                ? 'bg-blue-500 text-white' 
                : 'text-gray-600 hover:bg-gray-200'
            ]"
          >
            Preview
          </button>
        </div>
        
        <button
          @click="store.saveContent()"
          class="px-4 py-2 bg-green-100 hover:bg-green-200 text-green-700 rounded-lg text-sm font-medium transition-colors border-none outline-none"
        >
          Save
        </button>
        
        <!-- More Actions Dropdown -->
        <div class="relative">
          <button
            @click="toggleDropdown"
            class="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors border-none outline-none flex items-center gap-1"
          >
            <svg class="w-4 h-4 transform transition-transform" :class="{ 'rotate-180': showDropdown }" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
          </button>
          
          <!-- Dropdown Menu -->
          <div 
            v-if="showDropdown"
            class="absolute right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-32"
          >
            <button
              @click="downloadMarkdownAndClose"
              class="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 rounded-t-lg border-none outline-none"
            >
              Download
            </button>
            <button
              @click="clearContentAndClose"
              class="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 rounded-b-lg border-none outline-none"
            >
              Clear
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick, onMounted, onUnmounted } from 'vue'
import { useEditorStore } from '@/stores/editor'

const store = useEditorStore()

// Title editing
const isEditingTitle = ref(false)
const tempTitle = ref('')
const titleInput = ref<HTMLInputElement | null>(null)

const startEditTitle = () => {
  isEditingTitle.value = true
  tempTitle.value = store.currentContent.title
  nextTick(() => {
    titleInput.value?.select()
  })
}

const saveTitle = () => {
  if (tempTitle.value.trim()) {
    store.updateTitle(tempTitle.value.trim())
  }
  isEditingTitle.value = false
}

const cancelEditTitle = () => {
  isEditingTitle.value = false
  tempTitle.value = ''
}

// Tag management
const newTag = ref('')
const showTagSuggestions = ref(false)
const showAddTagInput = ref(false)
const tagInput = ref<HTMLInputElement | null>(null)

// Dropdown menu
const showDropdown = ref(false)

const filteredSuggestions = computed(() => {
  if (!newTag.value) return []
  return store.allTags
    .filter(tag => 
      tag.name.toLowerCase().includes(newTag.value.toLowerCase()) &&
      !store.currentContent.tags.includes(tag.name)
    )
    .sort((a, b) => b.count - a.count || b.lastUsed.getTime() - a.lastUsed.getTime())
    .slice(0, 5)
})

const showAddTagInputField = () => {
  showAddTagInput.value = true
  nextTick(() => {
    tagInput.value?.focus()
  })
}

const hideAddTagInput = () => {
  showAddTagInput.value = false
  newTag.value = ''
  showTagSuggestions.value = false
}

const addNewTag = () => {
  if (newTag.value.trim()) {
    store.addTag(newTag.value.trim())
    newTag.value = ''
    showTagSuggestions.value = false
    showAddTagInput.value = false
  }
}

const selectSuggestion = (tagName: string) => {
  store.addTag(tagName)
  newTag.value = ''
  showTagSuggestions.value = false
  showAddTagInput.value = false
}

const removeTag = (tagName: string) => {
  store.removeTag(tagName)
}

const onInputBlur = () => {
  setTimeout(() => {
    if (!showTagSuggestions.value) {
      hideAddTagInput()
    }
  }, 150)
}

const toggleDropdown = () => {
  showDropdown.value = !showDropdown.value
}

// View mode functions
const toggleEditMode = () => {
  store.isSplitView = false
  store.isPreviewMode = false
}

// Function buttons
const downloadMarkdown = () => {
  const content = store.currentContent.content
  const title = store.currentContent.title || 'untitled'
  const blob = new Blob([content], { type: 'text/markdown' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${title}.md`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

const downloadMarkdownAndClose = () => {
  downloadMarkdown()
  showDropdown.value = false
}

const clearContentAndClose = () => {
  if (confirm('Are you sure you want to clear all content?')) {
    store.clearContent()
  }
  showDropdown.value = false
}


// Close dropdown when clicking outside
const handleClickOutside = (event: Event) => {
  const target = event.target as Element
  if (!target.closest('.relative')) {
    showDropdown.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>