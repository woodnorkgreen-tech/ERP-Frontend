<template>
  <div class="min-h-screen bg-slate-50 dark:bg-slate-950 p-4 md:p-8 flex items-center justify-center">
    <div class="max-w-2xl w-full bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden border border-slate-200/60 dark:border-slate-800/60">
      <!-- Header -->
      <div class="bg-blue-600 p-8 text-white">
        <div class="flex items-center justify-between gap-4">
          <div class="flex items-center gap-4">
            <div class="bg-white/10 backdrop-blur-md px-4 py-3 rounded-2xl border border-white/20 flex items-center gap-4">
              <div class="w-10 h-10 bg-white rounded-xl shadow-lg flex items-center justify-center p-2">
                <img src="/logo-outline.png" alt="WNG" class="w-full h-full object-contain" />
              </div>
              <div class="w-px h-6 bg-white/20"></div>
              <div class="flex flex-col">
                <h2 class="text-[10px] font-black uppercase tracking-[0.2em] text-white">Woodnork Green</h2>
                <p class="text-[9px] font-bold uppercase tracking-widest text-blue-100 mt-0.5">PIN: P051451468C</p>
              </div>
            </div>
            <div>
              <h1 class="text-xl font-black uppercase tracking-tight">Acknowledge Cash Distribution</h1>
              <p class="text-blue-100 text-[10px] uppercase font-black tracking-widest opacity-80 mt-0.5">
                Ref No: {{ requisition?.requisition_number || 'Petty Cash Requisition' }}
              </p>
            </div>
          </div>
          <div v-if="requisition" class="text-right hidden sm:block">
            <span class="block text-[10px] font-black uppercase tracking-widest text-blue-200">Requisition Date</span>
            <span class="text-sm font-bold">{{ formatDate(requisition.created_at) }}</span>
          </div>
        </div>
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
        <p class="text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
          The receipt of funds has been confirmed. The transaction is now complete.
        </p>
        <div class="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
          <p class="text-[10px] font-black uppercase tracking-widest text-slate-400">System Reference</p>
          <p class="text-sm font-bold text-slate-900 dark:text-white mt-1">{{ requisition.requisition_number }}</p>
        </div>
      </div>

      <!-- Content -->
      <div v-else class="p-6 md:p-8 space-y-8">
        <!-- Core Details -->
        <div class="grid grid-cols-2 sm:grid-cols-3 gap-6">
          <div>
            <span class="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1">Grand Total Issued</span>
            <span class="text-lg font-black text-blue-600 dark:text-blue-400 block tabular-nums">{{ formatCurrency(requisition.total_amount) }}</span>
          </div>
          <div>
            <span class="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1">Cost Center</span>
            <span class="text-sm font-bold text-slate-900 dark:text-white block uppercase">{{ requisition.department?.name }}</span>
          </div>
          <div>
            <span class="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1 text-xs">Expenditure Type</span>
            <span class="text-sm font-bold text-slate-900 dark:text-white block uppercase">{{ requisition.category }}</span>
          </div>
          <div v-if="requisition.project || requisition.enquiry" class="col-span-2 sm:col-span-3 bg-slate-50 dark:bg-slate-950 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
             <span class="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1 text-xs">Project / Reference</span>
             <p class="text-xs font-black text-blue-600 dark:text-blue-400 uppercase tracking-tighter">
                <template v-if="requisition.project">
                  {{ requisition.project.job_number || requisition.project.project_id }} - {{ requisition.project.enquiry?.title || requisition.project.title }}
                </template>
                <template v-else>
                  {{ requisition.enquiry.job_number || requisition.enquiry.enquiry_number }} - {{ requisition.enquiry.title }}
                </template>
             </p>
          </div>
          <div class="col-span-2 sm:col-span-3">
             <span class="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1 text-xs">Disbursement Narrative</span>
             <p class="text-sm text-slate-600 dark:text-slate-400 font-bold leading-relaxed italic uppercase">
               {{ requisition.purpose }}
             </p>
          </div>
        </div>

        <div class="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-900/30 p-4 rounded-2xl flex items-start gap-3">
          <i class="mdi mdi-information-outline text-amber-600 mt-0.5"></i>
          <p class="text-xs text-amber-800 dark:text-amber-400 font-bold leading-relaxed">
            Please verify the details above. By signing below, you acknowledge the physical receipt of the funds as itemized in this distribution.
          </p>
        </div>

        <hr class="border-slate-100 dark:border-slate-800" />
        
        <!-- Multi-Recipient Mode (Items Sign-off) -->
        <div v-if="isBulkMode" class="space-y-6">
           <div class="flex items-center justify-between">
              <h3 class="text-xs font-black uppercase tracking-widest text-slate-900 dark:text-white">Authorized Recipients</h3>
              <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                {{ signedCount }} of {{ requisition.items.length }} Signed
              </span>
           </div>

           <div class="space-y-4">
              <div v-for="item in requisition.items" :key="item.id" 
                class="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-slate-100 dark:border-slate-800 overflow-hidden relative"
                :class="{ 'opacity-60 grayscale-[0.5]': item.received_at }"
              >
                <div class="flex justify-between items-start gap-4">
                  <div class="flex-grow">
                    <span class="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest block mb-1">
                      Recipient: {{ getPayeeName(item) }}
                    </span>
                    <h4 class="text-sm font-black text-slate-900 dark:text-white">{{ item.description }}</h4>
                    <p class="text-lg font-black text-slate-900 dark:text-white mt-2">{{ formatCurrency(item.amount) }}</p>
                  </div>
                  
                  <div class="shrink-0 pt-1">
                    <div v-if="item.received_at" class="flex flex-col items-end">
                       <span class="px-3 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-black rounded-full uppercase tracking-widest">Confirmed</span>
                       <span class="text-[9px] text-slate-400 font-bold mt-1">{{ formatDate(item.received_at) }}</span>
                    </div>
                    <button v-else-if="activeItemId !== item.id" @click="setActiveItem(item.id)" 
                      class="px-5 py-2.5 bg-blue-600 text-white text-xs font-black rounded-2xl uppercase tracking-widest shadow-lg shadow-blue-500/20"
                    >
                      Sign Now
                    </button>
                    <button v-else @click="activeItemId = null" class="text-[10px] font-black text-slate-400 hover:text-slate-600 uppercase tracking-widest">
                      Cancel
                    </button>
                  </div>
                </div>

                <!-- Inline Signature Pad -->
                <div v-if="activeItemId === item.id" class="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700 space-y-6 animate-in slide-in-from-top-4 duration-300">
                  <div class="bg-white dark:bg-slate-950 p-2 rounded-2xl border-2 border-dashed border-blue-200 dark:border-blue-800">
                    <canvas
                      :ref="el => setItemCanvas(el, item.id)"
                      @mousedown="e => startItemDrawing(e, item.id)"
                      @mousemove="e => drawItem(e, item.id)"
                      @mouseup="stopDrawing"
                      @mouseleave="stopDrawing"
                      @touchstart="e => handleItemTouchStart(e, item.id)"
                      @touchmove="e => handleItemTouchMove(e, item.id)"
                      @touchend="stopDrawing"
                      class="w-full h-40 cursor-crosshair touch-none"
                    ></canvas>
                  </div>
                  
                  <div class="flex items-center gap-3">
                    <button @click="clearItemSignature(item.id)" class="px-4 py-3 text-xs font-black text-red-500 uppercase tracking-widest">Clear</button>
                    <button @click="submitItemSignature(item.id)" :disabled="submitting || itemSignatures[item.id]?.isEmpty"
                      class="flex-grow py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-blue-500/30 disabled:bg-slate-300 dark:disabled:bg-slate-800 transition-all"
                    >
                      {{ submitting ? 'Processing...' : 'Confirm Receipt' }}
                    </button>
                  </div>
                </div>
              </div>
           </div>
        </div>

        <!-- Single Recipient Mode (Core Sign-off) -->
        <div v-else class="space-y-6">
          <div class="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-3xl border border-blue-100 dark:border-blue-800/50 mb-8">
             <span class="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1 text-center">Final Amount to Receive</span>
             <h2 class="text-3xl font-black text-blue-600 dark:text-blue-400 text-center tracking-tighter">{{ formatCurrency(requisition.total_amount) }}</h2>
          </div>

          <!-- Name Input -->
          <div>
            <label class="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-2">Confirmed By (Recipient Full Name)</label>
            <input 
              v-model="signerName"
              type="text" 
              placeholder="Enter your full name" 
              class="w-full bg-slate-50 dark:bg-slate-950 border-2 border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 font-bold text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 transition-colors"
            >
          </div>

          <!-- Signature Pad -->
          <div class="space-y-2">
            <div class="flex items-center justify-between">
              <label class="text-[10px] font-black uppercase tracking-widest text-slate-400">Signature</label>
              <button @click="clearSignature" class="text-[10px] font-black uppercase tracking-widest text-red-500 hover:text-red-600">
                Clear Pad
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
            class="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 dark:disabled:bg-slate-800 text-white py-5 rounded-2xl font-black uppercase tracking-widest transition-all shadow-xl shadow-blue-500/20 flex items-center justify-center gap-2"
          >
            <span v-if="submitting">Processing...</span>
            <span v-else>Confirm Receipt of Cash</span>
            <i v-if="!submitting" class="mdi mdi-check-circle"></i>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, reactive, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import axios from '@/plugins/axios'

const route = useRoute()
const token = route.params.token as string

const requisition = ref<any>(null)
const loading = ref(true)
const submitting = ref(false)
const error = ref<string | null>(null)
const success = ref(false)

// Master Signature Pad
const signaturePad = ref<HTMLCanvasElement | null>(null)
let masterCtx: CanvasRenderingContext2D | null = null
let isDrawing = false
const isSignatureEmpty = ref(true)
const signerName = ref('')

// Multi-Recipient Pads
const activeItemId = ref<number | null>(null)
const itemCanvases = reactive<Record<number, HTMLCanvasElement | null>>({})
const itemContexts: Record<number, CanvasRenderingContext2D | null> = {}
const itemSignatures = reactive<Record<number, { isEmpty: boolean }>>({})

const isBulkMode = computed(() => {
  if (!requisition.value) return false
  return ['Travel & Subsistence', 'Entertainment & Meals'].includes(requisition.value.category) && requisition.value.items?.length > 1
})

const signedCount = computed(() => {
  if (!requisition.value?.items) return 0
  return requisition.value.items.filter((i: any) => i.received_at).length
})

const getPayeeName = (item: any) => {
  if (item.payee || item.payee_name) {
    return item.payee ? `${item.payee.first_name} ${item.payee.last_name}` : item.payee_name
  }
  return requisition.value.payee 
    ? `${requisition.value.payee.first_name} ${requisition.value.payee.last_name}`
    : (requisition.value.payee_name || requisition.value.requester?.name || 'Self')
}

const fetchRequisition = async () => {
  loading.value = true
  try {
    const response = await axios.get(`/api/public/pcr/${token}`)
    requisition.value = response.data.data
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Invalid or expired link'
  } finally {
    loading.value = false
    if (!isBulkMode.value) {
      setTimeout(initMasterCanvas, 200)
    }
  }
}

const formatDate = (date: string) => {
  if (!date) return '-'
  return new Date(date).toLocaleString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: 'KES'
  }).format(amount)
}

// Master Canvas Logic
const initMasterCanvas = () => {
  if (signaturePad.value) {
    masterCtx = initCanvas(signaturePad.value)
  }
}

const initCanvas = (canvas: HTMLCanvasElement) => {
  const ctx = canvas.getContext('2d')
  const dpr = window.devicePixelRatio || 1
  const rect = canvas.getBoundingClientRect()
  
  canvas.width = rect.width * dpr
  canvas.height = rect.height * dpr
  ctx?.scale(dpr, dpr)
  
  if (ctx) {
    ctx.lineWidth = 2
    ctx.lineCap = 'round'
    ctx.strokeStyle = '#2563eb'
  }
  return ctx
}

const startDrawing = (e: MouseEvent | Touch) => {
  isDrawing = true
  const coords = getCoords(e, signaturePad.value!)
  masterCtx?.beginPath()
  masterCtx?.moveTo(coords.x, coords.y)
  isSignatureEmpty.value = false
}

const draw = (e: MouseEvent | Touch) => {
  if (!isDrawing) return
  const coords = getCoords(e, signaturePad.value!)
  masterCtx?.lineTo(coords.x, coords.y)
  masterCtx?.stroke()
}

// Shared Utility
const getCoords = (e: MouseEvent | Touch, canvas: HTMLCanvasElement) => {
  const rect = canvas.getBoundingClientRect()
  // Handle both mouse and touch coordinates
  const clientX = 'clientX' in e ? e.clientX : (e as any).clientX
  const clientY = 'clientY' in e ? e.clientY : (e as any).clientY
  
  return {
    x: clientX - rect.left,
    y: clientY - rect.top
  }
}

const stopDrawing = () => {
  if (!isDrawing) return
  isDrawing = false
  masterCtx?.closePath()
  Object.values(itemContexts).forEach(ctx => ctx?.closePath())
}

const handleTouchStart = (e: TouchEvent) => { 
  if (e.touches.length > 1) return // Ignore multi-touch
  e.preventDefault()
  startDrawing(e.touches[0]) 
}

const handleTouchMove = (e: TouchEvent) => { 
  e.preventDefault()
  draw(e.touches[0]) 
}

const clearSignature = () => {
  if (masterCtx && signaturePad.value) {
    masterCtx.clearRect(0, 0, signaturePad.value.width, signaturePad.value.height)
    isSignatureEmpty.value = true
  }
}

// Bulk / Item Logic
const setActiveItem = async (itemId: number) => {
  activeItemId.value = itemId
  await nextTick()
  initItemCanvas(itemId)
}

const setItemCanvas = (el: any, itemId: number) => {
  if (el) itemCanvases[itemId] = el as HTMLCanvasElement
}

const initItemCanvas = (itemId: number) => {
  const canvas = itemCanvases[itemId]
  if (canvas) {
    itemContexts[itemId] = initCanvas(canvas)
    itemSignatures[itemId] = { isEmpty: true }
  }
}

const startItemDrawing = (e: MouseEvent | TouchEvent, itemId: number) => {
  isDrawing = true
  const canvas = itemCanvases[itemId]!
  const touch = e instanceof MouseEvent ? e : e.touches[0]
  const coords = getCoords(touch as any, canvas)
  const ctx = itemContexts[itemId]
  ctx?.beginPath()
  ctx?.moveTo(coords.x, coords.y)
  itemSignatures[itemId].isEmpty = false
}

const drawItem = (e: MouseEvent | TouchEvent, itemId: number) => {
  if (!isDrawing) return
  const canvas = itemCanvases[itemId]!
  const touch = e instanceof MouseEvent ? e : e.touches[0]
  const coords = getCoords(touch as any, canvas)
  const ctx = itemContexts[itemId]
  ctx?.lineTo(coords.x, coords.y)
  ctx?.stroke()
}

const handleItemTouchStart = (e: TouchEvent, itemId: number) => { e.preventDefault(); startItemDrawing(e, itemId) }
const handleItemTouchMove = (e: TouchEvent, itemId: number) => { e.preventDefault(); drawItem(e, itemId) }

const clearItemSignature = (itemId: number) => {
  const canvas = itemCanvases[itemId]
  const ctx = itemContexts[itemId]
  if (ctx && canvas) {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    itemSignatures[itemId].isEmpty = true
  }
}

// Submission
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

const submitItemSignature = async (itemId: number) => {
  const canvas = itemCanvases[itemId]
  if (!canvas || itemSignatures[itemId].isEmpty) return
  
  submitting.value = true
  try {
    const signature = canvas.toDataURL('image/png')
    const response = await axios.post(`/api/public/pcr/${token}/item/${itemId}/sign`, { signature })
    
    if (response.data.all_received) {
      success.value = true
    } else {
      // Refresh local data to show "Signed" state
      const item = requisition.value.items.find((i: any) => i.id === itemId)
      if (item) {
        item.received_at = new Date().toISOString()
      }
      activeItemId.value = null
    }
  } catch (err: any) {
    alert(err.response?.data?.message || 'Failed to sign item')
  } finally {
    submitting.value = false
  }
}

onMounted(fetchRequisition)

const handleResize = () => {
  if (!isBulkMode.value) initMasterCanvas()
  else if (activeItemId.value) initItemCanvas(activeItemId.value)
}

window.addEventListener('resize', handleResize)
onUnmounted(() => window.removeEventListener('resize', handleResize))
</script>
