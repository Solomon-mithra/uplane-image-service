// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  
  // Runtime Config
  runtimeConfig: {
    public: {
      supabaseUrl: process.env.SUPABASE_URL || '',
    },
    // Private keys
    supabaseServiceKey: process.env.SUPABASE_SERVICE_KEY,
    cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME,
    cloudinaryApiKey: process.env.CLOUDINARY_API_KEY,
    cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET,
  },

  // Head configuration for Fonts and Meta
  app: {
    head: {
      title: 'ImageTransform - AI Powered Editor',
      meta: [
        { name: 'description', content: 'Professional image transformation service.' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' }
      ],
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap' }
      ]
    }
  },

  modules: ['@nuxtjs/tailwindcss'],

  css: [],
})