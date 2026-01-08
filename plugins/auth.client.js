export default defineNuxtPlugin(() => {
  const authStore = useAuthStore()
  
  // Initialize auth check on app startup
  if (import.meta.client) {
    authStore.init()
  }
})

