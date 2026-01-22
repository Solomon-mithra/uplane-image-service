<template>
  <Transition name="modal">
    <div v-if="isOpen" class="modal-backdrop">
      <div class="modal-content">
        <h3>{{ title }}</h3>
        <p>{{ message }}</p>
        
        <div class="modal-actions">
          <button @click="cancel" class="btn-cancel">Cancel</button>
          <button @click="confirm" class="btn-confirm">Delete</button>
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

<style scoped>
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border: 1px solid #e5e7eb;
  padding: 2rem;
  border-radius: 16px;
  width: 90%;
  max-width: 400px;
  text-align: center;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

h3 {
  margin: 0 0 0.5rem 0;
  font-size: 1.25rem;
  color: #111827;
  font-weight: 600;
}

p {
  color: #6b7280;
  margin-bottom: 2rem;
  font-size: 0.95rem;
  line-height: 1.5;
}

.modal-actions {
  display: flex;
  justify-content: center;
  gap: 1rem;
}

button {
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 0.9rem;
}

.btn-cancel {
  background: white;
  border: 1px solid #d1d5db;
  color: #374151;
}

.btn-cancel:hover {
  background: #f9fafb;
  border-color: #9ca3af;
}

.btn-confirm {
  background: #ef4444;
  color: white;
  border: 1px solid #ef4444;
}

.btn-confirm:hover {
  background: #dc2626;
  border-color: #dc2626;
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
</style>
