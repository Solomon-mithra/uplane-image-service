<template>
  <div 
    class="relative group cursor-pointer"
    @dragover.prevent="isDragging = true"
    @dragleave.prevent="isDragging = false"
    @drop.prevent="handleDrop"
    @click="triggerFileInput"
  >
    <!-- Main Drop Zone -->
    <div 
      class="relative overflow-hidden rounded-3xl border-2 border-dashed transition-all duration-300 ease-out p-12 text-center"
      :class="[
        isDragging 
          ? 'border-gray-900 bg-gray-50 scale-[1.01] shadow-xl' 
          : 'border-gray-200 bg-gray-50/50 hover:bg-gray-50 hover:border-gray-300'
      ]"
    >
      <input 
        type="file" 
        ref="fileInput" 
        class="hidden" 
        accept="image/*" 
        @change="handleFileSelect"
      />
      
      <!-- Uploading State -->
      <div v-if="isUploading" class="flex flex-col items-center justify-center py-8 animate-fade-in">
         <div class="relative w-16 h-16 mb-6">
           <div class="absolute inset-0 border-4 border-gray-100 rounded-full"></div>
           <div class="absolute inset-0 border-4 border-gray-900 rounded-full border-t-transparent animate-spin"></div>
         </div>
         <p class="text-lg font-medium text-gray-900">Processing your masterpiece...</p>
         <p class="text-sm text-gray-400 mt-2">This utilizes Inngest background workers.</p>
      </div>
      
      <!-- Idle State -->
      <div v-else class="flex flex-col items-center justify-center transition-transform duration-300 group-hover:-translate-y-1">
        <div class="w-16 h-16 bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center mb-6 group-hover:shadow-md transition-shadow">
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-8 h-8 text-gray-900">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
        </div>
        <h3 class="text-xl font-bold text-gray-900 mb-2">Click or drop image here</h3>
        <p class="text-gray-500 text-sm max-w-sm mx-auto leading-relaxed">
          Supports high-res JPG & PNG up to 5MB. <br>
          <span class="text-gray-400">Drag files to upload completely hands-free.</span>
        </p>
      </div>
    </div>
    
    <!-- Toast Error -->
    <div v-if="error" class="fixed bottom-8 right-8 z-50 animate-fade-in-up">
      <div class="bg-red-500 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 font-medium">
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-5 h-5">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        {{ error }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const isDragging = ref(false);
const isUploading = ref(false);
const error = ref<string | null>(null);
const fileInput = ref<HTMLInputElement | null>(null);
const emit = defineEmits(['upload-success']);

function triggerFileInput() {
  fileInput.value?.click();
}

async function handleFileSelect(event: Event) {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files[0]) {
    uploadFile(input.files[0]);
  }
}

function handleDrop(event: DragEvent) {
  isDragging.value = false;
  if (event.dataTransfer?.files && event.dataTransfer.files[0]) {
    uploadFile(event.dataTransfer.files[0]);
  }
}

async function uploadFile(file: File) {
  if (!file.type.startsWith('image/')) {
    error.value = "Please upload an image file.";
    setTimeout(() => error.value = null, 4000);
    return;
  }
  
  isUploading.value = true;
  error.value = null;

  const formData = new FormData();
  formData.append('file', file);

  try {
    const { data: response, error: apiError } = await useFetch('/api/upload', {
      method: 'POST',
      body: formData
    });

    if (apiError.value) {
      throw new Error(apiError.value.message);
    }
    
    // Success
    emit('upload-success');

    // Wait 2 seconds just for the transition feel
    await new Promise(r => setTimeout(r, 1000));
    
  } catch (err: any) {
    error.value = err.message || "Upload failed. Please try again.";
    setTimeout(() => error.value = null, 5000);
  } finally {
    isUploading.value = false;
  }
}
</script>
