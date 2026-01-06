<template>
  <div v-if="isOpen" class="fixed inset-0 flex items-center justify-center z-[100] p-4 sm:p-6 font-poppins">
    <!-- Glass Backdrop -->
    <div class="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" @click="closeModal"></div>

    <!-- Modal Container -->
    <div class="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-7xl max-h-[92vh] flex flex-col relative z-10 border border-white/20 dark:border-gray-800 overflow-hidden animate-in fade-in zoom-in duration-200">
      
      <!-- Premium Header -->
      <div class="px-8 py-6 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between bg-gradient-to-r from-white to-gray-50 dark:from-gray-900 dark:to-gray-800/50">
        <div>
          <h3 class="text-xl font-bold text-gray-900 dark:text-white flex items-center">
            <span class="p-2 bg-blue-500/10 rounded-lg mr-3 shadow-inner">
              <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
              </svg>
            </span>
            {{ isEditMode ? 'Modify Element Details' : 'Design New Project Element' }}
          </h3>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-1 ml-11">Configure element specifications and bill of materials</p>
        </div>
        <button
          @click="closeModal"
          class="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-all duration-200"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>

      <!-- Modal Body -->
      <div class="p-8 overflow-y-auto custom-scrollbar flex-grow">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          <!-- Left Column: Element Info -->
          <div class="lg:col-span-3 space-y-6">
            <div class="bg-gray-50 dark:bg-gray-800/40 p-5 rounded-xl border border-gray-100 dark:border-gray-800">
              <h4 class="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-4">Core Specifications</h4>
              
              <!-- Element Type -->
              <div class="mb-5">
                <div class="flex items-center justify-between mb-2">
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Type <span class="text-red-500">*</span></label>
                  <button
                    @click="showAddElementTypeModal = true"
                    type="button"
                    class="text-[10px] bg-blue-500/10 text-blue-600 hover:bg-blue-500 hover:text-white px-2 py-0.5 rounded transition-all font-semibold uppercase tracking-tighter"
                  >
                    + Custom Type
                  </button>
                </div>
                <div class="relative" ref="typeSuggestionsTarget">
                  <input
                    v-model="typeSearchQuery"
                    type="text"
                    @focus="showTypeSuggestions = true"
                    @input="onTypeInput"
                    placeholder="Search or type element type..."
                    class="w-full pl-3 pr-10 py-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all dark:text-white text-sm shadow-sm"
                    :class="{ 'border-red-500 text-red-600': errors.elementType }"
                  />
                  
                  <!-- Suggestions Dropdown -->
                  <div v-if="showTypeSuggestions && filteredTypes.length > 0" 
                       class="absolute left-0 right-0 mt-2 bg-white dark:bg-gray-800 border-0 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.2)] dark:shadow-[0_10px_40px_rgba(0,0,0,0.5)] z-[100] max-h-60 overflow-y-auto ring-1 ring-black/5 animate-in slide-in-from-top-2 duration-200">
                    <ul class="py-2">
                       <li v-for="type in filteredTypes" :key="type.id"
                           @click="selectTypeSuggestion(type)"
                           class="px-4 py-2 hover:bg-blue-50 dark:hover:bg-blue-600/10 cursor-pointer text-sm text-gray-700 dark:text-gray-200 flex items-center justify-between"
                       >
                         <span>{{ type.display_name }}</span>
                         <span class="text-[10px] bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded text-gray-400 font-bold uppercase">{{ type.category }}</span>
                       </li>
                    </ul>
                  </div>

                  <button
                    v-if="elementForm.elementType && isCustomType(elementForm.elementType)"
                    @click.stop="confirmDeleteElementType(elementForm.elementType)"
                    type="button"
                    class="absolute -right-2 -top-2 bg-red-500 text-white rounded-full p-1 shadow-lg hover:scale-110 active:scale-95 transition-all z-10"
                  >
                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>
                  </button>
                </div>
                <p v-if="errors.elementType" class="mt-1.5 text-xs text-red-500 font-medium">{{ errors.elementType }}</p>
              </div>

              <!-- Element Category -->
              <div class="mb-5">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Inventory Category <span class="text-red-500">*</span></label>
                <div class="grid grid-cols-1 gap-2">
                  <label 
                    v-for="cat in [
                      { id: 'production', label: 'In-House Production', desc: 'Materials built from scratch' },
                      { id: 'hire', label: 'Company Asset (Hire)', desc: 'Pre-built stock items' },
                      { id: 'outsourced', label: 'Outsourced Service', desc: 'Third-party procurement' }
                    ]" 
                    :key="cat.id"
                    class="relative flex items-start p-3 rounded-lg border cursor-pointer transition-all transition-duration-200"
                    :class="elementForm.category === cat.id 
                      ? 'bg-blue-50/50 dark:bg-blue-500/5 border-blue-200 dark:border-blue-500/30' 
                      : 'bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800 hover:border-blue-200'"
                  >
                    <input type="radio" v-model="elementForm.category" :value="cat.id" class="sr-only" />
                    <div class="flex flex-col">
                      <span class="text-xs font-bold" :class="elementForm.category === cat.id ? 'text-blue-700 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'">{{ cat.label }}</span>
                      <span class="text-[10px] text-gray-500 dark:text-gray-500">{{ cat.desc }}</span>
                    </div>
                    <div v-if="elementForm.category === cat.id" class="ml-auto">
                      <svg class="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"/></svg>
                    </div>
                  </label>
                </div>
                <p v-if="errors.category" class="mt-1.5 text-xs text-red-500 font-medium">{{ errors.category }}</p>
              </div>

              <!-- Dimensions -->
              <div class="pt-2">
                <label class="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Dimensions (mm)</label>
                <div class="grid grid-cols-3 gap-2">
                  <div v-for="dim in ['length', 'width', 'height']" :key="dim" class="relative group">
                    <input
                      v-model="elementForm.dimensions[dim]"
                      type="number"
                      class="w-full pl-3 pr-4 py-2 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-lg text-xs focus:ring-1 focus:ring-blue-500 outline-none dark:text-white"
                      :placeholder="dim.charAt(0).toUpperCase()"
                    />
                    <span class="absolute right-2 top-1/2 -translate-y-1/2 text-[9px] font-bold text-gray-300 group-hover:text-blue-400 uppercase">{{ dim.charAt(0) }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Description Box -->
            <div class="mt-6">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Technical Notes</label>
              <textarea
                v-model="elementForm.description"
                rows="3"
                placeholder="Include specific construction details or element requirements..."
                class="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 outline-none transition-all dark:text-white"
              ></textarea>
            </div>
          </div>

          <!-- Right Column: Materials List -->
          <div class="lg:col-span-9 flex flex-col h-full">
            <div class="flex items-center justify-between mb-4">
              <div class="flex items-center space-x-2">
                <h4 class="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-tight">Bill of Materials</h4>
                <span class="px-2 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 text-[10px] rounded-full font-bold">
                  {{ elementForm.materials.length }} items
                </span>
              </div>
              <button
                @click="addMaterial"
                class="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-full transition-all shadow-md shadow-blue-500/20 flex items-center space-x-1.5 active:scale-95"
              >
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 4v16m8-8H4" stroke-width="2.5" stroke-linecap="round"/></svg>
                <span>Add Record</span>
              </button>
            </div>

            <!-- Advanced Table Container -->
            <!-- CRITICAL FIX: Removed overflow-hidden from the outer container to allow dropdowns to escape -->
            <div class="relative bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl shadow-sm h-full">
              <div class="overflow-visible min-w-full"> <!-- overflow-visible is key here -->
                <table class="w-full border-separate border-spacing-0">
                  <thead>
                    <tr class="bg-gray-50/50 dark:bg-gray-800/50">
                      <th class="px-5 py-3 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100 dark:border-gray-800 rounded-tl-2xl">Description / Particulars</th>
                      <th class="px-5 py-3 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100 dark:border-gray-800">Unit</th>
                      <th class="px-5 py-3 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100 dark:border-gray-800">Qty</th>
                      <th class="px-5 py-3 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100 dark:border-gray-800">Cost</th>
                      <th class="px-5 py-3 text-center text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100 dark:border-gray-800">Default</th>
                      <th class="px-5 py-3 text-center text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100 dark:border-gray-800 rounded-tr-2xl"></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(material, index) in elementForm.materials" :key="material.tempId" class="group hover:bg-gray-50/40 dark:hover:bg-gray-800/30 transition-all duration-150">
                      
                      <!-- Particulars -->
                      <td class="px-4 py-4 border-b border-gray-50 dark:border-gray-800 relative overflow-visible">
                        <div class="relative">
                          <input
                            v-model="material.description"
                            type="text"
                            placeholder="Search library or type custom..."
                            class="w-full px-3 py-2 bg-transparent border border-gray-200/50 dark:border-gray-700/50 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 outline-none dark:text-white group-hover:bg-white dark:group-hover:bg-gray-900 transition-all shadow-sm"
                            :class="{ 'border-red-400 bg-red-50/10': errors[`materials.${index}.description`] }"
                            @input="searchLibraryMaterials(material.description, index)"
                          />
                          
                          <!-- Suggestions Dropdown -->
                          <div v-if="activeSearchIndex === index && (searchResults.length > 0 || isSearching)" 
                               class="absolute left-0 right-0 mt-2 bg-white dark:bg-gray-800 border-0 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.2)] dark:shadow-[0_10px_40px_rgba(0,0,0,0.5)] z-[100] max-h-64 overflow-y-auto min-w-[320px] transition-all transform animate-in slide-in-from-top-2 duration-200 ring-1 ring-black/5">
                            
                            <!-- Search Status -->
                            <div v-if="isSearching" class="p-4 flex items-center justify-center text-gray-400">
                              <div class="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mr-3"></div>
                              <span class="text-xs font-semibold uppercase tracking-tight">Querying Materials...</span>
                            </div>

                            <!-- No Results State -->
                            <div v-else-if="searchResults.length === 0" class="p-6 text-center">
                              <div class="text-gray-300 dark:text-gray-600 mb-2">
                                <svg class="w-10 h-10 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9.172 9.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke-width="1.5"/></svg>
                              </div>
                              <p class="text-xs text-gray-500 font-medium">No matches in library</p>
                              <p class="text-[10px] text-gray-400 mt-1 italic">Continue typing to use as a custom name</p>
                            </div>

                            <!-- Result List -->
                            <ul v-else class="py-2">
                              <li v-for="suggestion in searchResults" :key="suggestion.id"
                                  @click="selectMaterialSuggestion(suggestion, index)"
                                  class="px-4 py-3 hover:bg-blue-50 dark:hover:bg-blue-600/10 cursor-pointer border-b border-gray-50 dark:border-gray-700/50 last:border-0 group/item flex items-center space-x-3 transition-colors"
                              >
                                <div class="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-700 group-hover/item:bg-blue-100 dark:group-hover/item:bg-blue-500/20 flex items-center justify-center text-gray-400 group-hover/item:text-blue-600 transition-colors">
                                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                                </div>
                                <div class="flex flex-col flex-grow">
                                  <div class="flex items-center justify-between">
                                    <span class="text-sm font-bold text-gray-800 dark:text-gray-100 truncate group-hover/item:text-blue-600 dark:group-hover/item:text-blue-400">
                                      {{ suggestion.material_name }}
                                    </span>
                                    <span v-if="suggestion.unit_cost != null" class="text-xs font-bold text-amber-600 dark:text-amber-400">
                                      KSh {{ parseFloat(suggestion.unit_cost.toString()).toFixed(2) }}
                                    </span>
                                  </div>
                                  <div class="flex items-center space-x-2 mt-0.5 text-[9px] font-bold uppercase tracking-tight">
                                    <span v-if="suggestion.material_code" class="text-gray-400 bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded">{{ suggestion.material_code }}</span>
                                    <span class="text-blue-500">{{ suggestion.category }}</span>
                                    <span class="text-gray-300 dark:text-gray-600">•</span>
                                    <span class="text-emerald-600">{{ suggestion.unit_of_measure }}</span>
                                  </div>
                                </div>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </td>

                      <!-- Unit -->
                      <td class="px-4 py-4 border-b border-gray-50 dark:border-gray-800">
                        <select
                          v-model="material.unitOfMeasurement"
                          class="bg-transparent border-0 text-sm font-medium focus:ring-0 w-full dark:text-white"
                          :class="{ 'text-red-500 font-bold underline': errors[`materials.${index}.unit`] }"
                        >
                          <option value="">Select Unit</option>
                          <option v-for="u in ['Pcs', 'Ltrs', 'Mtrs', 'sqm', 'Kgs', 'Sets', 'Rolls', 'Boxes', 'Cans', 'Bags', 'Packets', 'Cartons']" :key="u" :value="u">{{ u }}</option>
                        </select>
                      </td>

                      <!-- Quantity -->
                      <td class="px-4 py-4 border-b border-gray-50 dark:border-gray-800">
                        <input
                          v-model.number="material.defaultQuantity"
                          type="number"
                          min="1"
                          class="w-16 bg-transparent border-0 text-sm font-bold focus:ring-0 dark:text-white"
                        />
                      </td>

                      <!-- Cost -->
                      <td class="px-4 py-4 border-b border-gray-50 dark:border-gray-800">
                        <span class="text-xs font-bold" :class="material.unitCost != null ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400'">
                          {{ material.unitCost != null ? `KSh ${parseFloat(material.unitCost.toString()).toFixed(2)}` : '-' }}
                        </span>
                      </td>

                      <!-- Default Included Toggle -->
                      <td class="px-4 py-4 border-b border-gray-50 dark:border-gray-800 text-center">
                        <button 
                          @click="material.isDefaultIncluded = !material.isDefaultIncluded"
                          class="p-1 rounded-full transition-all"
                          :class="material.isDefaultIncluded ? 'text-emerald-500 bg-emerald-500/10' : 'text-gray-300 dark:text-gray-600 bg-gray-100 dark:bg-gray-800'"
                        >
                          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"/></svg>
                        </button>
                      </td>

                      <!-- Actions -->
                      <td class="px-4 py-4 border-b border-gray-50 dark:border-gray-800 text-center">
                        <button
                          @click="removeMaterial(index)"
                          class="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-all active:scale-95"
                        >
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" stroke-width="2"/></svg>
                        </button>
                      </td>
                    </tr>
                    
                    <!-- Empty State -->
                    <tr v-if="elementForm.materials.length === 0">
                      <td colspan="5" class="px-6 py-12 text-center">
                        <div class="text-gray-200 dark:text-gray-700 mb-3 text-center">
                          <svg class="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" stroke-width="1.5"/></svg>
                        </div>
                        <p class="text-sm text-gray-400 font-medium">Your Bill of Materials is currently empty.</p>
                        <button @click="addMaterial" class="mt-4 text-xs text-blue-600 font-bold underline">Add your first material record</button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Action Footer -->
      <div class="px-8 py-6 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/30 flex items-center justify-between">
        <button
          @click="closeModal"
          class="px-6 py-3 text-sm font-bold text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white transition-colors"
        >
          Discard Changes
        </button>
        <div class="flex items-center space-x-3">
          <button
            @click="saveElement"
            class="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl transition-all shadow-xl shadow-blue-500/25 active:scale-95 flex items-center space-x-2"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>
            <span>{{ isEditMode ? 'Update Element' : 'Finalize Element' }}</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Nested Modals (Element Type Creator) -->
    <div v-if="showAddElementTypeModal" class="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px]" @click="closeAddElementTypeModal"></div>
      <div class="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md p-8 relative z-10 border border-white/20">
        <h4 class="text-lg font-bold mb-6 text-gray-900 dark:text-white text-center">Create Element Type</h4>
        <div class="space-y-4">
          <div>
            <label class="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Display Name</label>
            <input v-model="newElementType.name" type="text" class="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border-0 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/50 transition-all dark:text-white" placeholder="e.g., Luxury Booth" />
            <p v-if="newElementTypeErrors.name" class="text-[10px] text-red-500 mt-1 font-bold italic text-center">{{ newElementTypeErrors.name }}</p>
          </div>
          <div>
            <label class="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Technical Category</label>
            <select v-model="newElementType.category" class="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border-0 rounded-xl outline-none dark:text-white">
              <option value="">Select Category</option>
              <option value="structure">Structure</option>
              <option value="decoration">Decoration</option>
              <option value="flooring">Flooring</option>
              <option value="technical">Technical</option>
              <option value="furniture">Furniture</option>
              <option value="branding">Branding</option>
              <option value="custom">Custom</option>
            </select>
          </div>
        </div>
        <div class="mt-8 flex space-x-3">
          <button @click="closeAddElementTypeModal" class="flex-1 py-3 text-xs font-bold text-gray-400 hover:text-gray-600 transition-colors">Cancel</button>
          <button @click="saveNewElementType" class="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-lg shadow-blue-500/20 active:scale-95 transition-all">Create Type</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch, onMounted } from 'vue'
import { onClickOutside } from '@vueuse/core'
import api from '@/plugins/axios'
import { useElementTypes, type ElementType as APIElementType } from '@/composables/useElementTypes'

/**
 * Material item structure (matching the main component)
 */
interface MaterialItem {
  id: string
  libraryMaterialId?: number | null
  description: string
  unitOfMeasurement: string
  quantity: number
  unitCost?: number | null
  isIncluded: boolean
  notes?: string
  createdAt: Date
  updatedAt: Date
}

/**
 * Project element structure (matching the main component)
 */
interface ProjectElement {
  id: string
  templateId: string
  elementType: string
  name: string
  category: 'production' | 'hire' | 'outsourced'
  dimensions: {
    length: string
    width: string
    height: string
    [key: string]: string
  }
  isIncluded: boolean
  materials: MaterialItem[]
  notes?: string
  addedAt: Date
}

/**
 * Props interface for the MaterialsModal component
 */
interface Props {
  /** Whether the modal is open */
  isOpen: boolean
  /** Element data for editing (optional) */
  editElement?: ProjectElement | null
}

/**
 * Events emitted by the MaterialsModal component
 */
interface Emits {
  /** Emitted when modal should be closed */
  'close': []
  /** Emitted when a new element is added */
  'add-element': [element: ProjectElement]
  /** Emitted when an existing element is updated */
  'update-element': [element: ProjectElement]
}

/**
 * Material form structure for the modal
 */
interface MaterialForm {
  tempId: string
  libraryMaterialId?: number | null
  description: string
  unitOfMeasurement: string
  defaultQuantity: number
  unitCost?: number | null
  isDefaultIncluded: boolean
}

/**
 * Element form structure for the modal
 */
interface ElementForm {
  category: 'production' | 'hire' | 'outsourced' | ''
  elementType: string
  dimensions: {
    length: string
    width: string
    height: string
    [key: string]: string
  }
  description: string
  materials: MaterialForm[]
}

// Component setup
const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// Use element types composable
const {
  elementTypes: apiElementTypes,
  isLoading: elementTypesLoading,
  error: elementTypesError,
  fetchElementTypes,
  createElementType,
  deleteElementType
} = useElementTypes()

// Load element types on mount
onMounted(async () => {
  try {
    await fetchElementTypes()
  } catch (error) {
    console.error('Failed to load element types:', error)
  }
})

// Form state
const elementForm = reactive<ElementForm>({
  category: '',
  elementType: '',
  dimensions: {
    length: '',
    width: '',
    height: ''
  },
  description: '',
  materials: []
})

// Modal state for adding new element types
const showAddElementTypeModal = ref(false)

// New element type form
const newElementType = reactive({
  name: '',
  category: ''
})

// Validation errors
const errors = reactive<Record<string, string>>({})
const newElementTypeErrors = reactive<Record<string, string>>({})

// Type Search Logic
const showTypeSuggestions = ref(false)
const typeSearchQuery = ref('')
const typeSuggestionsTarget = ref<HTMLElement | null>(null)

onClickOutside(typeSuggestionsTarget, () => {
  showTypeSuggestions.value = false
})

const filteredTypes = computed(() => {
  if (!typeSearchQuery.value) return apiElementTypes.value
  const query = typeSearchQuery.value.toLowerCase()
  return apiElementTypes.value.filter(t => 
    t.display_name.toLowerCase().includes(query) || 
    t.name.toLowerCase().includes(query)
  )
})

const onTypeInput = () => {
  showTypeSuggestions.value = true
  // Sync raw value. If it's a known type, the watch will trigger later when selected.
  elementForm.elementType = typeSearchQuery.value
}

const selectTypeSuggestion = (type: any) => {
  elementForm.elementType = type.name
  typeSearchQuery.value = type.display_name
  showTypeSuggestions.value = false
}

// Computed properties
const isEditMode = computed(() => !!props.editElement)

const isFormValid = computed(() => {
  return elementForm.elementType.trim() !== '' && 
         elementForm.category !== '' &&
         elementForm.materials.length > 0 &&
         elementForm.materials.every(m => 
           m.description.trim() !== '' && 
           m.unitOfMeasurement !== '' && 
           m.defaultQuantity > 0
         )
})

const isNewElementTypeValid = computed(() => {
  return newElementType.name.trim() !== '' && newElementType.category !== ''
})

/**
 * Initialize form with default material
 */
const initializeForm = () => {
  elementForm.category = ''
  elementForm.elementType = ''
  typeSearchQuery.value = ''
  elementForm.dimensions = { length: '', width: '', height: '' }
  elementForm.description = ''
  elementForm.materials = [createEmptyMaterial()]
  clearErrors()
}

/**
 * Create an empty material form object
 */
const createEmptyMaterial = (): MaterialForm => ({
  tempId: `temp-${Date.now()}-${Math.random()}`,
  libraryMaterialId: null,
  description: '',
  unitOfMeasurement: '',
  defaultQuantity: 1,
  unitCost: null,
  isDefaultIncluded: true
})

/**
 * Add a new material to the form
 */
const addMaterial = () => {
  elementForm.materials.push(createEmptyMaterial())
}

/**
 * Remove a material from the form
 */
const removeMaterial = (index: number) => {
  if (elementForm.materials.length > 1) {
    elementForm.materials.splice(index, 1)
  }
}

/**
 * Validate the form and return validation status
 */
const validateForm = (): boolean => {
  clearErrors()
  let isValid = true

  // Validate element category
  if (!elementForm.category) {
    errors.category = 'Element category is required'
    isValid = false
  }

  // Validate element type
  if (!elementForm.elementType) {
    errors.elementType = 'Element type is required'
    isValid = false
  }

  // Validate materials
  elementForm.materials.forEach((material, index) => {
    if (!material.description.trim()) {
      errors[`materials.${index}.description`] = 'Particulars is required'
      isValid = false
    }
    
    if (!material.unitOfMeasurement) {
      errors[`materials.${index}.unit`] = 'Unit is required'
      isValid = false
    }
    
    if (!material.defaultQuantity || material.defaultQuantity <= 0) {
      errors[`materials.${index}.quantity`] = 'Quantity must be greater than 0'
      isValid = false
    }
  })

  return isValid
}

/**
 * Clear all validation errors
 */
const clearErrors = () => {
  Object.keys(errors).forEach(key => delete errors[key])
}

// Material Library Search Logic
const isSearching = ref(false)
const searchResults = ref<any[]>([])
const activeSearchIndex = ref<number | null>(null)
let searchTimeout: any = null

const searchLibraryMaterials = (query: string, index: number) => {
  if (searchTimeout) clearTimeout(searchTimeout)
  
  if (query.length < 2) {
    searchResults.value = []
    activeSearchIndex.value = null
    return
  }

  searchTimeout = setTimeout(async () => {
    isSearching.value = true
    activeSearchIndex.value = index
    try {
      const response = await api.get('/api/materials-library/materials', {
        params: { search: query, per_page: 10 }
      })
      // The API returns paginated data or simple data depending on params
      searchResults.value = response.data.data || response.data
    } catch (error) {
      console.error('Search failed:', error)
    } finally {
      isSearching.value = false
    }
  }, 300)
}

const selectMaterialSuggestion = (suggestion: any, index: number) => {
  const material = elementForm.materials[index]
  material.libraryMaterialId = suggestion.id
  material.description = suggestion.material_name
  
  // Set unit cost from suggestion (handle both name formats)
  const cost = suggestion.unit_cost ?? suggestion.unitCost
  material.unitCost = cost != null ? parseFloat(cost) : null
  
  // Try to match unit (case insensitive)
  const availableUnits = ['Pcs', 'Ltrs', 'Mtrs', 'sqm', 'Kgs', 'Sets', 'Rolls', 'Boxes', 'Cans', 'Bags', 'Packets', 'Cartons']
  const matchedUnit = availableUnits.find(u => u.toLowerCase() === (suggestion.unit_of_measure || suggestion.unitOfMeasure || '').toLowerCase())
  if (matchedUnit) {
    material.unitOfMeasurement = matchedUnit
  } else if (suggestion.unit_of_measure || suggestion.unitOfMeasure) {
    material.unitOfMeasurement = suggestion.unit_of_measure || suggestion.unitOfMeasure
  }

  // Clear search
  searchResults.value = []
  activeSearchIndex.value = null
}

/**
 * Save the element (add or update)
 */
const saveElement = () => {
  if (!validateForm()) {
    return
  }

  const now = new Date()
  
  if (isEditMode.value && props.editElement) {
    // Update existing element
    const selectedType = apiElementTypes.value.find(type => type.name === elementForm.elementType)
    const updatedElement: ProjectElement = {
      ...props.editElement,
      elementType: elementForm.elementType,
      name: selectedType?.display_name || elementForm.elementType,
      category: elementForm.category as 'production' | 'hire' | 'outsourced',
      dimensions: { ...elementForm.dimensions },
      materials: elementForm.materials.map(material => ({
        id: material.tempId.startsWith('edit-') ? material.tempId.replace('edit-', '') : `${material.tempId}-${now.getTime()}`,
        libraryMaterialId: material.libraryMaterialId || null,
        description: material.description,
        unitOfMeasurement: material.unitOfMeasurement,
        quantity: material.defaultQuantity,
        unitCost: material.unitCost ?? null,
        isIncluded: material.isDefaultIncluded,
        createdAt: now,
        updatedAt: now
      }))
    }
    
    emit('update-element', updatedElement)
  } else {
    // Create new element
    const selectedType = apiElementTypes.value.find(type => type.name === elementForm.elementType)
    const newElement: ProjectElement = {
      id: `custom-${now.getTime()}`,
      templateId: `custom-${elementForm.elementType}`,
      elementType: elementForm.elementType,
      name: selectedType?.display_name || elementForm.elementType,
      category: elementForm.category as 'production' | 'hire' | 'outsourced',
      dimensions: { ...elementForm.dimensions },
      isIncluded: true,
      materials: elementForm.materials.map(material => ({
        id: `${material.tempId}-${now.getTime()}`,
        libraryMaterialId: material.libraryMaterialId || null,
        description: material.description,
        unitOfMeasurement: material.unitOfMeasurement,
        quantity: material.defaultQuantity,
        unitCost: material.unitCost ?? null,
        isIncluded: material.isDefaultIncluded,
        createdAt: now,
        updatedAt: now
      })),
      notes: elementForm.description,
      addedAt: now
    }
    
    emit('add-element', newElement)
  }
  
  closeModal()
}

/**
 * Close the modal and reset form
 */
const closeModal = () => {
  emit('close')
  initializeForm()
}

/**
 * Load element data for editing
 */
const loadElementForEdit = (element: ProjectElement) => {
  elementForm.category = element.category || 'production'
  elementForm.elementType = element.elementType || ''
  
  // Find display name for search query
  const type = apiElementTypes.value.find(t => t.name === element.elementType)
  typeSearchQuery.value = type?.display_name || element.elementType || ''
  
  elementForm.dimensions = element.dimensions || { length: '', width: '', height: '' }
  elementForm.description = element.notes || ''
  elementForm.materials = element.materials.map(material => ({
    tempId: `edit-${material.id}`,
    libraryMaterialId: material.libraryMaterialId || null,
    description: material.description,
    unitOfMeasurement: material.unitOfMeasurement,
    defaultQuantity: material.quantity,
    unitCost: material.unitCost != null ? parseFloat(material.unitCost.toString()) : null,
    isDefaultIncluded: material.isIncluded
  }))
}

/**
 * Close the add element type modal and reset form
 */
const closeAddElementTypeModal = () => {
  showAddElementTypeModal.value = false
  newElementType.name = ''
  newElementType.category = ''
  Object.keys(newElementTypeErrors).forEach(key => delete newElementTypeErrors[key])
}

/**
 * Validate new element type form
 */
const validateNewElementType = (): boolean => {
  Object.keys(newElementTypeErrors).forEach(key => delete newElementTypeErrors[key])
  let isValid = true

  if (!newElementType.name.trim()) {
    newElementTypeErrors.name = 'Type name is required'
    isValid = false
  }

  if (!newElementType.category) {
    newElementTypeErrors.category = 'Category is required'
    isValid = false
  }

  // Check if type already exists
  const existingType = apiElementTypes.value.find(type => 
    type.name.toLowerCase() === newElementType.name.toLowerCase().replace(/\s+/g, '-')
  )
  if (existingType) {
    newElementTypeErrors.name = 'This element type already exists'
    isValid = false
  }

  return isValid
}

/**
 * Save new element type to backend
 */
const saveNewElementType = async () => {
  if (!validateNewElementType()) {
    return
  }

  try {
    // Create element type via API
    const slugName = newElementType.name.toLowerCase().replace(/\s+/g, '-')
    const newType = await createElementType(slugName, newElementType.category, newElementType.name)
    
    // Select the new type in the main form
    elementForm.elementType = newType.name
    typeSearchQuery.value = newType.display_name || newType.name
    
    closeAddElementTypeModal()
  } catch (error) {
    // Error handled by the composable, just log it here
    console.error('Failed to save element type:', error)
    // Optionally show error in modal
    newElementTypeErrors.name = 'Failed to create element type. Please try again.'
  }
}

/**
 * Check if an element type is custom (not predefined)
 */
const isCustomType = (typeName: string): boolean => {
  const type = apiElementTypes.value.find(t => t.name === typeName)
  return type ? !type.is_predefined : false
}

/**
 * Confirm and delete an element type
 */
const confirmDeleteElementType = async (typeName: string) => {
  const type = apiElementTypes.value.find(t => t.name === typeName)
  
  if (!type) {
    console.error('Element type not found')
    return
  }

  if (type.is_predefined) {
    alert('Cannot delete predefined element types')
    return
  }

  if (!confirm(`Are you sure you want to delete the element type "${type.display_name}"?\n\nThis action cannot be undone. If this type is currently being used by any project elements, the deletion will fail.`)) {
    return
  }

  try {
    await deleteElementType(type.id)
    
    // Clear the selection if the deleted type was selected
    if (elementForm.elementType === typeName) {
      elementForm.elementType = ''
    }
  } catch (error: any) {
    // Show user-friendly error message
    const message = error.message || 'Failed to delete element type'
    alert(message)
  }
}

// Watch for edit element changes
watch(() => props.editElement, (newElement) => {
  if (newElement && props.isOpen) {
    loadElementForEdit(newElement)
  }
}, { immediate: true })

// Watch for element type changes to load default materials
watch(() => elementForm.elementType, (newType) => {
  if (newType && !isEditMode.value) {
    const selectedType = apiElementTypes.value.find(t => t.name === newType)
    if (selectedType && selectedType.materials && selectedType.materials.length > 0) {
      elementForm.materials = selectedType.materials.map((m: any) => ({
        tempId: `temp-${Date.now()}-${Math.random()}`,
        libraryMaterialId: m.library_material_id || m.libraryMaterialId || null,
        description: m.description,
        unitOfMeasurement: m.unit_of_measure || m.unitOfMeasure || m.unitOfMeasurement || 'Pcs',
        defaultQuantity: parseFloat(m.default_quantity || m.defaultQuantity || 1),
        unitCost: m.unit_cost != null ? parseFloat(m.unit_cost) : (m.unitCost != null ? parseFloat(m.unitCost) : null),
        isDefaultIncluded: m.is_default_included ?? m.isDefaultIncluded ?? true
      }))
    }
  }
})

// Watch for modal open/close
watch(() => props.isOpen, (isOpen) => {
  if (isOpen && !props.editElement) {
    initializeForm()
  }
})

// Initialize form on component mount
initializeForm()
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #e2e8f0;
  border-radius: 10px;
}
.dark .custom-scrollbar::-webkit-scrollbar-thumb {
  background: #334155;
}

@keyframes dropdown-in {
  from { opacity: 0; transform: translateY(-10px) scale(0.95); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}
.animate-dropdown {
  animation: dropdown-in 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}
</style>