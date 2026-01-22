<template>
  <Transition 
    enter-active-class="transition ease-out duration-300"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="transition ease-in duration-200"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div v-if="isOpen" class="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <!-- Backdrop -->
      <div class="fixed inset-0 bg-gray-900/30 backdrop-blur-sm transition-opacity" @click="cancel"></div>

      <!-- Modal Content -->
      <div class="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 sm:p-8 transform transition-all scale-100 ring-1 ring-gray-900/5">
         <div class="text-center">
           <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-50 mb-4">
             <svg class="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
             </svg>
           </div>
           
           <h3 class="text-lg font-bold text-gray-900 mb-2">{{ title }}</h3>
           <p class="text-sm text-gray-500 mb-8 leading-relaxed">{{ message }}</p>
           
           <div class="flex gap-3 justify-center">
             <button 
               @click="cancel" 
               class="flex-1 px-4 py-2.5 bg-white border border-gray-300 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200 transition-colors shadow-sm"
             >
               Cancel
             </button>
             <button 
               @click="confirm" 
               class="flex-1 px-4 py-2.5 bg-red-600 border border-transparent rounded-xl text-sm font-semibold text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors shadow-sm"
             >
               Delete
             </button>
           </div>
         </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
const isOpen = ref(false);
const title = ref('');
const message = ref('');
let resolvePromise: ((value: boolean) => void) | null = null;

const open = (t: string, m: string) => {
  title.value = t;
  message.value = m;
  isOpen.value = true;
  return new Promise<boolean>((resolve) => {
    resolvePromise = resolve;
  });
};

const confirm = () => {
  isOpen.value = false;
  if (resolvePromise) resolvePromise(true);
};

const cancel = () => {
  isOpen.value = false;
  if (resolvePromise) resolvePromise(false);
};

defineExpose({ open });
</script>
