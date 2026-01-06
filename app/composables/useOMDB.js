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

  return {
    searchMovies,
    getMovieById
  }
}

