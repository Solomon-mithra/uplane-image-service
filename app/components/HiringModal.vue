<template>
  <Transition 
    enter-active-class="transition duration-300 ease-out"
    enter-from-class="opacity-0 scale-95"
    enter-to-class="opacity-100 scale-100"
    leave-active-class="transition duration-200 ease-in"
    leave-from-class="opacity-100 scale-100"
    leave-to-class="opacity-0 scale-95"
  >
    <div v-if="isOpen" class="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <!-- Backdrop -->
      <div class="fixed inset-0 bg-gray-900/60 backdrop-blur-md transition-opacity" @click="cancel"></div>

      <!-- Modal Content -->
      <div class="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 overflow-hidden">
         <!-- Decorative Background Blob -->
         <div class="absolute -top-20 -right-20 w-40 h-40 bg-blue-100 rounded-full blur-3xl opacity-50"></div>

         <div class="relative z-10 text-center">
           <div class="mx-auto flex items-center justify-center h-14 w-14 rounded-full bg-blue-50 mb-6 group">
             <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-7 h-7 text-blue-600 group-hover:scale-110 transition-transform">
               <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
             </svg>
           </div>
           
           <h3 class="text-2xl font-bold text-gray-900 mb-3 tracking-tight">Codebase Access Restricted</h3>
           
           <p class="text-gray-500 mb-8 leading-relaxed">
             This repository contains high-quality code patterns. Access is strictly limited to individuals who are serious about hiring top talent. 
           </p>

           <div class="bg-gray-50 rounded-xl p-4 mb-8 text-left border border-gray-100 cursor-pointer hover:border-blue-200 transition-colors" @click="agreed = !agreed">
             <label class="flex items-start gap-3 cursor-pointer pointer-events-none">
               <div class="relative flex items-center">
                 <input 
                   type="checkbox" 
                   v-model="agreed"
                   class="peer h-5 w-5 cursor-pointer appearance-none rounded-md border border-gray-300 transition-all checked:border-blue-600 checked:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20" 
                 />
                 <svg class="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 peer-checked:opacity-100 w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                 </svg>
               </div>
               <span class="text-sm text-gray-700 font-medium select-none">
                 I promise to interview <span class="text-gray-900 font-bold">Solomon Mithra</span> if I find this code impressive.
               </span>
             </label>
           </div>
           
           <div class="flex gap-3 justify-center">
             <button 
               @click="cancel" 
               class="flex-1 px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50 hover:text-gray-900 focus:outline-none transition-colors"
             >
               Maybe later
             </button>
             <button 
               @click="confirm" 
               :disabled="!agreed"
               class="flex-1 px-4 py-3 bg-gray-900 border border-transparent rounded-xl text-sm font-semibold text-white hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
             >
               Reveal Code &rarr;
             </button>
           </div>
         </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
const isOpen = ref(false);
const agreed = ref(false);

const open = () => {
  isOpen.value = true;
  agreed.value = false;
};

const confirm = () => {
  isOpen.value = false;
  window.open('https://github.com/Solomon-mithra/uplane-image-service', '_blank');
};

const cancel = () => {
  isOpen.value = false;
};

defineExpose({ open });
</script>
