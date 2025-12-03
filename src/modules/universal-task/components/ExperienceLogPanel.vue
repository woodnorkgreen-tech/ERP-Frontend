<template>
  <div class="experience-log-panel">
    <!-- Header -->
    <div class="flex justify-between items-center mb-4">
      <h3 class="text-lg font-semibold text-gray-900">Experience Logs</h3>
      <button
        @click="showLogDialog = true"
        class="px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded-md flex items-center gap-2"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        Add Log
      </button>
    </div>

    <!-- Filters -->
    <div class="flex gap-4 mb-4">
      <select
        v-model="typeFilter"
        class="w-40 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
      >
        <option value="">All Types</option>
        <option v-for="option in logTypeOptions" :key="option.value" :value="option.value">
          {{ option.label }}
        </option>
      </select>
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Search logs..."
        class="w-64 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
        @input="debouncedSearch"
      />
    </div>

    <!-- Logs List -->
    <div class="space-y-3">
      <!-- Loading State -->
      <div v-if="loading" class="text-center py-8">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
        <p class="mt-4 text-gray-600">Loading experience logs...</p>
      </div>

      <!-- Empty State -->
      <div v-else-if="filteredLogs.length === 0" class="text-center py-8">
        <svg class="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C20.832 18.477 19.246 18 17.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
        <h4 class="text-lg font-medium text-gray-900 mb-2">No experience logs yet</h4>
        <p class="text-gray-600 mb-4">Share your experiences and lessons learned from working on tasks.</p>
        <button
          @click="showLogDialog = true"
          class="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-md flex items-center gap-2 mx-auto"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add First Log
        </button>
      </div>

      <!-- Experience Logs -->
      <div
        v-else
        v-for="log in filteredLogs"
        :key="log.id"
        class="bg-white rounded-lg shadow-sm border border-gray-200 cursor-pointer hover:shadow-md transition-shadow p-6"
        @click="viewLog(log)"
      >
        <div class="space-y-3">
          <!-- Header -->
          <div class="flex justify-between items-start">
            <div class="flex-1">
              <div class="flex items-center gap-2 mb-1">
                <h4 class="font-semibold text-gray-900">{{ log.title }}</h4>
                <span 
                  :class="getTagClasses(log.log_type)"
                  class="px-2 py-1 text-xs font-medium rounded-full"
                >
                  {{ getLogTypeLabel(log.log_type) }}
                </span>
                <span 
                  v-if="log.is_public"
                  class="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full"
                >
                  Public
                </span>
              </div>
              <p class="text-gray-600 text-sm line-clamp-2">{{ log.content }}</p>
            </div>
          </div>

          <!-- Tags -->
          <div v-if="log.tags && log.tags.length > 0" class="flex flex-wrap gap-1">
            <span
              v-for="tag in log.tags.slice(0, 3)"
              :key="tag"
              class="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-full"
            >
              {{ tag }}
            </span>
            <span
              v-if="log.tags.length > 3"
              class="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-full"
            >
              +{{ log.tags.length - 3 }} more
            </span>
          </div>

          <!-- Metadata -->
          <div class="flex justify-between items-center text-sm text-gray-500">
            <div class="flex items-center gap-4">
              <span>
                <svg class="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                </svg>
                {{ log.user?.name || 'Unknown' }}
              </span>
              <span>
                <svg class="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
                {{ formatDate(log.logged_at || log.created_at) }}
              </span>
            </div>
            <div class="flex gap-1">
              <button
                @click.stop="viewLog(log)"
                class="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
                title="View"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                </svg>
              </button>
              <button
                v-if="canEditLog(log)"
                @click.stop="editLog(log)"
                class="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
                title="Edit"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                </svg>
              </button>
              <button
                v-if="canEditLog(log)"
                @click.stop="confirmDelete(log)"
                class="p-2 text-gray-400 hover:text-red-600 rounded-full hover:bg-gray-100"
                title="Delete"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Log Dialog -->
    <div v-if="showLogDialog" class="fixed inset-0 z-50 overflow-y-auto" @click.self="showLogDialog = false">
      <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full" role="dialog" aria-modal="true">
          <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="sm:flex sm:items-start">
              <div class="mt-3 text-center sm:mt-0 sm:text-left w-full">
                <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">
                  {{ editingLog ? 'Edit Experience Log' : 'Add Experience Log' }}
                </h3>
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Title *</label>
                  <InputText
                    v-model="logForm.title"
                    placeholder="Brief title for your experience"
                    class="w-full"
                    :class="{ 'p-invalid': errors.title }"
                  />
                  <small v-if="errors.title" class="p-error">{{ errors.title }}</small>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Experience *</label>
                  <Textarea
                    v-model="logForm.content"
                    placeholder="Describe your experience, lessons learned, challenges faced, and solutions found..."
                    class="w-full"
                    rows="6"
                    :class="{ 'p-invalid': errors.content }"
                  />
                  <small v-if="errors.content" class="p-error">{{ errors.content }}</small>
                </div>

                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Type</label>
                    <Dropdown
                      v-model="logForm.log_type"
                      :options="logTypeOptions"
                      placeholder="Select log type"
                      class="w-full"
                    />
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Visibility</label>
                    <SelectButton
                      v-model="logForm.is_public"
                      :options="visibilityOptions"
                      option-label="label"
                      option-value="value"
                      class="w-full"
                    />
                  </div>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Tags</label>
                  <Chips
                    v-model="logForm.tags"
                    placeholder="Add tags (press Enter)"
                    class="w-full"
                    :max="10"
                  />
                  <small class="text-gray-500">Add relevant tags to help others find your experience</small>
                </div>
              </div>

              <div class="flex justify-end gap-3 mt-6 pt-4 border-t">
                <Button
                  label="Cancel"
                  icon="pi pi-times"
                  text
                  @click="cancelLogDialog"
                />
                <Button
                  :label="editingLog ? 'Update Log' : 'Save Log'"
                  icon="pi pi-check"
                  @click="saveLog"
                  :loading="savingLog"
                  class="bg-purple-600 hover:bg-purple-700"
                />
              </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Log Detail Dialog -->
    <Dialog
      v-model:visible="showLogDetailDialog"
      header="Experience Log Details"
      modal
      style="width: 800px"
    >
      <div v-if="selectedLog" class="space-y-6">
        <!-- Log Header -->
        <div class="border-b pb-4">
          <div class="flex justify-between items-start mb-3">
            <h3 class="text-xl font-semibold text-gray-900">{{ selectedLog.title }}</h3>
            <div class="flex gap-2">
              <Tag
                :value="getLogTypeLabel(selectedLog.log_type)"
                :severity="getLogTypeSeverity(selectedLog.log_type)"
              />
              <Tag
                v-if="selectedLog.is_public"
                value="Public"
                severity="success"
              />
            </div>
          </div>
          <div class="text-gray-600 whitespace-pre-wrap">{{ selectedLog.content }}</div>
        </div>

        <!-- Tags -->
        <div v-if="selectedLog.tags && selectedLog.tags.length > 0">
          <h4 class="font-medium text-gray-900 mb-2">Tags</h4>
          <div class="flex flex-wrap gap-2">
            <Tag
              v-for="tag in selectedLog.tags"
              :key="tag"
              :value="tag"
              class="bg-blue-100 text-blue-800"
            />
          </div>
        </div>

        <!-- Metadata -->
        <div class="grid grid-cols-2 gap-4 text-sm border-t pt-4">
          <div>
            <span class="font-medium text-gray-700">Author:</span>
            {{ selectedLog.user?.name || 'Unknown' }}
          </div>
          <div>
            <span class="font-medium text-gray-700">Logged on:</span>
            {{ formatDate(selectedLog.logged_at || selectedLog.created_at) }}
          </div>
          <div>
            <span class="font-medium text-gray-700">Type:</span>
            {{ getLogTypeLabel(selectedLog.log_type) }}
          </div>
          <div>
            <span class="font-medium text-gray-700">Visibility:</span>
            {{ selectedLog.is_public ? 'Public' : 'Private' }}
          </div>
        </div>
      </div>
    </Dialog>

    <!-- Delete Confirmation -->
    <ConfirmDialog />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useToast } from '../composables/useToast'

// Components removed - using custom Tailwind implementations

// Types
interface ExperienceLog {
  id: number
  task_id?: number
  user_id: number
  title: string
  content: string
  log_type: string
  tags?: string[]
  is_public: boolean
  logged_at?: string
  created_at: string
  updated_at: string
  user?: {
    id: number
    name: string
    email: string
  }
}

// Props
interface Props {
  taskId?: number
}

const props = defineProps<Props>()

// Composables
const toast = useToast()

// Reactive state
const logs = ref<ExperienceLog[]>([])
const loading = ref(false)
const showLogDialog = ref(false)
const showLogDetailDialog = ref(false)
const editingLog = ref<ExperienceLog | null>(null)
const selectedLog = ref<ExperienceLog | null>(null)
const savingLog = ref(false)
const typeFilter = ref('')
const searchQuery = ref('')

const logForm = ref({
  title: '',
  content: '',
  log_type: 'lesson_learned',
  tags: [] as string[],
  is_public: true
})

const errors = ref<Record<string, string>>({})

// Mock data
const logTypeOptions = ref([
  { label: 'Lesson Learned', value: 'lesson_learned' },
  { label: 'Challenge Faced', value: 'challenge' },
  { label: 'Solution Found', value: 'solution' },
  { label: 'Best Practice', value: 'best_practice' },
  { label: 'Mistake Made', value: 'mistake' },
  { label: 'Success Story', value: 'success' },
  { label: 'Improvement Idea', value: 'improvement' },
  { label: 'Other', value: 'other' }
])

const visibilityOptions = ref([
  { label: 'Public', value: true },
  { label: 'Private', value: false }
])

// Computed
const filteredLogs = computed(() => {
  let filtered = logs.value

  if (typeFilter.value) {
    filtered = filtered.filter(log => log.log_type === typeFilter.value)
  }

  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(log =>
      log.title.toLowerCase().includes(query) ||
      log.content.toLowerCase().includes(query) ||
      log.tags?.some(tag => tag.toLowerCase().includes(query))
    )
  }

  return filtered
})

// Methods
const debouncedSearch = (() => {
  let timeout: number
  return () => {
    clearTimeout(timeout)
    timeout = setTimeout(() => {
      // Search is reactive, no need to do anything here
    }, 300)
  }
})()

async function loadLogs() {
  loading.value = true
  try {
    // Mock data - in real app this would call the API
    logs.value = [
      {
        id: 1,
        task_id: props.taskId,
        user_id: 1,
        title: 'JWT Implementation Challenge',
        content: 'Implementing JWT authentication was challenging due to token expiration handling. The key lesson was to implement proper refresh token logic and handle token validation on both client and server side. Also, remember to clear tokens on logout.',
        log_type: 'lesson_learned',
        tags: ['authentication', 'jwt', 'security', 'tokens'],
        is_public: true,
        logged_at: '2024-01-15T14:00:00Z',
        created_at: '2024-01-15T14:00:00Z',
        updated_at: '2024-01-15T14:00:00Z',
        user: { id: 1, name: 'John Doe', email: 'john@example.com' }
      },
      {
        id: 2,
        task_id: props.taskId,
        user_id: 2,
        title: 'Mobile CSS Debugging Tips',
        content: 'When debugging mobile responsiveness issues, always test on actual devices, not just browser dev tools. Use CSS Grid instead of Flexbox for complex layouts. Remember to handle different screen densities and touch interactions.',
        log_type: 'best_practice',
        tags: ['mobile', 'css', 'responsive', 'debugging'],
        is_public: true,
        logged_at: '2024-01-12T10:30:00Z',
        created_at: '2024-01-12T10:30:00Z',
        updated_at: '2024-01-12T10:30:00Z',
        user: { id: 2, name: 'Jane Smith', email: 'jane@example.com' }
      },
      {
        id: 3,
        task_id: props.taskId,
        user_id: 1,
        title: 'Database Query Optimization Mistake',
        content: 'Made the mistake of not using database indexes on frequently queried columns. This caused slow performance with only 1000 records. Always analyze query patterns and add appropriate indexes during development.',
        log_type: 'mistake',
        tags: ['database', 'performance', 'indexes', 'optimization'],
        is_public: false,
        logged_at: '2024-01-10T16:45:00Z',
        created_at: '2024-01-10T16:45:00Z',
        updated_at: '2024-01-10T16:45:00Z',
        user: { id: 1, name: 'John Doe', email: 'john@example.com' }
      }
    ]
  } catch (error: any) {
    toast.error('Failed to load experience logs')
  } finally {
    loading.value = false
  }
}

function getLogTypeLabel(type: string): string {
  const option = logTypeOptions.value.find(opt => opt.value === type)
  return option?.label || type
}

function getLogTypeSeverity(type: string): 'success' | 'info' | 'warning' | 'danger' {
  const severityMap: Record<string, 'success' | 'info' | 'warning' | 'danger'> = {
    lesson_learned: 'info',
    challenge: 'warning',
    solution: 'success',
    best_practice: 'success',
    mistake: 'danger',
    success: 'success',
    improvement: 'info',
    other: 'info'
  }
  return severityMap[type] || 'info'
}

function getTagClasses(type: string): string {
  const classMap: Record<string, string> = {
    lesson_learned: 'bg-blue-100 text-blue-800',
    challenge: 'bg-orange-100 text-orange-800',
    solution: 'bg-green-100 text-green-800',
    best_practice: 'bg-green-100 text-green-800',
    mistake: 'bg-red-100 text-red-800',
    success: 'bg-green-100 text-green-800',
    improvement: 'bg-blue-100 text-blue-800',
    other: 'bg-gray-100 text-gray-800'
  }
  return classMap[type] || 'bg-gray-100 text-gray-800'
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString()
}

function canEditLog(log: ExperienceLog): boolean {
  // In real app, check if current user is the author or has admin permissions
  return log.user_id === 1 // Mock: current user ID
}

function viewLog(log: ExperienceLog) {
  selectedLog.value = log
  showLogDetailDialog.value = true
}

function editLog(log: ExperienceLog) {
  editingLog.value = log
  logForm.value = {
    title: log.title,
    content: log.content,
    log_type: log.log_type,
    tags: log.tags || [],
    is_public: log.is_public
  }
  showLogDialog.value = true
  showLogDetailDialog.value = false
}

function confirmDelete(log: ExperienceLog) {
  if (confirm(`Are you sure you want to delete "${log.title}"?`)) {
    try {
      // Mock delete - in real app call API
      logs.value = logs.value.filter(l => l.id !== log.id)
      toast.success('Experience log deleted successfully')
    } catch (error: any) {
      toast.error('Failed to delete experience log')
    }
  }
}

async function saveLog() {
  if (!validateLogForm()) {
    return
  }

  savingLog.value = true

  try {
    if (editingLog.value) {
      // Update existing log
      console.log('Updating log:', editingLog.value.id, logForm.value)
    } else {
      // Create new log
      console.log('Creating log:', logForm.value)
    }

    showLogDialog.value = false
    resetLogForm()

    toast.success(`Experience log ${editingLog.value ? 'updated' : 'saved'} successfully`)

    await loadLogs() // Refresh list
  } catch (error: any) {
    toast.error(`Failed to ${editingLog.value ? 'update' : 'save'} experience log`)
  } finally {
    savingLog.value = false
  }
}

function validateLogForm(): boolean {
  errors.value = {}

  if (!logForm.value.title?.trim()) {
    errors.value.title = 'Title is required'
  }

  if (!logForm.value.content?.trim()) {
    errors.value.content = 'Content is required'
  }

  return Object.keys(errors.value).length === 0
}

function resetLogForm() {
  logForm.value = {
    title: '',
    content: '',
    log_type: 'lesson_learned',
    tags: [],
    is_public: true
  }
  errors.value = {}
  editingLog.value = null
}

function cancelLogDialog() {
  showLogDialog.value = false
  resetLogForm()
}

// Lifecycle
onMounted(() => {
  loadLogs()
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>