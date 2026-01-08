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
                <p>
                    <strong>{{ totalResults }}</strong> movies found
                    <span v-if="searchQuery"> for "{{ searchQuery }}"</span>
                </p>
            </div>

            <DataView :value="filteredMovies" layout="grid" :paginator="true" :rows="12" :first="(currentPage - 1) * 12"
                @page="onPageChange" :totalRecords="filteredTotalResults">
                <template #grid="slotProps">
                    <div class="movies-grid">
                        <MovieCard v-for="movie in slotProps.items" :key="movie.imdbID" :movie="movie" />
                    </div>
                </template>
            </DataView>
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
    middleware: 'auth',
    layout: 'default'
})

const route = useRoute()
const { movies, loading, error, searchQuery, currentPage, totalResults, search } = useMovies()

// Filter to show only movies (not series)
const filteredMovies = computed(() => {
    return movies.value.filter(m => m.Type === 'movie' || !m.Type)
})

const filteredTotalResults = computed(() => {
    // Adjust total results based on filtered count
    if (filteredMovies.value.length < movies.value.length) {
        return filteredMovies.value.length
    }
    return totalResults.value
})

// Handle search from query params (when coming from layout search)
onMounted(() => {
    const searchParam = route.query.search
    if (searchParam && searchParam !== searchQuery.value) {
        search(searchParam, 1)
    }
})

// Watch for route query changes
watch(() => route.query.search, (newSearch) => {
    if (newSearch && newSearch !== searchQuery.value) {
        search(newSearch, 1)
    }
})

const onPageChange = (event) => {
    const newPage = (event.first / event.rows) + 1
    if (searchQuery.value) {
        search(searchQuery.value, newPage)
    }
}
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
