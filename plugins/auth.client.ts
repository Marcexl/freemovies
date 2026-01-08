import { useAuthStore } from '~/stores/auth'

export default defineNuxtPlugin(() => {
  if (import.meta.client) {
    const authStore = useAuthStore()
    // Initialize if not already initialized
    //if (!authStore.unsubscribeAuth) {
      console.log('🔥 auth plugin loaded', authStore.unsubscribeAuth)
      authStore.init()
    //}
  }
})
