import { useAuthStore } from '../stores/auth'

export const useAuth = () => {
  const authStore = useAuthStore()
  
  // Initialize auth check on first use
  if (import.meta.client && !authStore.unsubscribeAuth) {
    authStore.init()
  }

  return {
    // Getters (computed from store)
    isAuthenticated: computed(() => authStore.isAuthenticated),
    user: computed(() => authStore.user),
    loading: computed(() => authStore.loading),
    
    // Actions (delegated to store)
    register: (email, password, name) => authStore.register(email, password, name),
    login: (email, password) => authStore.login(email, password),
    loginWithGoogle: () => authStore.loginWithGoogle(),
    logout: () => authStore.logout(),
  }
}
