<template>
    <div class="movies-page">
        <div v-if="error" class="error-container">
            <i class="pi pi-exclamation-triangle"></i>
            <p>{{ error }}</p>
        </div>

        <div v-else-if="loading && movies.length === 0" class="movies-grid">
            <MovieSkeleton v-for="n in 12" :key="n" />
        </div>

        <div v-else-if="movies.length > 0" class="movies-container">
            <div class="results-info">
                <h1>Movies</h1>
                <p>
                    <strong>{{ totalResults }}</strong> movies found
                    <span v-if="searchQuery"> for "{{ searchQuery }}"</span>
                </p>
            </div>

            <div class="movies-grid">
                <MovieCard v-for="movie in filteredMovies" :key="movie.imdbID" :movie="movie" />
            </div>
        </div>

        <div v-else-if="!loading" class="empty-state">
            <i class="pi pi-search" style="font-size: 4rem; color: var(--text-color-secondary)"></i>
            <h2>Search movies</h2>
            <p>Enter the name of a movie in the search bar to start</p>
        </div>
    </div>
</template>

<script setup>
definePageMeta({
    middleware: 'auth'
})

const route = useRoute()
const { searchMovies } = useOMDB()

const movies = ref([])
const loading = ref(true)
const error = ref(null)
const searchQuery = ref('')
const totalResults = ref(0)

// Filter to show only movies (not series)
const filteredMovies = computed(() => {
    return movies.value.filter(m => m.Type === 'movie' || !m.Type)
})

// Load default movies (20 random movies)
const loadDefaultMovies = async () => {
    loading.value = true
    error.value = null

    // Use getMoviesByGenre to get random movies
    const { getMoviesByGenre } = useOMDB()
    const result = await getMoviesByGenre('movies', 20)

    if (result.success) {
        movies.value = result.movies
        totalResults.value = result.movies.length
        searchQuery.value = ''
    } else {
        error.value = result.error
        movies.value = []
    }

    loading.value = false
}

// Search movies
const searchMoviesList = async (query) => {
    loading.value = true
    error.value = null
    searchQuery.value = query

    try {
        const result = await searchMovies(query, 1)
        if (result.success) {
            // Filter to only show movies
            movies.value = result.movies.filter(m => m.Type === 'movie' || !m.Type)
            totalResults.value = result.totalResults
        } else {
            error.value = result.error
            movies.value = []
        }
    } catch (err) {
        error.value = 'Error searching movies'
        movies.value = []
    }

    loading.value = false
}

onMounted(async () => {
    const searchParam = route.query.search
    if (searchParam) {
        await searchMoviesList(searchParam)
    } else {
        await loadDefaultMovies()
    }
})

watch(() => route.query.search, async (newSearch) => {
    if (newSearch) {
        await searchMoviesList(newSearch)
    } else {
        await loadDefaultMovies()
    }
})
</script>

<style scoped>
.movies-page {
    min-height: calc(100vh - 60px);
    padding: 2rem;
}

.results-info {
    margin-bottom: 1.5rem;
    color: #b3b3b3;
    font-size: 1.1rem;
}

.results-info strong {
    color: #ffffff;
}

.movies-container {
    margin-top: 2rem;
}

.movies-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 2rem;
    margin-bottom: 2rem;
}

.error-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 3rem;
    gap: 1rem;
    color: #e50914;
    background: rgba(229, 9, 20, 0.1);
    border-radius: 8px;
    border: 1px solid rgba(229, 9, 20, 0.3);
}

.error-container i {
    font-size: 3rem;
}

.empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 4rem 2rem;
    text-align: center;
    gap: 1rem;
    min-height: 60vh;
}

.empty-state h2 {
    margin: 0;
    color: #ffffff;
    font-size: 2rem;
}

.empty-state p {
    color: #b3b3b3;
    margin: 0;
    font-size: 1.1rem;
}

@media (max-width: 768px) {
    .movies-page {
        padding: 1rem;
    }

    .movies-grid {
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
        gap: 1rem;
    }
}
</style>