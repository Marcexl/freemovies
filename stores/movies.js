import { defineStore } from 'pinia'

export const useMoviesStore = defineStore('movies', {
  state: () => ({
    movies: [],
    currentMovie: null,
    loading: false,
    error: null,
    searchQuery: '',
    currentPage: 1,
    totalResults: 0
  }),

  getters: {
    hasMovies: (state) => state.movies.length > 0,
    hasError: (state) => !!state.error,
    isEmpty: (state) => !state.loading && state.movies.length === 0 && !state.searchQuery
  },

  actions: {
    // Set movies
    setMovies(movies) {
      this.movies = movies
    },

    // Set current movie
    setCurrentMovie(movie) {
      this.currentMovie = movie
    },

    // Set loading state
    setLoading(loading) {
      this.loading = loading
    },

    // Set error
    setError(error) {
      this.error = error
    },

    // Set search query
    setSearchQuery(query) {
      this.searchQuery = query
    },

    // Set current page
    setCurrentPage(page) {
      this.currentPage = page
    },

    // Set total results
    setTotalResults(total) {
      this.totalResults = total
    },

    // Search movies
    async search(query, page = 1) {
      const { searchMovies } = useOMDB()

      if (!query || query.trim() === '') {
        this.movies = []
        this.searchQuery = ''
        return
      }

      this.loading = true
      this.error = null
      this.searchQuery = query
      this.currentPage = page

      try {
        const result = await searchMovies(query, page)
        
        if (result.success) {
          this.movies = result.movies
          this.totalResults = result.totalResults
        } else {
          this.error = result.error
          this.movies = []
        }
      } catch (error) {
        console.error('Search error:', error)
        this.error = 'Error al buscar películas'
        this.movies = []
      } finally {
        this.loading = false
      }
    },

    // Fetch movie detail
    async fetchMovieDetail(imdbID) {
      const { getMovieById } = useOMDB()

      this.loading = true
      this.error = null

      try {
        const result = await getMovieById(imdbID)
        
        if (result.success) {
          this.currentMovie = result.movie
        } else {
          this.error = result.error
          this.currentMovie = null
        }
      } catch (error) {
        console.error('Fetch movie detail error:', error)
        this.error = 'Error al obtener detalles de la película'
        this.currentMovie = null
      } finally {
        this.loading = false
      }
    },

    // Clear movies
    clearMovies() {
      this.movies = []
      this.currentMovie = null
      this.searchQuery = ''
      this.currentPage = 1
      this.totalResults = 0
      this.error = null
    }
  }
})

