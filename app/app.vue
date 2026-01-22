<template>
  <div class="min-h-screen bg-white text-gray-900 font-sans selection:bg-gray-900 selection:text-white">
    <!-- Background Grid -->
    <div class="fixed inset-0 z-0 pointer-events-none">
      <div class="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.02]"></div>
      <div class="absolute inset-0 bg-gradient-to-b from-white via-transparent to-transparent h-32"></div>
    </div>
    
    <!-- Navbar -->
    <header class="fixed top-0 inset-x-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100 transition-all duration-300">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center gap-2 group cursor-pointer">
            <div class="w-8 h-8 bg-gray-900 text-white rounded-lg flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-200">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-5 h-5">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span class="font-bold text-lg tracking-tight group-hover:text-gray-600 transition-colors">ImageTransform</span>
          </div>
          
          <nav class="hidden md:flex items-center gap-6">
            <button @click="openHiringModal" class="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors flex items-center gap-2">
              <svg fill="currentColor" viewBox="0 0 24 24" class="w-5 h-5">
                 <path fill-rule="evenodd" clip-rule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.89 1.52 2.34 1.08 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0012 2z" />
              </svg>
              Star on GitHub
            </button>
          </nav>
        </div>
      </div>
    </header>

    <main class="relative z-10 pt-24 pb-12">
      <!-- Hero Section -->
      <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 lg:pt-20 lg:pb-32">
        <div class="grid lg:grid-cols-2 gap-16 items-center">
          <div class="max-w-2xl animate-fade-in-up">
            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-50 border border-gray-200 mb-8 transition-colors hover:bg-gray-100 hover:border-gray-300 group cursor-default">
              <span class="relative flex h-2 w-2">
                <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span class="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              <span class="text-xs font-semibold text-gray-600 uppercase tracking-wide group-hover:text-gray-900">New v1.0 Release</span>
            </div>
            
            <h1 class="text-5xl lg:text-7xl font-bold tracking-tight text-gray-900 mb-6 leading-[1.1]">
              Remove Image <br> Backgrounds.
            </h1>
            
            <p class="text-xl text-gray-500 mb-10 leading-relaxed max-w-lg">
              Upload your photos and let us automatically remove backgrounds and optimize your images in seconds. Professional quality, zero friction.
            </p>
            
            <div class="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <button @click="scrollToWorkspace" class="inline-flex items-center justify-center px-8 py-4 border border-transparent text-base font-semibold rounded-xl text-white bg-gray-900 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-all duration-200 hover:shadow-xl hover:-translate-y-0.5">
                Start Editing Free
              </button>
              <div class="flex flex-col text-sm text-gray-500">
                <span>Value your time?</span>
                <button @click="openHiringModal" class="font-semibold text-gray-900 hover:underline text-left">See how it works &rarr;</button>
              </div>
            </div>
          </div>
          
          <div class="relative lg:-mr-12 animate-fade-in delay-100">
             <div class="relative rounded-2xl overflow-hidden bg-white shadow-2xl ring-1 ring-gray-900/5 rotate-[-2deg] hover:rotate-0 transition-all duration-500 hover:shadow-3xl transform cursor-pointer group">
               <img src="/image.png" alt="App Screenshot" class="w-full h-auto object-cover" />
               <div class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
             </div>
             
             <!-- Decorative elements -->
             <div class="absolute -top-12 -right-12 w-64 h-64 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
             <div class="absolute -bottom-12 -left-12 w-64 h-64 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
          </div>
        </div>
      </section>

      <!-- Workspace Section -->
      <section id="workspace" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-gray-100 pt-24">
        <div class="text-center max-w-2xl mx-auto mb-16">
          <h2 class="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl mb-4">Your Workspace</h2>
          <p class="text-lg text-gray-500">Drag and drop images below to begin the automated workflow.</p>
        </div>
        
        <div class="max-w-5xl mx-auto">
          <UploadZone @upload-success="refreshGallery" />
          <div class="mt-16">
            <GalleryGrid :key="galleryKey" />
          </div>
        </div>
      </section>
    </main>
    
    <footer class="bg-white border-t border-gray-100 mt-24">
      <div class="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 text-center">
        <p class="text-sm text-gray-400">&copy; 2024 ImageTransform Inc. Built for enterprise scale.</p>
      </div>
    </footer>
    
    <HiringModal ref="hiringModal" />
  </div>
</template>

<script setup lang="ts">
import HiringModal from './components/HiringModal.vue';

const galleryKey = ref(0);
const hiringModal = ref<InstanceType<typeof HiringModal> | null>(null);

function refreshGallery() {
  galleryKey.value++;
}

function scrollToWorkspace() {
  document.getElementById('workspace')?.scrollIntoView({ behavior: 'smooth' });
}

function openHiringModal() {
  hiringModal.value?.open();
}
</script>

<style>
/* Using global CSS only for specific keyframe tweaks not covered by Tailwind config if needed */
/* Tailwind handles the rest */
</style>
