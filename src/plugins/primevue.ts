import PrimeVue from 'primevue/config'
import ConfirmationService from 'primevue/confirmationservice'
import ToastService from 'primevue/toastservice'
import DialogService from 'primevue/dialogservice'

export default {
  install(app: any) {
    app.use(PrimeVue, {
      ripple: true,
      inputStyle: 'outlined',
      theme: {
        preset: 'aura',
        options: {
          prefix: 'p',
          darkModeSelector: '.dark',
          cssLayer: false
        }
      }
    })

    // Register PrimeVue services
    app.use(ConfirmationService)
    app.use(ToastService)
    app.use(DialogService)
  }
}