import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useNotificationStore = defineStore('notifications', () => {
    const lastError = ref<{
        title: string;
        message: string;
        severity: 'error' | 'warn' | 'info' | 'success';
        timestamp: number;
    } | null>(null)

    function notify(message: string, title: string = 'System Message', severity: 'error' | 'warn' | 'info' | 'success' = 'info') {
        lastError.value = {
            title,
            message,
            severity,
            timestamp: Date.now()
        }
    }

    function notifyGovernance(message: string) {
        notify(message, 'Governance Gate Locked', 'warn')
    }

    return {
        lastError,
        notify,
        notifyGovernance
    }
})
