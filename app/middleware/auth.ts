import { useAuthStore } from '../../stores/auth'

export default defineNuxtRouteMiddleware(async () => {
  if (import.meta.server) return

  const authStore = useAuthStore()

  await new Promise<void>((resolve) => {
    if (!authStore.loading) return resolve()

    const stop = watch(
      () => authStore.loading,
      (loading) => {
        if (!loading) {
          stop()
          resolve()
        }
      },
      { immediate: true }
    )

    setTimeout(() => {
      stop()
      resolve()
    }, 5000)
  })

  await nextTick()

  if (!authStore.isAuthenticated) {
    return navigateTo('/')
  }
})
