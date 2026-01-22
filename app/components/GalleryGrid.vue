<template>
  <div class="relative min-h-[400px]">
    <div class="flex justify-between items-center mb-10">
      <div class="flex items-center gap-3">
        <h3 class="text-2xl font-bold text-gray-900 tracking-tight">Recent Transformations</h3>
        <div class="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-md text-xs font-bold">{{ images.length }}</div>
      </div>
      
      <button 
        @click="refresh" 
        class="group p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-900 transition-colors"
        title="Refresh Gallery"
      >
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-5 h-5 group-hover:rotate-180 transition-transform duration-500">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="pending && images.length === 0" class="flex flex-col items-center justify-center py-20 animate-fade-in">
      <div class="w-10 h-10 border-4 border-gray-100 border-t-gray-900 rounded-full animate-spin mb-4"></div>
      <p class="text-gray-500 font-medium">Loading gallery...</p>
    </div>
    
    <!-- Empty State -->
    <div v-else-if="!pending && images.length === 0" class="text-center py-20 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
      <div class="mx-auto w-16 h-16 bg-white rounded-full shadow-sm flex items-center justify-center mb-4">
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-6 h-6 text-gray-400">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>
      <p class="text-gray-900 font-semibold text-lg">No images yet</p>
      <p class="text-gray-500 text-sm">Upload an image above to get started.</p>
    </div>

    <!-- Grid -->
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      <div v-for="img in images" :key="img.id" class="group relative bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden">
        
        <!-- Image Area -->
        <div class="aspect-[4/3] bg-gray-50 relative flex items-center justify-center overflow-hidden">
           <img 
             v-if="img.status === 'completed'" 
             :src="getPublicUrl(img.processed_url)" 
             alt="Processed Image" 
             loading="lazy"
             class="w-full h-full object-contain p-4 transition-transform duration-700 group-hover:scale-105"
           />
           <div v-else class="flex flex-col items-center gap-3">
             <div class="w-8 h-8 border-2 border-gray-200 border-t-gray-900 rounded-full animate-spin"></div>
             <span class="text-xs font-semibold text-gray-500 uppercase tracking-wider">Processing</span>
           </div>

           <!-- Delete Overlay Button -->
           <button 
             @click.stop="deleteImage(img.id)" 
             class="absolute top-4 right-4 w-8 h-8 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center shadow-sm opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 hover:bg-red-50 hover:text-red-500 z-20"
             title="Delete Image"
           >
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-4 h-4">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
           </button>
        </div>
        
        <!-- Details Footer -->
        <div class="p-5 border-t border-gray-50 flex justify-between items-center bg-white relative z-10">
          <span 
            class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider"
            :class="img.status === 'completed' ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-600'"
          >
            <span class="w-1.5 h-1.5 rounded-full" :class="img.status === 'completed' ? 'bg-green-500' : 'bg-amber-500 animate-pulse'"></span>
            {{ img.status }}
          </span>
          
          <!-- Share Button -->
          <button 
            v-if="img.status === 'completed'" 
            @click="copyLink(img.processed_url)" 
            class="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
          >
            Share
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-3.5 h-3.5">
               <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <ConfirmationModal ref="confirmModal" />
  </div>
</template>

<script setup lang="ts">
import ConfirmationModal from './ConfirmationModal.vue'; 
const confirmModal = ref<InstanceType<typeof ConfirmationModal> | null>(null);

const config = useRuntimeConfig();

function getPublicUrl(path: string | null) {
  if (!path) return '';
  return `${config.public.supabaseUrl}/storage/v1/object/public/images/${path}`;
}

const { data, refresh, pending } = await useFetch('/api/images');
const images = computed(() => data.value?.images || []);

let pollTimer: any = null;

onMounted(() => {
  pollTimer = setInterval(() => {
    if (images.value.some(img => img.status === 'pending' || img.status === 'processing')) {
      refresh();
    }
  }, 2000);
});

onUnmounted(() => {
  if (pollTimer) clearInterval(pollTimer);
});

async function copyLink(path: string) {
  const url = getPublicUrl(path);
  try {
    await navigator.clipboard.writeText(url);
    // You could replace with a nicer toast
    alert("Link copied to clipboard!"); 
  } catch (err) {
    console.error('Failed to copy: ', err);
  }
}

async function deleteImage(id: string) {
  const isConfirmed = await confirmModal.value?.open(
    'Delete Image', 
    'Are you sure you want to permanently delete this image?'
  );

  if (!isConfirmed) return;
  
  try {
    const { error } = await useFetch(`/api/images/${id}`, { method: 'DELETE' });
    if (error.value) throw new Error(error.value.message);
    refresh();
  } catch (e: any) {
    alert(`Failed to delete: ${e.message}`);
  }
}
</script>
