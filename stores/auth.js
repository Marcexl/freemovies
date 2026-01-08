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
    user: null,              // { uid, email, name, displayName, photoURL }
    loading: true,           // true hasta que Firebase responda
    unsubscribeAuth: null    // para evitar listeners duplicados
  }),

  getters: {
    isAuthenticated: (state) => !!state.user,
    currentUser: (state) => state.user,
    isLoading: (state) => state.loading
  },

  actions: {
    setUser(userData) {
      this.user = userData
    },

    setLoading(value) {
      this.loading = value
    },

    async createOrUpdateUserDoc(firebaseUser, name = null) {
      if (!db) throw new Error('Firestore no está disponible')

      const userRef = doc(db, 'users', firebaseUser.uid)
      const snap = await getDoc(userRef)

      if (!snap.exists()) {
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
        await setDoc(userRef, { updatedAt: serverTimestamp() }, { merge: true })
      }

      const updated = await getDoc(userRef)
      return updated.data()
    },

    async loadUserData(firebaseUser) {
      if (!db) throw new Error('Firestore no está disponible')

      const userRef = doc(db, 'users', firebaseUser.uid)
      const snap = await getDoc(userRef)

      let userData
      if (snap.exists()) {
        userData = snap.data()
      } else {
        userData = await this.createOrUpdateUserDoc(firebaseUser)
      }

      this.setUser({
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        name: userData.name || firebaseUser.displayName || firebaseUser.email.split('@')[0],
        displayName: userData.displayName || firebaseUser.displayName || null,
        photoURL: userData.photoURL || firebaseUser.photoURL || null
      })
    },

    // ========= AUTH FLOWS =========

    async register(email, password, name) {
      if (!import.meta.client || !auth || !db) {
        return { success: false, error: 'Firebase no está disponible' }
      }

      try {
        const cred = await createUserWithEmailAndPassword(auth, email, password)
        await this.createOrUpdateUserDoc(cred.user, name)
        // onAuthStateChanged va a setear el user + loading
        return { success: true }
      } catch (error) {
        let msg = 'Error al registrar usuario'
        if (error.code === 'auth/email-already-in-use') msg = 'Este email ya está registrado'
        if (error.code === 'auth/invalid-email') msg = 'Email inválido'
        if (error.code === 'auth/weak-password') msg = 'La contraseña es muy débil'
        return { success: false, error: msg }
      }
    },

    async login(email, password) {
      if (!import.meta.client || !auth || !db) {
        return { success: false, error: 'Firebase no está disponible' }
      }

      try {
        await signInWithEmailAndPassword(auth, email, password)
        // onAuthStateChanged va a setear el user + loading
        return { success: true }
      } catch (error) {
        let msg = 'Error al iniciar sesión'
        if (error.code === 'auth/user-not-found') msg = 'Usuario no encontrado'
        if (error.code === 'auth/wrong-password') msg = 'Contraseña incorrecta'
        if (error.code === 'auth/invalid-email') msg = 'Email inválido'
        if (error.code === 'auth/invalid-credential') msg = 'Credenciales inválidas'
        return { success: false, error: msg }
      }
    },

    async loginWithGoogle() {
      if (!import.meta.client || !auth || !db || !googleProvider) {
        return { success: false, error: 'Firebase no está disponible' }
      }

      try {
        const result = await signInWithPopup(auth, googleProvider)
        await this.createOrUpdateUserDoc(result.user)
        // onAuthStateChanged va a setear el user + loading
        return { success: true }
      } catch (error) {
        let msg = 'Error al iniciar sesión con Google'
        if (error.code === 'auth/popup-closed-by-user') msg = 'Ventana de autenticación cerrada'
        if (error.code === 'auth/cancelled-popup-request') msg = 'Solicitud cancelada'
        return { success: false, error: msg }
      }
    },

    async logout() {
      if (!import.meta.client || !auth) {
        return { success: false, error: 'Firebase no está disponible' }
      }

      try {
        await signOut(auth)
        // onAuthStateChanged va a dejar user=null
        return { success: true }
      } catch (error) {
        return { success: false, error: 'Error al cerrar sesión' }
      }
    },

    // ========= SESSION RESTORE =========

    init() {
      if (!import.meta.client || !auth) {
        this.setLoading(false)
        return
      }

      // evitar doble listener
      if (this.unsubscribeAuth) return

      this.setLoading(true)

      this.unsubscribeAuth = onAuthStateChanged(auth, async (firebaseUser) => {
        try {
          if (firebaseUser) {
            await this.loadUserData(firebaseUser)
          } else {
            this.setUser(null)
          }
        } catch (e) {
          console.error('Auth init error:', e)
          this.setUser(null)
        } finally {
          this.setLoading(false)
        }
      })
    }
  }
})
