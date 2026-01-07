import { useMoviesStore } from '../stores/movies'

export const useMovies = () => {
  const moviesStore = useMoviesStore()

  return {
    // State (computed from store)
    movies: computed(() => moviesStore.movies),
    currentMovie: computed(() => moviesStore.currentMovie),
    loading: computed(() => moviesStore.loading),
    error: computed(() => moviesStore.error),
    searchQuery: computed(() => moviesStore.searchQuery),
    currentPage: computed(() => moviesStore.currentPage),
    totalResults: computed(() => moviesStore.totalResults),
    
    // Actions (delegated to store)
    search: (query, page) => moviesStore.search(query, page),
    fetchMovieDetail: (imdbID) => moviesStore.fetchMovieDetail(imdbID),
    clearMovies: () => moviesStore.clearMovies()
  }
}

