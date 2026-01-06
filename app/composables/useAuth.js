export const useAuth = () => {
  const isAuthenticated = useState('auth', () => false)
  const user = useState('user', () => null)

  const login = (email, password) => {

    if (email && password) {
      isAuthenticated.value = true
      user.value = {
        email: email,
        name: email.split('@')[0] 
      }
      
      if (process.client) {
        localStorage.setItem('isAuthenticated', 'true')
        localStorage.setItem('user', JSON.stringify(user.value))
      }
      
      return { success: true }
    }
    
    return { success: false, error: 'Email y password son requeridos' }
  }

  const logout = () => {
    isAuthenticated.value = false
    user.value = null
    
    if (process.client) {
      localStorage.removeItem('isAuthenticated')
      localStorage.removeItem('user')
    }
  }

  const checkAuth = () => {
    if (process.client) {
      const savedAuth = localStorage.getItem('isAuthenticated')
      const savedUser = localStorage.getItem('user')
      
      if (savedAuth === 'true' && savedUser) {
        isAuthenticated.value = true
        user.value = JSON.parse(savedUser)
      }
    }
  }

  if (process.client) {
    checkAuth()
  }

  return {
    isAuthenticated: readonly(isAuthenticated),
    user: readonly(user),
    login,
    logout,
    checkAuth
  }
}

