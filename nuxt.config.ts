import Aura from '@primeuix/themes/aura';

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: [
    '@primevue/nuxt-module',
    '@pinia/nuxt'
  ],
  primevue: { 
    components:{
      include:['*']
    },
    options: {
      theme: {
        preset: Aura
      }
    }
  },
  css: [
    'primeicons/primeicons.css',
    './node_modules/primeflex/primeflex.css'
  ],
  
  build: {
    transpile: ['primevue']
  },
  
  runtimeConfig: {
    public: {
      omdbApiKey: process.env.OMDB_API_KEY || 'demo'
    }
  }
})