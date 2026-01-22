<template>
  <div class="app-container">
    <div class="background-grid"></div>
    
    <header>
      <div class="logo">
        <div class="logo-icon">
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" width="20" height="20">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
          </svg>
        </div>
        <span class="text">ImageTranform</span>
      </div>
      <nav>
        <a href="https://github.com/solomonmithra/Image-Transformation-Service" target="_blank" class="nav-link">
          <svg fill="currentColor" viewBox="0 0 24 24" width="20" height="20">
             <path fill-rule="evenodd" clip-rule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.89 1.52 2.34 1.08 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0012 2z" />
          </svg>
          <span class="nav-text">Star on GitHub</span>
        </a>
      </nav>
    </header>

    <main>
      <section class="hero-section">
        <div class="hero-content">
          <div class="badge">New v1.0 Release</div>
          <h1 class="title">Professional Image <br> Processing API.</h1>
          <p class="subtitle">
            Upload raw assets. Get production-ready images with removed backgrounds and smart cropping instantly.
          </p>
          <div class="cta-group">
            <button @click="scrollToWorkspace" class="btn-primary">Start Transforming</button>
            <div class="stats">
              <span>Looking for the code?</span>
              <a href="#" class="link">Visit GitHub &rarr;</a>
            </div>
          </div>
        </div>

        <div class="hero-visual">
          <div class="before-after-card">
            <div class="image-wrapper">
               <img src="/image.png" alt="Before and After Illustration" class="demo-image" />
               <div class="overlay-tag">Processed via Inngest</div>
            </div>
            <div class="card-glow"></div>
          </div>
        </div>
      </section>

      <div id="workspace" class="workspace-section">
        <div class="section-header">
           <h2>Your Workspace</h2>
           <p>Drag and drop images to begin the workflow.</p>
        </div>
        <UploadZone @upload-success="refreshGallery" />
        <GalleryGrid :key="galleryKey" />
      </div>
    </main>
    
    <footer>
      <p>&copy; 2024 ImageTransform Inc. Built for enterprise scale.</p>
    </footer>
  </div>
</template>

<script setup lang="ts">
const galleryKey = ref(0);

function refreshGallery() {
  galleryKey.value++;
}

function scrollToWorkspace() {
  document.getElementById('workspace')?.scrollIntoView({ behavior: 'smooth' });
}
</script>

<style>
/* 
  PREMIUM LIGHT THEME 
  Inspired by Vercel, Stripe, Linear.
*/
:root {
  --bg-color: #ffffff;
  --bg-dots: #e5e5e5;
  --text-primary: #111827;
  --text-secondary: #6b7280;
  --accent-primary: #000000;
  --accent-secondary: #333333;
  --border-color: #e5e7eb;
  --surface-color: #ffffff;
  --surface-hover: #f9fafb;
  --font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

body {
  margin: 0;
  background-color: var(--bg-color);
  color: var(--text-primary);
  font-family: var(--font-family);
  -webkit-font-smoothing: antialiased;
}

/* Background Grid Pattern */
.background-grid {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: radial-gradient(var(--bg-dots) 1px, transparent 1px);
  background-size: 24px 24px;
  mask-image: linear-gradient(to bottom, black 40%, transparent 100%);
  pointer-events: none;
  z-index: -1;
}

.app-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* Header */
header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 0;
  margin-bottom: 6rem;
}

.logo {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-weight: 700;
  font-size: 1.1rem;
  color: var(--text-primary);
}

.logo-icon {
  width: 32px;
  height: 32px;
  background: var(--text-primary);
  color: white;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--text-secondary);
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 500;
  transition: color 0.2s;
  padding: 0.5rem 1rem;
  border-radius: 6px;
}

.nav-link:hover {
  color: var(--text-primary);
  background: var(--surface-hover);
}

/* Hero */
.hero-section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;
  margin-bottom: 8rem;
}

.badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  background: #f3f4f6;
  border: 1px solid #e5e7eb;
  border-radius: 99px;
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--text-secondary);
  margin-bottom: 1.5rem;
}

.title {
  font-size: 4rem;
  line-height: 1.05;
  font-weight: 800;
  letter-spacing: -0.04em;
  margin: 0 0 1.5rem 0;
  color: var(--text-primary);
}

.subtitle {
  font-size: 1.25rem;
  line-height: 1.6;
  color: var(--text-secondary);
  margin: 0 0 2.5rem 0;
  max-width: 480px;
}

.cta-group {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.btn-primary {
  background: var(--text-primary);
  color: white;
  padding: 1rem 2rem;
  border-radius: 8px;
  font-weight: 600;
  font-size: 1rem;
  border: none;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

.stats {
  display: flex;
  flex-direction: column;
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.link {
  color: var(--text-primary);
  text-decoration: none;
  font-weight: 600;
}

.link:hover {
  text-decoration: underline;
}

/* Hero Visual */
.hero-visual {
  position: relative;
}

.before-after-card {
  position: relative;
  border-radius: 20px;
  padding: 12px;
  background: white;
  box-shadow: 
    0 20px 25px -5px rgba(0, 0, 0, 0.1), 
    0 10px 10px -5px rgba(0, 0, 0, 0.04),
    0 0 0 1px rgba(0,0,0,0.05);
  transform: rotate(-2deg);
  transition: transform 0.5s ease;
}

.before-after-card:hover {
  transform: rotate(0deg) scale(1.02);
}

.image-wrapper {
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  background: #f9fafb;
}

.demo-image {
  width: 100%;
  height: auto;
  display: block;
}

.overlay-tag {
  position: absolute;
  bottom: 12px;
  right: 12px;
  background: rgba(255,255,255,0.9);
  backdrop-filter: blur(4px);
  padding: 4px 12px;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}

/* Workspace */
.workspace-section {
  padding-top: 4rem;
  padding-bottom: 6rem;
  border-top: 1px solid var(--border-color);
}

.section-header {
  margin-bottom: 3rem;
  text-align: center;
}

.section-header h2 {
  font-size: 2rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  margin: 0 0 0.5rem 0;
}

.section-header p {
  color: var(--text-secondary);
}

footer {
  margin-top: auto;
  padding: 2rem 0;
  border-top: 1px solid var(--border-color);
  text-align: center;
  color: var(--text-secondary);
  font-size: 0.875rem;
}

@media (max-width: 900px) {
  .hero-section {
    grid-template-columns: 1fr;
    text-align: center;
    gap: 3rem;
  }
  
  .subtitle {
    margin-left: auto;
    margin-right: auto;
  }
  
  .cta-group {
    justify-content: center;
  }
  
  .before-after-card {
    transform: rotate(0);
    margin: 0 1rem;
  }
}
</style>
