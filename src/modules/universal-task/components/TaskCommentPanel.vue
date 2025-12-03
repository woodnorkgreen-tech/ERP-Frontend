<template>
  <div class="task-comment-panel">
    <!-- Header -->
    <div class="flex justify-between items-center mb-4">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Comments</h3>
      <button
        @click="showAddComment = true"
        class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm flex items-center gap-2"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Add Comment
      </button>
    </div>

    <!-- Add Comment Form -->
    <div v-if="showAddComment" class="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
      <textarea
        v-model="newComment"
        rows="3"
        placeholder="Write a comment..."
        class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
      ></textarea>
      <div class="flex justify-end gap-2 mt-2">
        <button
          @click="showAddComment = false; newComment = ''"
          class="px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600"
        >
          Cancel
        </button>
        <button
          @click="addComment"
          :disabled="!newComment.trim() || loading"
          class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Post Comment
        </button>
      </div>
    </div>

    <!-- Comments List -->
    <div v-if="loading" class="text-center py-8">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
      <p class="mt-4 text-gray-600 dark:text-gray-400">Loading comments...</p>
    </div>

    <div v-else-if="comments.length === 0" class="text-center py-8">
      <svg class="w-16 h-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
      <h4 class="text-lg font-medium text-gray-900 dark:text-white mb-2">No comments yet</h4>
      <p class="text-gray-600 dark:text-gray-400 mb-4">Start the conversation by adding a comment.</p>
    </div>

    <div v-else class="space-y-4">
      <div
        v-for="comment in comments"
        :key="comment.id"
        class="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
      >
        <div class="flex items-start gap-3">
          <div class="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-medium">
            {{ comment.user?.name?.charAt(0) || 'U' }}
          </div>
          <div class="flex-1">
            <div class="flex items-center gap-2 mb-1">
              <span class="font-medium text-gray-900 dark:text-white">{{ comment.user?.name || 'Unknown' }}</span>
              <span class="text-sm text-gray-500 dark:text-gray-400">{{ formatDate(comment.created_at) }}</span>
            </div>
            <p class="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{{ comment.content }}</p>
            <button
              @click="replyToComment(comment)"
              class="mt-2 text-sm text-blue-600 dark:text-blue-400 hover:underline"
            >
              Reply
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import taskApi from '../services/api'
import type { TaskComment } from '../types'

const props = defineProps<{
  taskId: number
}>()

const emit = defineEmits<{
  commentAdded: []
}>()

const comments = ref<TaskComment[]>([])
const loading = ref(false)
const showAddComment = ref(false)
const newComment = ref('')

const loadComments = async () => {
  loading.value = true
  try {
    const response = await taskApi.getTaskComments(props.taskId)
    if (response.success && response.data) {
      comments.value = response.data
    }
  } catch (error) {
    console.error('Error loading comments:', error)
  } finally {
    loading.value = false
  }
}

const addComment = async () => {
  if (!newComment.value.trim()) return

  loading.value = true
  try {
    const response = await taskApi.createComment(props.taskId, newComment.value)
    if (response.success) {
      newComment.value = ''
      showAddComment.value = false
      await loadComments()
      emit('commentAdded')
    }
  } catch (error) {
    console.error('Error adding comment:', error)
    alert('Failed to add comment')
  } finally {
    loading.value = false
  }
}

const replyToComment = (comment: TaskComment) => {
  // TODO: Implement reply functionality
  console.log('Reply to comment:', comment)
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleString()
}

onMounted(() => {
  loadComments()
})
</script>

