<template>
  <div class="gallery">
    <div class="gallery-header">
      <h3>Recent Transformations</h3>
      <button @click="refresh" class="refresh-btn">
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" width="16" height="16">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      </button>
    </div>

    <!-- Show loading only on initial fetch, not during polling updates -->
    <div v-if="pending && images.length === 0" class="loading-state">
      <div class="spinner-sm"></div>
    </div>
    
    <div v-else-if="!pending && images.length === 0" class="empty-state">
      <p>No images yet.</p>
    </div>

    <!-- Always show grid if we have images, even if refreshing -->
    <div v-else class="grid">
      <div v-for="img in images" :key="img.id" class="card">
        <div class="card-image">
           <img 
             v-if="img.status === 'completed'" 
             :src="getPublicUrl(img.processed_url)" 
             alt="Processed Image" 
             loading="lazy"
           />
           <div v-else class="processing-placeholder">
             <div class="spinner-sm"></div>
             <span>Processing...</span>
           </div>

           <!-- Delete Button (Top Right Overlay) -->
           <button @click="deleteImage(img.id)" class="delete-overlay-btn" title="Delete">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" width="16" height="16">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
           </button>
        </div>
        
        <div class="card-info">
          <span class="status-badge" :class="img.status">
            {{ img.status }}
          </span>
          <div class="actions">
            <!-- Share Button -->
            <button v-if="img.status === 'completed'" @click="copyLink(img.processed_url)" class="action-btn share-btn" title="Copy Link">
              <span>Share</span>
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" width="16" height="16">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
            </button>
          </div>
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

<style scoped>
.gallery-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

h3 {
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0;
  color: var(--text-primary);
}

.refresh-btn {
  background: transparent;
  border: 1px solid var(--border-color);
  color: var(--text-secondary);
  padding: 0.5rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.refresh-btn:hover {
  border-color: var(--text-primary);
  color: var(--text-primary);
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2rem;
}

.card {
  background: white;
  border: 1px solid var(--border-color);
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.2s ease;
  box-shadow: var(--shadow-sm);
}

.card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
  border-color: #d1d5db;
}

.card-image {
  aspect-ratio: 16/9;
  background: #f9fafb;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.card-image img {
  width: 100%;
  height: 100%;
  object-fit: contain; /* Changed from cover so we can see the whole processed result */
  transition: transform 0.5s ease;
}

.card:hover .card-image img {
  transform: scale(1.02);
}

.processing-placeholder {
  color: var(--text-secondary);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
}

.card-info {
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid var(--border-color);
}

.status-badge {
  font-size: 0.75rem;
  padding: 0.25rem 0.75rem;
  border-radius: 99px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-weight: 600;
  background: #f3f4f6;
  color: var(--text-secondary);
}

.status-badge.completed {
  background: #ecfdf5;
  color: #059669;
}

.status-badge.pending, .status-badge.processing {
  background: #fffbeb;
  color: #d97706;
}

/* Actions */
.actions {
  display: flex;
  gap: 0.5rem;
}

.action-btn {
  background: none;
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
  padding: 0.25rem 0.75rem;
  display: flex;
  align-items: center;
  gap: 0.4rem;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 500;
  transition: all 0.2s;
  background: #f9fafb;
}

.action-btn:hover {
  background: #f3f4f6;
  color: var(--text-primary);
}

.container .share-btn {
  /* Specific styles if needed */
}

/* Delete Overlay */
.delete-overlay-btn {
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  background: white;
  border: 1px solid rgba(0,0,0,0.1);
  color: #ef4444; 
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  opacity: 0;
  transform: scale(0.9);
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
}

.card:hover .delete-overlay-btn {
  opacity: 1;
  transform: scale(1);
}

.delete-overlay-btn:hover {
  background: #ef4444;
  color: white;
  border-color: #ef4444;
}

.empty-state {
  text-align: center;
  padding: 3rem;
  color: var(--text-secondary);
  background: #f9fafb;
  border-radius: 12px;
}

.spinner-sm {
  width: 20px;
  height: 20px;
  border: 2px solid #e5e7eb;
  border-radius: 50%;
  border-top-color: var(--text-primary);
  animation: spin 1s linear infinite;
  margin: 0 auto;
}
</style>
