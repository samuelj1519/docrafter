import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { MarkdownContent, Tag, HistoryItem } from '@/types'

export const useEditorStore = defineStore('editor', () => {
  const currentContent = ref<MarkdownContent>({
    id: '',
    title: 'Untitled',
    content: '',
    tags: [],
    createdAt: new Date(),
    updatedAt: new Date()
  })

  const savedContents = ref<MarkdownContent[]>([])
  const allTags = ref<Tag[]>([])
  const isSplitView = ref(true)
  const isPreviewMode = ref(false)
  
  // Scroll synchronization
  const editorScrollTop = ref(0)
  const previewScrollTop = ref(0)
  const isScrollSyncing = ref(false)
  

  const history = computed((): HistoryItem[] => {
    return savedContents.value
      .map(content => ({
        id: content.id,
        title: content.title,
        previewText: content.content.slice(0, 100) + '...',
        tags: content.tags,
        date: content.updatedAt
      }))
      .sort((a, b) => b.date.getTime() - a.date.getTime())
  })

  const historyByDate = computed(() => {
    const grouped = new Map<string, HistoryItem[]>()
    history.value.forEach(item => {
      const dateKey = item.date.toDateString()
      if (!grouped.has(dateKey)) {
        grouped.set(dateKey, [])
      }
      grouped.get(dateKey)!.push(item)
    })
    return Array.from(grouped.entries()).sort((a, b) => 
      new Date(b[0]).getTime() - new Date(a[0]).getTime()
    )
  })

  const updateTitle = (title: string) => {
    currentContent.value.title = title
    currentContent.value.updatedAt = new Date()
  }

  const updateContent = (content: string) => {
    currentContent.value.content = content
    currentContent.value.updatedAt = new Date()
  }

  const addTag = (tagName: string) => {
    if (!currentContent.value.tags.includes(tagName)) {
      currentContent.value.tags.push(tagName)
      updateTagCount(tagName)
    }
  }

  const removeTag = (tagName: string) => {
    const index = currentContent.value.tags.indexOf(tagName)
    if (index > -1) {
      currentContent.value.tags.splice(index, 1)
    }
  }

  const updateTagCount = (tagName: string) => {
    const existingTag = allTags.value.find(tag => tag.name === tagName)
    if (existingTag) {
      existingTag.count++
      existingTag.lastUsed = new Date()
    } else {
      allTags.value.push({
        name: tagName,
        count: 1,
        lastUsed: new Date()
      })
    }
  }

  const saveContent = () => {
    if (!currentContent.value.id) {
      currentContent.value.id = Date.now().toString()
      currentContent.value.createdAt = new Date()
    }
    currentContent.value.updatedAt = new Date()
    
    const existingIndex = savedContents.value.findIndex(c => c.id === currentContent.value.id)
    if (existingIndex > -1) {
      savedContents.value[existingIndex] = { ...currentContent.value }
    } else {
      savedContents.value.push({ ...currentContent.value })
    }
  }

  const loadContent = (id: string) => {
    const content = savedContents.value.find(c => c.id === id)
    if (content) {
      currentContent.value = { ...content }
    }
  }

  const newContent = () => {
    currentContent.value = {
      id: '',
      title: 'Untitled',
      content: '',
      tags: [],
      createdAt: new Date(),
      updatedAt: new Date()
    }
  }

  const clearContent = () => {
    currentContent.value.content = ''
    currentContent.value.updatedAt = new Date()
  }

  const toggleSplitView = () => {
    isSplitView.value = !isSplitView.value
    if (isSplitView.value) {
      isPreviewMode.value = false
    }
  }

  const togglePreview = () => {
    isPreviewMode.value = !isPreviewMode.value
    if (isPreviewMode.value) {
      isSplitView.value = false
    }
  }

  const syncEditorScroll = (scrollPercentage: number) => {
    if (!isScrollSyncing.value) {
      // Editor scrolled, update preview scroll target
      previewScrollTop.value = scrollPercentage
    }
  }

  const syncPreviewScroll = (scrollPercentage: number) => {
    if (!isScrollSyncing.value) {
      // Preview scrolled, update editor scroll target
      editorScrollTop.value = scrollPercentage
    }
  }

  const setScrollSyncing = (value: boolean) => {
    isScrollSyncing.value = value
  }


  return {
    currentContent,
    savedContents,
    allTags,
    isSplitView,
    isPreviewMode,
    history,
    historyByDate,
    editorScrollTop,
    previewScrollTop,
    isScrollSyncing,
    updateTitle,
    updateContent,
    addTag,
    removeTag,
    saveContent,
    loadContent,
    newContent,
    clearContent,
    toggleSplitView,
    togglePreview,
    syncEditorScroll,
    syncPreviewScroll,
    setScrollSyncing
  }
})