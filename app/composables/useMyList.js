import { ref, computed, watch } from 'vue'
import { collection, doc, setDoc, deleteDoc, getDocs, query, where, serverTimestamp } from 'firebase/firestore'
import { db } from '../../firebase.js'
import { useAuth } from './useAuth'

export const useMyList = () => {
  const { user } = useAuth()
  const myList = ref([])
  const loading = ref(false)
  const error = ref(null)

  // Check if an item is in the user's list
  const isInMyList = (imdbID) => {
    if (!user.value || !imdbID) return false
    return myList.value.some(item => item.imdbID === imdbID)
  }

  // Load user's mylist from Firestore
  const loadMyList = async () => {
    if (!import.meta.client || !db || !user.value) {
      return
    }

    loading.value = true
    error.value = null

    try {
      const myListRef = collection(db, 'mylist')
      const q = query(myListRef, where('userId', '==', user.value.uid))
      const querySnapshot = await getDocs(q)

      myList.value = []
      querySnapshot.forEach((doc) => {
        myList.value.push(doc.data())
      })
    } catch (err) {
      console.error('Error loading mylist:', err)
      error.value = 'Error loading your list'
    } finally {
      loading.value = false
    }
  }

  // Add item to mylist
  const addToMyList = async (item) => {
    if (!import.meta.client || !db || !user.value) {
      error.value = 'You must be logged in to add items to your list'
      return { success: false, error: error.value }
    }

    if (isInMyList(item.imdbID)) {
      return { success: false, error: 'Item already in your list' }
    }

    loading.value = true
    error.value = null

    try {
      const myListRef = collection(db, 'mylist')
      const itemRef = doc(myListRef, `${user.value.uid}_${item.imdbID}`)

      await setDoc(itemRef, {
        userId: user.value.uid,
        imdbID: item.imdbID,
        title: item.Title,
        year: item.Year,
        type: item.Type || 'movie',
        poster: item.Poster || null,
        addedAt: serverTimestamp()
      })

      // Add to local state
      myList.value.push({
        userId: user.value.uid,
        imdbID: item.imdbID,
        title: item.Title,
        year: item.Year,
        type: item.Type || 'movie',
        poster: item.Poster || null
      })

      return { success: true }
    } catch (err) {
      console.error('Error adding to mylist:', err)
      error.value = 'Error adding item to your list'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  // Remove item from mylist
  const removeFromMyList = async (imdbID) => {
    if (!import.meta.client || !db || !user.value) {
      error.value = 'You must be logged in to remove items from your list'
      return { success: false, error: error.value }
    }

    loading.value = true
    error.value = null

    try {
      const itemRef = doc(db, 'mylist', `${user.value.uid}_${imdbID}`)
      await deleteDoc(itemRef)

      // Remove from local state
      myList.value = myList.value.filter(item => item.imdbID !== imdbID)

      return { success: true }
    } catch (err) {
      console.error('Error removing from mylist:', err)
      error.value = 'Error removing item from your list'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  // Auto-load mylist when user is available
  watch(() => user.value, (newUser) => {
    if (newUser && import.meta.client) {
      loadMyList()
    } else {
      myList.value = []
    }
  }, { immediate: true })

  return {
    myList: computed(() => myList.value),
    loading: computed(() => loading.value),
    error: computed(() => error.value),
    isInMyList,
    loadMyList,
    addToMyList,
    removeFromMyList
  }
}
