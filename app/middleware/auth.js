export default defineNuxtRouteMiddleware(async (to, from) => {
  const { isAuthenticated, loading } = useAuth()
  
  // Wait for auth to finish loading
  if (loading.value) {
    // Wait for auth state to be determined
    await new Promise((resolve) => {
      const unwatch = watch(loading, (isLoading) => {
        if (!isLoading) {
          unwatch()
          resolve()
        }
      })
      
      // Timeout after 3 seconds to prevent infinite waiting
      setTimeout(() => {
        unwatch()
        resolve()
      }, 3000)
    })
  }
  
  if (!isAuthenticated.value) {
    return navigateTo('/')
  }
})

