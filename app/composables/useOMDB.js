// Composable para interactuar con la API de OMDB
export const useOMDB = () => {
  const config = useRuntimeConfig()
  const apiKey = config.public.omdbApiKey || process.env.OMDB_API_KEY || 'demo'
  const baseUrl = 'https://www.omdbapi.com'

  const searchMovies = async (query, page = 1) => {
    try {
      const response = await $fetch(`${baseUrl}/`, {
        params: {
          apikey: apiKey,
          s: query,
          page: page,
          type: 'movie'
        }
      })

      if (response.Response === 'True') {
        return {
          movies: response.Search || [],
          totalResults: parseInt(response.totalResults) || 0,
          success: true
        }
      } else {
        return {
          movies: [],
          totalResults: 0,
          success: false,
          error: response.Error || 'No se encontraron películas'
        }
      }
    } catch (error) {
      console.error('Error al buscar películas:', error)
      return {
        movies: [],
        totalResults: 0,
        success: false,
        error: 'Error al conectar con la API'
      }
    }
  }

  const getMovieById = async (imdbID) => {
    try {
      const response = await $fetch(`${baseUrl}/`, {
        params: {
          apikey: apiKey,
          i: imdbID,
          plot: 'full'
        }
      })

      if (response.Response === 'True') {
        return {
          movie: response,
          success: true
        }
      } else {
        return {
          movie: null,
          success: false,
          error: response.Error || 'Película no encontrada'
        }
      }
    } catch (error) {
      console.error('Error al obtener película:', error)
      return {
        movie: null,
        success: false,
        error: 'Error al conectar con la API'
      }
    }
  }

  // Get movies by genre (using genre keywords in search)
  const getMoviesByGenre = async (genre, limit = 10) => {
    // Genre search terms
    const genreTerms = {
      'movies': ['action', 'adventure', 'drama'],
      'series': ['series', 'tv'],
      'suspense': ['thriller', 'suspense', 'mystery'],
      'terror': ['horror', 'terror', 'scary']
    }

    const searchTerms = genreTerms[genre.toLowerCase()] || [genre]
    const allMovies = []

    try {
      for (const term of searchTerms) {
        const result = await searchMovies(term, 1)
        if (result.success && result.movies.length > 0) {
          allMovies.push(...result.movies)
        }
        await new Promise(resolve => setTimeout(resolve, 200))
      }

      // Remove duplicates and limit
      const uniqueMovies = allMovies.filter((movie, index, self) =>
        index === self.findIndex(m => m.imdbID === movie.imdbID)
      ).slice(0, limit)

      return {
        movies: uniqueMovies,
        success: true
      }
    } catch (error) {
      console.error(`Error getting ${genre} movies:`, error)
      return {
        movies: [],
        success: false,
        error: `Error al obtener películas de ${genre}`
      }
    }
  }

  // Get series
  const getSeries = async (limit = 10) => {
    try {
      const response = await $fetch(`${baseUrl}/`, {
        params: {
          apikey: apiKey,
          s: 'series',
          type: 'series',
          page: 1
        }
      })

      if (response.Response === 'True') {
        return {
          movies: (response.Search || []).slice(0, limit),
          success: true
        }
      } else {
        return {
          movies: [],
          success: false,
          error: response.Error || 'No se encontraron series'
        }
      }
    } catch (error) {
      console.error('Error getting series:', error)
      return {
        movies: [],
        success: false,
        error: 'Error al conectar con la API'
      }
    }
  }

  return {
    searchMovies,
    getMovieById,
    getMoviesByGenre,
    getSeries
  }
}

