export default defineNuxtPlugin(() => {
  const authStore = useAuthStore()
  
  // Initialize auth check on app startup
  if (process.client) {
    authStore.init()
  }
})

