export const useMovies = () => {
  const { searchMovies, getMovieById } = useOMDB()
  
  const movies = useState('movies', () => [])
  const currentMovie = useState('currentMovie', () => null)
  const loading = useState('moviesLoading', () => false)
  const error = useState('moviesError', () => null)
  const searchQuery = useState('searchQuery', () => '')
  const currentPage = useState('currentPage', () => 1)
  const totalResults = useState('totalResults', () => 0)

  const search = async (query, page = 1) => {
    if (!query || query.trim() === '') {
      movies.value = []
      return
    }

    loading.value = true
    error.value = null
    searchQuery.value = query
    currentPage.value = page

    const result = await searchMovies(query, page)
    
    if (result.success) {
      movies.value = result.movies
      totalResults.value = result.totalResults
    } else {
      error.value = result.error
      movies.value = []
    }
    
    loading.value = false
  }

  const fetchMovieDetail = async (imdbID) => {
    loading.value = true
    error.value = null

    const result = await getMovieById(imdbID)
    
    if (result.success) {
      currentMovie.value = result.movie
    } else {
      error.value = result.error
      currentMovie.value = null
    }
    
    loading.value = false
  }

  const clearMovies = () => {
    movies.value = []
    currentMovie.value = null
    searchQuery.value = ''
    currentPage.value = 1
    totalResults.value = 0
    error.value = null
  }

  return {
    movies: readonly(movies),
    currentMovie: readonly(currentMovie),
    loading: readonly(loading),
    error: readonly(error),
    searchQuery: readonly(searchQuery),
    currentPage: readonly(currentPage),
    totalResults: readonly(totalResults),
    search,
    fetchMovieDetail,
    clearMovies
  }
}

