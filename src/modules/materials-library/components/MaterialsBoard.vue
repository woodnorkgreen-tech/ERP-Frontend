<template>
  <div v-if="loading" class="flex gap-6 overflow-x-auto pb-4">
    <div v-for="n in 3" :key="n" class="min-w-[350px] bg-slate-100 dark:bg-slate-800/50 rounded-2xl p-4 animate-pulse">
       <div class="h-8 bg-slate-200 dark:bg-slate-700 rounded w-1/2 mb-4"></div>
       <div class="space-y-4">
          <div v-for="i in 3" :key="i" class="h-32 bg-white dark:bg-slate-800 rounded-2xl"></div>
       </div>
    </div>
  </div>

  <div v-else class="flex gap-6 overflow-x-auto pb-4 h-[calc(100vh-300px)] items-start">
    <div v-for="column in columns" :key="column.id" class="min-w-[350px] w-[350px] flex flex-col max-h-full">
       <!-- Column Header -->
       <div class="flex items-center justify-between mb-4 px-2">
          <div class="flex items-center gap-2">
             <div class="w-3 h-3 rounded-full" :class="column.color"></div>
             <h3 class="font-black text-slate-700 dark:text-slate-200 uppercase tracking-widest text-xs">{{ column.title }}</h3>
             <span class="bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[10px] font-bold px-2 py-0.5 rounded-full">
               {{ column.items.length }}
             </span>
          </div>
       </div>

       <!-- Cards Container -->
       <div class="bg-slate-50 dark:bg-slate-800/20 rounded-2xl p-3 flex-1 overflow-y-auto custom-scrollbar border border-slate-200/50 dark:border-slate-800/50">
          <div v-if="column.items.length === 0" class="flex flex-col items-center justify-center py-10 opacity-40">
             <i class="mdi mdi-inbox-outline text-4xl mb-2"></i>
             <p class="text-xs font-bold uppercase tracking-widest">No Items</p>
          </div>

          <div v-else class="space-y-3">
             <div 
               v-for="material in column.items" 
               :key="material.id"
               @click="$emit('view', material)"
               class="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-lg hover:border-blue-500/30 dark:hover:border-blue-500/30 transition-all cursor-pointer group relative"
             >
                <!-- Code Badge -->
                <div class="flex justify-between items-start mb-2">
                   <span class="text-[9px] font-black uppercase tracking-widest text-slate-400 bg-slate-50 dark:bg-slate-900 px-1.5 py-0.5 rounded">
                     {{ material.material_code }}
                   </span>
                   
                   <button @click.stop="$emit('edit', material)" class="opacity-0 group-hover:opacity-100 p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded transition-all">
                      <i class="mdi mdi-pencil text-slate-400 hover:text-blue-500 text-sm"></i>
                   </button>
                </div>

                <!-- Content -->
                <div class="mb-3">
                   <h4 class="font-bold text-slate-800 dark:text-gray-200 text-sm leading-snug mb-1">{{ material.material_name }}</h4>
                   <p class="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{{ material.category }}</p>
                </div>

                <!-- Stock Footer -->
                <div class="flex items-center justify-between pt-3 border-t border-slate-50 dark:border-slate-700/50">
                   <div class="flex items-center gap-2">
                      <i class="mdi mdi-cube-outline text-slate-400 text-xs"></i>
                      <span class="text-sm font-black text-slate-700 dark:text-slate-300">
                        {{ material.quantity_on_hand || 0 }} 
                        <span class="text-[10px] text-slate-400 font-bold ml-0.5">{{ material.unit_of_measure }}</span>
                      </span>
                   </div>
                   <div class="text-xs font-bold text-slate-400">
                      {{ formatCurrency((material.quantity_on_hand || 0) * (material.unit_cost || 0)) }}
                   </div>
                </div>
             </div>
          </div>
       </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = withDefaults(defineProps<{
  materials: any[];
  loading: boolean;
}>(), {});

defineEmits<{
  (e: 'view', material: any): void;
  (e: 'edit', material: any): void;
}>();

const formatCurrency = (value: number) => {
    // Compact currency for cards
    if (value >= 1000000) return 'Ksh ' + (value / 1000000).toFixed(1) + 'M';
    if (value >= 1000) return 'Ksh ' + (value / 1000).toFixed(1) + 'k';
    return 'Ksh ' + value;
};

const columns = computed(() => {
    const safe = props.materials.filter(m => {
        // If min stock is 0, it's safe if > 0. If min stock is > 0, it's safe if > min_stock
        const min = m.min_stock_level || 0;
        const qty = m.quantity_on_hand || 0;
        return qty > min;
    });

    const low = props.materials.filter(m => {
        const min = m.min_stock_level || 0;
        const qty = m.quantity_on_hand || 0;
        return qty > 0 && qty <= min;
    });

    const out = props.materials.filter(m => {
        const qty = m.quantity_on_hand || 0;
        return qty <= 0;
    });

    return [
        { id: 'safe', title: 'Healthy Stock', color: 'bg-emerald-500', items: safe },
        { id: 'low', title: 'Low Stock', color: 'bg-amber-500', items: low },
        { id: 'out', title: 'Out of Stock', color: 'bg-red-500', items: out },
    ];
});
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
  margin-top: 10px;
  margin-bottom: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(148, 163, 184, 0.3);
  border-radius: 10px;
}
</style>
