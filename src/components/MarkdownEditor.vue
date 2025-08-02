<template>
  <div class="markdown-editor flex flex-col h-full">
    <div class="editor-content flex-1 relative overflow-hidden">
      <textarea
        v-model="store.currentContent.content"
        @input="onContentChange"
        @scroll="onScroll"
        placeholder="Start writing your markdown here..."
        class="w-full h-full p-4 resize-none border-none outline-none bg-white text-gray-700"
        spellcheck="false"
        ref="textareaRef"
      ></textarea>
    </div>
    
    <!-- Status bar -->
    <div class="status-bar p-2 bg-gray-50 border-t border-gray-200 text-xs text-gray-500 flex justify-between flex-shrink-0">
      <span>Lines: {{ lineCount }}</span>
      <span>Characters: {{ characterCount }}</span>
      <span>Words: {{ wordCount }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch, nextTick } from 'vue'
import { useEditorStore } from '@/stores/editor'

const store = useEditorStore()

const lineCount = computed(() => {
  return store.currentContent.content.split('\n').length
})

const characterCount = computed(() => {
  return store.currentContent.content.length
})

const wordCount = computed(() => {
  return store.currentContent.content.trim().split(/\s+/).filter((word: string) => word.length > 0).length
})

const textareaRef = ref<HTMLTextAreaElement | null>(null)

const onContentChange = () => {
  store.currentContent.updatedAt = new Date()
}

const onScroll = () => {
  if (!textareaRef.value) return
  
  const element = textareaRef.value
  const scrollPercentage = element.scrollTop / (element.scrollHeight - element.clientHeight)
  
  // Sync with preview
  store.syncEditorScroll(scrollPercentage)
}

// Watch for external scroll updates (from preview)
watch(() => store.editorScrollTop, (scrollPercentage) => {
  if (!textareaRef.value) return
  
  store.setScrollSyncing(true)
  const element = textareaRef.value
  const targetScrollTop = scrollPercentage * (element.scrollHeight - element.clientHeight)
  element.scrollTop = targetScrollTop
  
  nextTick(() => {
    store.setScrollSyncing(false)
  })
})
</script>

<style scoped>
.editor-content {
  position: relative;
  contain: layout style;
}

textarea {
  tab-size: 2;
  font-family: system-ui, -apple-system, sans-serif;
  font-size: 16px;
  line-height: 1.6;
}

textarea:focus {
  outline: none;
}
</style>