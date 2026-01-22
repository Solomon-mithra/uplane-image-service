<template>
  <div 
    class="upload-zone"
    :class="{ 'is-dragging': isDragging, 'is-uploading': isUploading }"
    @dragover.prevent="isDragging = true"
    @dragleave.prevent="isDragging = false"
    @drop.prevent="handleDrop"
    @click="triggerFileInput"
  >
    <input 
      type="file" 
      ref="fileInput" 
      class="hidden-input" 
      accept="image/*" 
      @change="handleFileSelect"
    />
    
    <div v-if="isUploading" class="upload-content">
       <div class="spinner"></div>
       <p class="status-text">Processing your masterpiece...</p>
    </div>
    
    <div v-else class="upload-content">
      <div class="icon-container">
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" width="32" height="32">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
        </svg>
      </div>
      <p class="upload-text">Click or drop image here</p>
      <p class="upload-hint">Supports JPG, PNG (Max 5MB)</p>
    </div>
  </div>
  
  <div v-if="error" class="error-toast">
    {{ error }}
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
  } finally {
    isUploading.value = false;
  }
}
</script>

<style scoped>
.upload-zone {
  border: 1px dashed var(--border-color);
  background: var(--surface-hover);
  border-radius: 12px;
  padding: 4rem 2rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  margin-bottom: 4rem;
}

.upload-zone:hover {
  border-color: var(--text-secondary);
  background: #f3f4f6;
}

.upload-zone.is-dragging {
  border-color: var(--text-primary);
  border-style: solid;
  background: white;
  box-shadow: var(--shadow-lg);
  transform: scale(1.01);
}

.hidden-input {
  display: none;
}

.icon-container {
  color: var(--text-secondary);
  margin-bottom: 1rem;
}

.upload-text {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: var(--text-primary);
}

.upload-hint {
  font-size: 0.9rem;
  color: var(--text-secondary);
}

.error-toast {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  padding: 1rem 1.5rem;
  background: #ef4444;
  color: white;
  border-radius: 8px;
  font-size: 0.9rem;
  animation: slideIn 0.3s ease-out;
  box-shadow: var(--shadow-lg);
  z-index: 100;
}

/* Spinner */
.spinner {
  width: 24px;
  height: 24px;
  border: 2px solid #e5e7eb;
  border-radius: 50%;
  border-top-color: var(--text-primary);
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

.status-text {
  color: var(--text-secondary);
  font-weight: 500;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

@keyframes slideIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
