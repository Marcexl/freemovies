import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged
} from 'firebase/auth'
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore'
import { auth, db, googleProvider } from '../firebase.js'

export const useAuth = () => {
  const isAuthenticated = useState('auth', () => false)
  const user = useState('user', () => null)
  const loading = useState('authLoading', () => true)

  // Create or update user document in Firestore
  const createUserDocument = async (firebaseUser, name = null) => {
    if (!db) {
      throw new Error('Firestore no está disponible')
    }

    try {
      const userRef = doc(db, 'users', firebaseUser.uid)
      const userDoc = await getDoc(userRef)

      if (!userDoc.exists()) {
        // Create new user document
        await setDoc(userRef, {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          name: name || firebaseUser.displayName || firebaseUser.email.split('@')[0],
          displayName: firebaseUser.displayName || null,
          photoURL: firebaseUser.photoURL || null,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        })
      } else {
        // Update existing user document
        await setDoc(userRef, {
          updatedAt: serverTimestamp()
        }, { merge: true })
      }

      // Get the user document
      const updatedDoc = await getDoc(userRef)
      return updatedDoc.data()
    } catch (error) {
      console.error('Error creating user document:', error)
      throw error
    }
  }

  // Register with email and password
  const register = async (email, password, name) => {
    if (!process.client || !auth || !db) {
      return { success: false, error: 'Firebase no está disponible' }
    }

    try {
      if (!email || !password || !name) {
        return { success: false, error: 'Email, password y nombre son requeridos' }
      }

      if (password.length < 6) {
        return { success: false, error: 'La contraseña debe tener al menos 6 caracteres' }
      }

      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      const firebaseUser = userCredential.user

      // Create user document in Firestore
      const userData = await createUserDocument(firebaseUser, name)

      // Update local state
      isAuthenticated.value = true
      user.value = {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        name: userData.name,
        displayName: userData.displayName,
        photoURL: userData.photoURL
      }

      return { success: true, user: user.value }
    } catch (error) {
      console.error('Registration error:', error)
      let errorMessage = 'Error al registrar usuario'
      
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'Este email ya está registrado'
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Email inválido'
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'La contraseña es muy débil'
      }
      
      return { success: false, error: errorMessage }
    }
  }

  // Login with email and password
  const login = async (email, password) => {
    if (!process.client || !auth || !db) {
      return { success: false, error: 'Firebase no está disponible' }
    }

    try {
      if (!email || !password) {
        return { success: false, error: 'Email y password son requeridos' }
      }

      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      const firebaseUser = userCredential.user

      // Get user document from Firestore
      const userRef = doc(db, 'users', firebaseUser.uid)
      const userDoc = await getDoc(userRef)

      let userData = {}
      if (userDoc.exists()) {
        userData = userDoc.data()
      } else {
        // If user document doesn't exist, create it
        userData = await createUserDocument(firebaseUser)
      }

      // Update local state
      isAuthenticated.value = true
      user.value = {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        name: userData.name || firebaseUser.email.split('@')[0],
        displayName: userData.displayName,
        photoURL: userData.photoURL
      }

      return { success: true, user: user.value }
    } catch (error) {
      console.error('Login error:', error)
      let errorMessage = 'Error al iniciar sesión'
      
      if (error.code === 'auth/user-not-found') {
        errorMessage = 'Usuario no encontrado'
      } else if (error.code === 'auth/wrong-password') {
        errorMessage = 'Contraseña incorrecta'
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Email inválido'
      } else if (error.code === 'auth/invalid-credential') {
        errorMessage = 'Credenciales inválidas'
      }
      
      return { success: false, error: errorMessage }
    }
  }

  // Login with Google
  const loginWithGoogle = async () => {
    if (!process.client || !auth || !db || !googleProvider) {
      return { success: false, error: 'Firebase no está disponible' }
    }

    try {
      const result = await signInWithPopup(auth, googleProvider)
      const firebaseUser = result.user

      // Create or update user document in Firestore
      const userData = await createUserDocument(firebaseUser)

      // Update local state
      isAuthenticated.value = true
      user.value = {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        name: userData.name || firebaseUser.displayName || firebaseUser.email.split('@')[0],
        displayName: firebaseUser.displayName,
        photoURL: firebaseUser.photoURL
      }

      return { success: true, user: user.value }
    } catch (error) {
      console.error('Google login error:', error)
      let errorMessage = 'Error al iniciar sesión con Google'
      
      if (error.code === 'auth/popup-closed-by-user') {
        errorMessage = 'Ventana de autenticación cerrada'
      } else if (error.code === 'auth/cancelled-popup-request') {
        errorMessage = 'Solicitud cancelada'
      }
      
      return { success: false, error: errorMessage }
    }
  }

  // Logout
  const logout = async () => {
    if (!process.client || !auth) {
      return { success: false, error: 'Firebase no está disponible' }
    }

    try {
      await signOut(auth)
      isAuthenticated.value = false
      user.value = null
      return { success: true }
    } catch (error) {
      console.error('Logout error:', error)
      return { success: false, error: 'Error al cerrar sesión' }
    }
  }

  // Check authentication state
  const checkAuth = () => {
    if (process.client && auth && db) {
      loading.value = true
      onAuthStateChanged(auth, async (firebaseUser) => {
        if (firebaseUser) {
          try {
            // Get user document from Firestore
            const userRef = doc(db, 'users', firebaseUser.uid)
            const userDoc = await getDoc(userRef)

            if (userDoc.exists()) {
              const userData = userDoc.data()
              isAuthenticated.value = true
              user.value = {
                uid: firebaseUser.uid,
                email: firebaseUser.email,
                name: userData.name || firebaseUser.displayName || firebaseUser.email.split('@')[0],
                displayName: userData.displayName,
                photoURL: userData.photoURL
              }
            } else {
              // Create user document if it doesn't exist
              const userData = await createUserDocument(firebaseUser)
              isAuthenticated.value = true
              user.value = {
                uid: firebaseUser.uid,
                email: firebaseUser.email,
                name: userData.name || firebaseUser.displayName || firebaseUser.email.split('@')[0],
                displayName: userData.displayName,
                photoURL: userData.photoURL
              }
            }
          } catch (error) {
            console.error('Error fetching user data:', error)
            isAuthenticated.value = false
            user.value = null
          }
        } else {
          isAuthenticated.value = false
          user.value = null
        }
        loading.value = false
      })
    }
  }

  // Initialize auth check on client
  if (process.client) {
    checkAuth()
  }

  return {
    isAuthenticated: readonly(isAuthenticated),
    user: readonly(user),
    loading: readonly(loading),
    register,
    login,
    loginWithGoogle,
    logout,
    checkAuth
  }
}

