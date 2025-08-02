<template>
  <div class="markdown-preview h-full flex flex-col">
    <div 
      class="preview-content bg-white flex-1 overflow-y-auto"
      ref="previewRef"
      @scroll="onScroll"
    >
      <div class="pt-2 px-4 pb-10">
        <div 
          v-if="store.currentContent.content"
          v-html="renderedMarkdown" 
          class="markdown-content prose max-w-none"
        ></div>
        <div v-else class="text-gray-400 italic text-center mt-8">
          No content to preview
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch, nextTick } from 'vue'
import { marked } from 'marked'
import { useEditorStore } from '@/stores/editor'

const store = useEditorStore()

// Configure marked options
marked.setOptions({
  breaks: true,
  gfm: true
})

const previewRef = ref<HTMLDivElement | null>(null)

const renderedMarkdown = computed(() => {
  try {
    return marked(store.currentContent.content)
  } catch (error) {
    return '<p class="text-red-500">Error rendering markdown</p>'
  }
})

const onScroll = () => {
  if (!previewRef.value) return
  
  const element = previewRef.value
  const scrollPercentage = element.scrollTop / (element.scrollHeight - element.clientHeight)
  
  // Sync with editor
  store.syncPreviewScroll(scrollPercentage)
}

// Watch for external scroll updates (from editor)
watch(() => store.previewScrollTop, (scrollPercentage) => {
  if (!previewRef.value) return
  
  store.setScrollSyncing(true)
  const element = previewRef.value
  const targetScrollTop = scrollPercentage * (element.scrollHeight - element.clientHeight)
  element.scrollTop = targetScrollTop
  
  nextTick(() => {
    store.setScrollSyncing(false)
  })
})
</script>

<style>
.markdown-content {
  line-height: 1.6;
}

.markdown-content h1 {
  @apply text-2xl font-bold mb-4 mt-6 text-gray-900 border-b border-gray-200 pb-2;
}

.markdown-content h2 {
  @apply text-xl font-bold mb-3 mt-5 text-gray-900;
}

.markdown-content h3 {
  @apply text-lg font-bold mb-2 mt-4 text-gray-900;
}

.markdown-content h4,
.markdown-content h5,
.markdown-content h6 {
  @apply font-bold mb-2 mt-3 text-gray-900;
}

.markdown-content p {
  @apply mb-4 text-gray-700;
}

.markdown-content ul,
.markdown-content ol {
  @apply mb-4 pl-6;
}

.markdown-content li {
  @apply mb-1;
}

.markdown-content blockquote {
  @apply border-l-4 border-gray-300 pl-4 italic text-gray-600 mb-4;
}

.markdown-content code {
  @apply bg-gray-100 px-1 py-0.5 rounded text-sm font-mono;
}

.markdown-content pre {
  @apply bg-gray-100 p-4 rounded mb-4 overflow-x-auto;
}

.markdown-content pre code {
  @apply bg-transparent p-0;
}

.markdown-content table {
  @apply w-full border-collapse mb-4;
}

.markdown-content th,
.markdown-content td {
  @apply border border-gray-300 px-3 py-2 text-left;
}

.markdown-content th {
  @apply bg-gray-100 font-semibold;
}

.markdown-content a {
  @apply text-blue-600 hover:text-blue-800 underline;
}

.markdown-content img {
  @apply max-w-full h-auto mb-4;
}

.markdown-content hr {
  @apply border-gray-300 my-6;
}
</style>