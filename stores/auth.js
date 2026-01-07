import { defineStore } from 'pinia'
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged
} from 'firebase/auth'
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore'
import { auth, db, googleProvider } from '../firebase.js'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    isAuthenticated: false,
    user: null,
    loading: true
  }),

  getters: {
    isLoggedIn: (state) => state.isAuthenticated,
    currentUser: (state) => state.user,
    isLoading: (state) => state.loading
  },

  actions: {
    // Create or update user document in Firestore
    async createUserDocument(firebaseUser, name = null) {
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
    },

    // Set user data
    setUser(userData) {
      this.user = userData
      this.isAuthenticated = !!userData
    },

    // Set loading state
    setLoading(loading) {
      this.loading = loading
    },

    // Register with email and password
    async register(email, password, name) {
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
        const userData = await this.createUserDocument(firebaseUser, name)

        // Update store state
        this.setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          name: userData.name,
          displayName: userData.displayName,
          photoURL: userData.photoURL
        })

        return { success: true, user: this.user }
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
    },

    // Login with email and password
    async login(email, password) {
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
          userData = await this.createUserDocument(firebaseUser)
        }

        // Update store state
        this.setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          name: userData.name || firebaseUser.email.split('@')[0],
          displayName: userData.displayName,
          photoURL: userData.photoURL
        })

        return { success: true, user: this.user }
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
    },

    // Login with Google
    async loginWithGoogle() {
      if (!process.client || !auth || !db || !googleProvider) {
        return { success: false, error: 'Firebase no está disponible' }
      }

      try {
        const result = await signInWithPopup(auth, googleProvider)
        const firebaseUser = result.user

        // Create or update user document in Firestore
        const userData = await this.createUserDocument(firebaseUser)

        // Update store state
        this.setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          name: userData.name || firebaseUser.displayName || firebaseUser.email.split('@')[0],
          displayName: firebaseUser.displayName,
          photoURL: userData.photoURL
        })

        return { success: true, user: this.user }
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
    },

    // Logout
    async logout() {
      if (!process.client || !auth) {
        return { success: false, error: 'Firebase no está disponible' }
      }

      try {
        await signOut(auth)
        this.setUser(null)
        return { success: true }
      } catch (error) {
        console.error('Logout error:', error)
        return { success: false, error: 'Error al cerrar sesión' }
      }
    },

    // Check authentication state
    checkAuth() {
      if (process.client && auth && db) {
        this.setLoading(true)
        onAuthStateChanged(auth, async (firebaseUser) => {
          if (firebaseUser) {
            try {
              // Get user document from Firestore
              const userRef = doc(db, 'users', firebaseUser.uid)
              const userDoc = await getDoc(userRef)

              if (userDoc.exists()) {
                const userData = userDoc.data()
                this.setUser({
                  uid: firebaseUser.uid,
                  email: firebaseUser.email,
                  name: userData.name || firebaseUser.displayName || firebaseUser.email.split('@')[0],
                  displayName: userData.displayName,
                  photoURL: userData.photoURL
                })
              } else {
                // Create user document if it doesn't exist
                const userData = await this.createUserDocument(firebaseUser)
                this.setUser({
                  uid: firebaseUser.uid,
                  email: firebaseUser.email,
                  name: userData.name || firebaseUser.displayName || firebaseUser.email.split('@')[0],
                  displayName: userData.displayName,
                  photoURL: userData.photoURL
                })
              }
            } catch (error) {
              console.error('Error fetching user data:', error)
              this.setUser(null)
            }
          } else {
            this.setUser(null)
          }
          this.setLoading(false)
        })
      }
    },

    // Initialize auth check
    init() {
      if (process.client) {
        this.checkAuth()
      }
    }
  }
})

