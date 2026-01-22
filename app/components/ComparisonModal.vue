<template>
  <Transition 
    enter-active-class="transition duration-300 ease-out"
    enter-from-class="opacity-0 scale-95"
    enter-to-class="opacity-100 scale-100"
    leave-active-class="transition duration-200 ease-in"
    leave-from-class="opacity-100 scale-100"
    leave-to-class="opacity-0 scale-95"
  >
    <div v-if="isOpen" class="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8" @keydown.esc="close" tabindex="0">
      <!-- Backdrop -->
      <div class="fixed inset-0 bg-gray-900/90 backdrop-blur-md transition-opacity" @click="close"></div>
      
      <!-- Modal -->
      <div class="relative w-full max-w-6xl h-[80vh] flex flex-col bg-transparent pointer-events-none">
        
        <!-- Controls -->
        <div class="flex justify-between items-center mb-4 pointer-events-auto">
          <div class="flex items-center gap-4 bg-black/50 backdrop-blur-md rounded-full px-5 py-2 border border-white/10">
             <div class="flex items-center gap-2 text-sm font-bold text-white">
               <span class="text-gray-400 uppercase text-xs tracking-wider">Before</span>
               <div class="h-4 w-[1px] bg-white/20"></div>
               <span class="text-blue-400 uppercase text-xs tracking-wider">After</span>
             </div>
          </div>
          
          <button @click="close" class="bg-white/10 hover:bg-white/20 text-white rounded-full p-2 backdrop-blur-md transition-colors">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-6 h-6">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Image Container -->
        <div class="flex-1 relative flex items-center justify-center pointer-events-auto select-none"
             @mousemove="handleMove" @touchmove="handleMove" @mouseleave="isHovering = false" @mouseenter="isHovering = true">
             
           <div class="relative shadow-2xl rounded-lg overflow-hidden max-w-full max-h-full inline-block group" ref="imageContainer">
              <!-- Processed Image (Background / Base) -->
              <!-- Use draggable=false to prevent ghost images -->
              <img 
                :src="processedSrc" 
                class="block max-w-full max-h-[70vh] object-contain pointer-events-none" 
                draggable="false"
              />

              <!-- Original Image (Foreground / Clipped) -->
              <!-- We clip THIS one to reveal the processed one underneath? 
                   Actually standard is: Left = Before, Right = After.
                   So if slider is at 50%: Left half shows Before, Right half shows After.
                   Let's put 'Before' (Original) on top and clip it from the right.
              -->
              <div 
                class="absolute inset-0 overflow-hidden"
                :style="{ width: sliderPosition + '%' }"
              >
                <img 
                  :src="originalSrc" 
                  class="block h-full w-auto max-w-none pointer-events-none" 
                  draggable="false"
                />
                <!-- Label for Before -->
                 <div class="absolute top-4 left-4 bg-black/60 text-white text-xs font-bold px-2 py-1 rounded backdrop-blur-sm">Original</div>
              </div>

               <!-- Label for After (Visible on the background layer) -->
               <div class="absolute top-4 right-4 bg-blue-600/80 text-white text-xs font-bold px-2 py-1 rounded backdrop-blur-sm">Processed</div>

              <!-- Slider Line -->
              <div 
                class="absolute top-0 bottom-0 w-0.5 bg-white shadow-[0_0_15px_rgba(0,0,0,0.5)] cursor-ew-resize z-10"
                :style="{ left: sliderPosition + '%' }"
              >
                <!-- Handle -->
                <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-xl flex items-center justify-center text-gray-900 transform transition-transform"
                     :class="isHovering ? 'scale-110' : 'scale-100'">
                  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-6 h-6">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 9l4-4 4 4m0 6l-4 4-4-4" transform="rotate(90 12 12)" />
                  </svg>
                </div>
              </div>
           </div>
        </div>
        
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
const isOpen = ref(false);
const originalSrc = ref('');
const processedSrc = ref(''); // We'll put Processed as base, Original on top (Left side)
const sliderPosition = ref(50);
const imageContainer = ref<HTMLElement | null>(null);
const isHovering = ref(false);

const open = (original: string, processed: string) => {
  originalSrc.value = original;
  processedSrc.value = processed;
  sliderPosition.value = 50;
  isOpen.value = true;
};

const close = () => {
  isOpen.value = false;
};

const handleMove = (e: MouseEvent | TouchEvent) => {
  if (!imageContainer.value) return;
  
  const rect = imageContainer.value.getBoundingClientRect();
  const x = 'touches' in e ? e.touches[0].clientX : e.clientX;
  
  // Calculate relative X inside the image bounds
  let relativeX = x - rect.left;
  
  // Clamp
  if (relativeX < 0) relativeX = 0;
  if (relativeX > rect.width) relativeX = rect.width;
  
  const percentage = (relativeX / rect.width) * 100;
  sliderPosition.value = percentage;
};

defineExpose({ open });
</script>
