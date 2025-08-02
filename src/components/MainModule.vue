<template>
  <div class="main-module flex flex-col gap-4 flex-1 h-full">
    <!-- Header Module -->
    <div class="header-module bg-white rounded-lg shadow-sm flex-shrink-0">
      <MainHeader />
    </div>
    
    <!-- Editor and Preview Modules -->
    <div class="content-modules flex-1 flex gap-4 min-h-0">
      <!-- Editor Module -->
      <div 
        v-if="!store.isPreviewMode"
        :class="[
          'editor-module bg-white rounded-lg shadow-sm overflow-hidden',
          store.isSplitView ? 'flex-1' : 'w-full'
        ]"
      >
        <MarkdownEditor />
      </div>
      
      <!-- Preview Module -->
      <div 
        v-if="store.isSplitView || store.isPreviewMode"
        :class="[
          'preview-module bg-white rounded-lg shadow-sm overflow-hidden',
          store.isSplitView ? 'flex-1' : 'w-full'
        ]"
      >
        <MarkdownPreview />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useEditorStore } from '@/stores/editor'
import MainHeader from '@/components/MainHeader.vue'
import MarkdownEditor from '@/components/MarkdownEditor.vue'
import MarkdownPreview from '@/components/MarkdownPreview.vue'

const store = useEditorStore()
</script>