<template>
  <div class="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col items-center justify-center p-6 md:p-12">
    <!-- Branding Section -->
    <div class="mb-8 text-center animate-fade-in-down">
      <div class="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl shadow-xl shadow-blue-500/20 mb-4 transform hover:scale-110 transition-transform">
        <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      </div>
      <h1 class="text-3xl font-black text-slate-900 dark:text-white tracking-tight uppercase">Let's Build Together</h1>
      <p class="mt-2 text-slate-500 dark:text-slate-400 font-medium">Tell us about your project and we'll get back to you within 24 hours.</p>
    </div>

    <!-- Success State -->
    <div v-if="submitted" class="max-w-md w-full bg-white dark:bg-slate-800 rounded-3xl shadow-2xl shadow-slate-200 dark:shadow-none p-10 text-center animate-bounce-in">
      <div class="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
        <svg class="w-10 h-10 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h2 class="text-2xl font-bold text-slate-900 dark:text-white mb-2">Message Received!</h2>
      <p class="text-slate-600 dark:text-slate-400">Thank you for reaching out. A member of our team will contact you shortly to discuss next steps.</p>
      <button 
        @click="resetForm" 
        class="mt-8 px-8 py-3 bg-slate-900 dark:bg-slate-700 text-white font-bold rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-lg shadow-black/10"
      >
        Send Another Request
      </button>
    </div>

    <!-- Form Section -->
    <div v-else class="max-w-xl w-full bg-white dark:bg-slate-800 rounded-[2.5rem] shadow-2xl shadow-slate-200 dark:shadow-none border border-slate-100 dark:border-slate-700/50 overflow-hidden animate-fade-in-up">
      <form @submit.prevent="submitLead" class="p-8 md:p-10 space-y-6">
        
        <!-- Field: Full Name -->
        <div class="space-y-1.5">
          <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name *</label>
          <div class="relative group">
            <input 
              v-model="form.full_name"
              type="text" 
              required
              placeholder="John Doe"
              class="w-full px-5 py-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700/50 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all dark:text-white"
            >
          </div>
        </div>

        <!-- Row: Email & Phone -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="space-y-1.5">
            <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Address *</label>
            <input 
              v-model="form.email"
              type="email" 
              required
              placeholder="john@example.com"
              class="w-full px-5 py-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700/50 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all dark:text-white"
            >
          </div>
          <div class="space-y-1.5">
            <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Phone Number *</label>
            <input 
              v-model="form.phone"
              type="tel" 
              required
              placeholder="+254..."
              class="w-full px-5 py-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700/50 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all dark:text-white"
            >
          </div>
        </div>

        <!-- Field: Service Interest -->
        <div class="space-y-1.5">
          <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Service Interested In *</label>
          <select 
            v-model="form.service_interest"
            required
            class="w-full px-5 py-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700/50 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all dark:text-white appearance-none"
          >
            <option value="" disabled>Select a service...</option>
            <option v-for="service in services" :key="service.id" :value="service.id">
              {{ service.name }}
            </option>
          </select>
        </div>

        <!-- Field: Description -->
        <div class="space-y-1.5">
          <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Brief Project Description</label>
          <textarea 
            v-model="form.description"
            rows="4" 
            placeholder="Tell us what you have in mind..."
            class="w-full px-5 py-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700/50 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all dark:text-white resize-none"
          ></textarea>
        </div>

        <!-- Submit Button -->
        <button 
          type="submit" 
          :disabled="loading"
          class="w-full py-5 bg-blue-600 hover:bg-blue-700 text-white font-black uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-blue-600/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center gap-3"
        >
          <div v-if="loading" class="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
          <span v-else>Submit Application</span>
        </button>
      </form>
    </div>

    <!-- Footer Security -->
    <div class="mt-8 flex items-center gap-4 text-slate-400 dark:text-slate-500 font-bold text-[10px] uppercase tracking-widest">
      <div class="flex items-center gap-1.5">
        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
        Secure Data Transmission
      </div>
      <div class="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-700"></div>
      <div>ERP Direct Integration</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from 'axios'

interface Service {
  id: number
  name: string
  description: string
}

const form = ref({
  full_name: '',
  email: '',
  phone: '',
  company_name: '',
  service_interest: '' as any,
  description: '',
  source: 'direct_link'
})

const services = ref<Service[]>([])
const loading = ref(false)
const submitted = ref(false)

const fetchServices = async () => {
  try {
    const res = await axios.get('/api/public/services')
    services.value = res.data
  } catch (err) {
    console.error('Failed to fetch services:', err)
  }
}

const submitLead = async () => {
  loading.value = true
  try {
    // Detect source from URL if present (e.g. ?source=qr_code)
    const urlParams = new URLSearchParams(window.location.search)
    if (urlParams.has('source')) {
      form.value.source = urlParams.get('source') as string
    }

    await axios.post('/api/public/leads', form.value)
    submitted.value = true
  } catch (err: any) {
    console.error('Lead submission failed:', err)
    alert(err.response?.data?.message || 'Submission failed. Please check your network and try again.')
  } finally {
    loading.value = false
  }
}

const resetForm = () => {
  form.value = {
    full_name: '',
    email: '',
    phone: '',
    company_name: '',
    service_interest: '',
    description: '',
    source: 'direct_link'
  }
  submitted.value = false
}

onMounted(() => {
  fetchServices()
})
</script>

<style scoped>
@keyframes fade-in-down {
  0% { opacity: 0; transform: translateY(-20px); }
  100% { opacity: 1; transform: translateY(0); }
}

@keyframes fade-in-up {
  0% { opacity: 0; transform: translateY(20px); }
  100% { opacity: 1; transform: translateY(0); }
}

@keyframes bounce-in {
  0% { transform: scale(0.3); opacity: 0; }
  50% { transform: scale(1.05); }
  70% { transform: scale(0.9); }
  100% { transform: scale(1); opacity: 1; }
}

.animate-fade-in-down { animation: fade-in-down 0.6s ease-out; }
.animate-fade-in-up { animation: fade-in-up 0.8s ease-out; }
.animate-bounce-in { animation: bounce-in 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
</style>
