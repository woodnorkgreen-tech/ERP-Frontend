import './assets/main.css'
import 'primeicons/primeicons.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import { provideTheme, ThemeKey } from './composables/useTheme'
import './plugins/axios'
import primevue from './plugins/primevue'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(primevue)

app.provide(ThemeKey, provideTheme())

app.mount('#app')
