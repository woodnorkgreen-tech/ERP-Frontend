<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden bg-gray-900 bg-opacity-50 p-4 md:inset-0 h-modal md:h-full" @click="closeModal">
    <div class="relative w-full max-w-md h-full md:h-auto" @click.stop>
      <!-- Modal content -->
      <div class="relative bg-white rounded-lg shadow dark:bg-gray-700">
        <!-- Close button -->
        <button type="button" class="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-800 dark:hover:text-white" @click="closeModal">
            <svg aria-hidden="true" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
            <span class="sr-only">Close modal</span>
        </button>

        <div class="p-6 text-left">
           <div class="flex items-center gap-3 mb-4">
             <div class="p-2 bg-red-100 rounded-full text-red-600 dark:bg-red-900 dark:text-red-300">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
             </div>
             <h3 class="text-lg font-medium leading-6 text-gray-900 dark:text-white">
              Task Locked
             </h3>
          </div>

          <p class="text-sm text-gray-500 mb-4 dark:text-gray-400">
             This task is currently assigned to another user. You can view its status but cannot make changes.
          </p>

          <div class="bg-gray-50 rounded-lg p-4 border border-gray-100 space-y-3 dark:bg-gray-600 dark:border-gray-500">
             <div>
                <span class="text-xs font-semibold text-gray-400 uppercase tracking-wider dark:text-gray-300">Task</span>
                <p class="text-gray-900 font-medium dark:text-white">{{ task.title }}</p>
             </div>
             
             <div class="flex justify-between items-center">
                <div>
                  <span class="text-xs font-semibold text-gray-400 uppercase tracking-wider dark:text-gray-300">Current Status</span>
                  <div class="mt-1">
                      <span :class="statusClass(task.status)" class="px-2 py-1 rounded text-xs font-medium capitalize">
                          {{ task.status ? task.status.replace('_', ' ') : 'Pending' }}
                      </span>
                  </div>
                </div>
                <div class="text-right">
                   <span class="text-xs font-semibold text-gray-400 uppercase tracking-wider dark:text-gray-300">Department</span>
                   <p class="text-gray-800 text-sm dark:text-gray-200">{{ task.department?.name || 'N/A' }}</p>
                </div>
             </div>

             <div class="border-t border-gray-200 pt-3 mt-3 dark:border-gray-500">
                <span class="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-2 dark:text-gray-300">Assigned To</span>
                <div class="flex items-center gap-3">
                   <div class="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm dark:bg-blue-900 dark:text-blue-300">
                      {{ getInitials(task.locked_by_user?.name || 'Unknown') }}
                   </div>
                   <div>
                      <p class="text-sm font-medium text-gray-900 dark:text-white">{{ task.locked_by_user?.name || 'Unknown User' }}</p>
                      <p class="text-xs text-gray-500 dark:text-gray-400">{{ task.locked_by_user?.email || '' }}</p>
                   </div>
                </div>
             </div>
          </div>

          <div class="mt-6 text-right">
            <button
              type="button"
              class="inline-flex justify-center rounded-md border border-transparent bg-gray-100 px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:bg-gray-500 dark:text-white dark:hover:bg-gray-600"
              @click="closeModal"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  isOpen: boolean
  task: any
}>()

const emit = defineEmits(['close'])

const closeModal = () => {
  emit('close')
}

const getInitials = (name: string) => {
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

const statusClass = (status: string) => {
  const map: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    in_progress: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    completed: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    review: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
  }
  return map[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
}
</script>
