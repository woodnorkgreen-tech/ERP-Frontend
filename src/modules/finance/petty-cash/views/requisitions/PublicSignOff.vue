<template>
  <div class="min-h-screen bg-slate-50 dark:bg-slate-950 p-4 md:p-8 flex items-center justify-center">
    <div class="max-w-md w-full bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden border border-slate-200/60 dark:border-slate-800/60">
      <!-- Header -->
      <div class="bg-blue-600 p-8 text-white text-center">
        <div class="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <i class="mdi mdi-cash-check text-4xl"></i>
        </div>
        <h1 class="text-2xl font-black uppercase tracking-tight">Confirm Receipt</h1>
        <p class="text-blue-100 text-sm mt-1 opacity-80">Petty Cash Disbursement Signature</p>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="p-12 text-center">
        <div class="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mx-auto"></div>
        <p class="text-slate-500 mt-4 font-bold">Verifying link...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="p-12 text-center">
        <i class="mdi mdi-alert-circle text-6xl text-red-500 opacity-20 block mb-4"></i>
        <h2 class="text-xl font-bold text-slate-900 dark:text-white mb-2">{{ error }}</h2>
        <p class="text-slate-500 text-sm">Please contact the finance department if you believe this is an error.</p>
      </div>

      <!-- Success State -->
      <div v-else-if="success" class="p-12 text-center">
        <div class="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-6">
          <i class="mdi mdi-check-bold text-5xl"></i>
        </div>
        <h2 class="text-2xl font-black text-slate-900 dark:text-white mb-2">Thank You!</h2>
        <p class="text-slate-500 dark:text-slate-400 font-medium">Your signature has been recorded and the transaction is now complete.</p>
        <div class="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
          <p class="text-[10px] font-black uppercase tracking-widest text-slate-400">System Reference</p>
          <p class="text-sm font-bold text-slate-900 dark:text-white mt-1">{{ requisition.requisition_number }}</p>
        </div>
      </div>

      <!-- Content -->
      <div v-else class="p-6 md:p-8 space-y-6">
        <div class="grid grid-cols-2 gap-4">
          <div class="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl">
            <span class="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1">Payee</span>
            <span class="text-sm font-bold text-slate-900 dark:text-white">
              {{ requisition.payee ? `${requisition.payee.first_name} ${requisition.payee.last_name}` : requisition.payee_name || 'Generic Payee' }}
            </span>
          </div>
          <div class="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl">
            <span class="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1">Amount</span>
            <span class="text-sm font-bold text-blue-600 dark:text-blue-400">
              {{ formatCurrency(requisition.total_amount) }}
            </span>
          </div>
        </div>

        <div>
          <span class="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1">Purpose</span>
          <p class="text-sm text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
            {{ requisition.purpose }}
          </p>
        </div>

        <!-- Name Input -->
        <div class="mb-4">
          <label class="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-2">Confirmed By (Full Name)</label>
          <input 
            v-model="signerName"
            type="text" 
            placeholder="Enter your full name" 
            class="w-full bg-slate-50 dark:bg-slate-950 border-2 border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 font-bold text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 transition-colors"
          >
        </div>

        <!-- Signature Pad -->
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <label class="text-[10px] font-black uppercase tracking-widest text-slate-400">Please Sign Below</label>
            <button @click="clearSignature" class="text-[10px] font-black uppercase tracking-widest text-red-500 hover:text-red-600">
              Clear
            </button>
          </div>
          <div class="relative bg-slate-50 dark:bg-slate-950 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 overflow-hidden">
            <canvas
              ref="signaturePad"
              @mousedown="startDrawing"
              @mousemove="draw"
              @mouseup="stopDrawing"
              @mouseleave="stopDrawing"
              @touchstart="handleTouchStart"
              @touchmove="handleTouchMove"
              @touchend="stopDrawing"
              class="w-full h-48 cursor-crosshair touch-none"
            ></canvas>
          </div>
        </div>

        <button
          @click="submitSignature"
          :disabled="submitting || isSignatureEmpty || !signerName.trim()"
          class="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 dark:disabled:bg-slate-800 text-white py-4 rounded-2xl font-black uppercase tracking-widest transition-all shadow-xl shadow-blue-500/20 flex items-center justify-center gap-2"
        >
          <span v-if="submitting">Processing...</span>
          <span v-else>Confirm Receipt</span>
          <i v-if="!submitting" class="mdi mdi-arrow-right"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import axios from '@/plugins/axios' // Use configured axios plugin

const route = useRoute()
const token = route.params.token as string

const requisition = ref<any>(null)
const loading = ref(true)
const submitting = ref(false)
const error = ref<string | null>(null)
const success = ref(false)

const signaturePad = ref<HTMLCanvasElement | null>(null)
let ctx: CanvasRenderingContext2D | null = null
let isDrawing = false
const isSignatureEmpty = ref(true)
const signerName = ref('')

const fetchRequisition = async () => {
  try {
    const response = await axios.get(`/api/public/pcr/${token}`)
    requisition.value = response.data.data
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Invalid or expired link'
  } finally {
    loading.value = false
    // Initialize canvas after DOM update
    setTimeout(initCanvas, 100)
  }
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: 'KES'
  }).format(amount)
}

// Signature Logic
const initCanvas = () => {
  if (signaturePad.value) {
    ctx = signaturePad.value.getContext('2d')
    const canvas = signaturePad.value
    const dpr = window.devicePixelRatio || 1
    const rect = canvas.getBoundingClientRect()
    
    canvas.width = rect.width * dpr
    canvas.height = rect.height * dpr
    ctx?.scale(dpr, dpr)
    
    if (ctx) {
      ctx.lineWidth = 2
      ctx.lineCap = 'round'
      ctx.strokeStyle = '#1e293b' // slate-800
    }
  }
}

const startDrawing = (e: MouseEvent | Touch) => {
  isDrawing = true
  const rect = signaturePad.value!.getBoundingClientRect()
  const x = ('clientX' in e ? e.clientX : (e as any).touches[0].clientX) - rect.left
  const y = ('clientY' in e ? e.clientY : (e as any).touches[0].clientY) - rect.top
  ctx?.beginPath()
  ctx?.moveTo(x, y)
  isSignatureEmpty.value = false
}

const draw = (e: MouseEvent | Touch) => {
  if (!isDrawing) return
  const rect = signaturePad.value!.getBoundingClientRect()
  const x = ('clientX' in e ? e.clientX : (e as any).touches[0].clientX) - rect.left
  const y = ('clientY' in e ? e.clientY : (e as any).touches[0].clientY) - rect.top
  ctx?.lineTo(x, y)
  ctx?.stroke()
}

const stopDrawing = () => {
  isDrawing = false
  ctx?.closePath()
}

const handleTouchStart = (e: TouchEvent) => {
  e.preventDefault()
  startDrawing(e.touches[0])
}

const handleTouchMove = (e: TouchEvent) => {
  e.preventDefault()
  draw(e.touches[0])
}

const clearSignature = () => {
  if (ctx && signaturePad.value) {
    ctx.clearRect(0, 0, signaturePad.value.width, signaturePad.value.height)
    isSignatureEmpty.value = true
  }
}

const submitSignature = async () => {
  if (!signaturePad.value || isSignatureEmpty.value) return
  
  submitting.value = true
  try {
    const signature = signaturePad.value.toDataURL('image/png')
    await axios.post(`/api/public/pcr/${token}/sign`, { 
      signature,
      received_by: signerName.value 
    })
    success.value = true
  } catch (err: any) {
    alert(err.response?.data?.message || 'Failed to submit signature')
  } finally {
    submitting.value = false
  }
}

onMounted(() => {
  fetchRequisition()
})

// Listen for resize to re-init canvas
const handleResize = () => {
  initCanvas()
}
window.addEventListener('resize', handleResize)
onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})
</script>
