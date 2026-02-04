import { ref, onMounted, onUnmounted } from 'vue'
import api from '@/plugins/axios'

export function useSystemRefresh() {
    const currentVersion = ref<number | null>(null)
    const checkInterval = ref<any>(null)
    const POLLING_INTERVAL = 30000 // Check every 30 seconds

    const checkVersion = async () => {
        try {
            const response = await api.get('/api/system/version')
            const serverVersion = response.data.version

            const storedVersion = localStorage.getItem('system_app_version')

            if (storedVersion && parseInt(storedVersion) !== serverVersion) {
                // Version changed!
                console.log('New system version detected. Refreshing...')
                localStorage.setItem('system_app_version', serverVersion.toString())

                // Optional: Show a toast before reloading
                // alert('System updated. Reloading...') 

                window.location.reload()
            } else if (!storedVersion) {
                // First initialization
                localStorage.setItem('system_app_version', serverVersion.toString())
            }

            currentVersion.value = serverVersion
        } catch (err) {
            console.error('Failed to check system version', err)
        }
    }

    const startPolling = () => {
        // Check immediately
        checkVersion()
        // Start interval
        checkInterval.value = setInterval(checkVersion, POLLING_INTERVAL)
    }

    const stopPolling = () => {
        if (checkInterval.value) {
            clearInterval(checkInterval.value)
        }
    }

    onMounted(() => {
        startPolling()
    })

    onUnmounted(() => {
        stopPolling()
    })

    return {
        currentVersion
    }
}
