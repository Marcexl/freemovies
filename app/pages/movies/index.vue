<template>
    <div class="movies-page">
        <div class="page-header">
            <h1>
                <i class="pi pi-film"></i>
                Películas Disponibles
            </h1>
            <Button label="Cerrar Sesión" icon="pi pi-sign-out" severity="secondary" outlined @click="handleLogout" />
        </div>

        <SearchBar v-model="searchQuery" :loading="loading" @search="handleSearch" />

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
                    <strong>{{ totalResults }}</strong> películas encontradas
                    <span v-if="searchQuery"> para "{{ searchQuery }}"</span>
                </p>
            </div>

            <DataView :value="movies" layout="grid" :paginator="true" :rows="12" :first="(currentPage - 1) * 12"
                @page="onPageChange" :totalRecords="totalResults">
                <template #grid="slotProps">
                    <div class="movies-grid">
                        <MovieCard v-for="movie in slotProps.items" :key="movie.imdbID" :movie="movie" />
                    </div>
                </template>
            </DataView>
        </div>

        <div v-else-if="!loading" class="empty-state">
            <i class="pi pi-search" style="font-size: 4rem; color: var(--text-color-secondary)"></i>
            <h2>Busca películas</h2>
            <p>Ingresa el nombre de una película en el buscador para comenzar</p>
        </div>
    </div>
</template>

<script setup>
definePageMeta({
    middleware: 'auth'
})

const { movies, loading, error, searchQuery, currentPage, totalResults, search } = useMovies()
const { logout } = useAuth()
const router = useRouter()

const handleSearch = (query) => {
    if (query && query.trim()) {
        search(query, 1)
    }
}

const onPageChange = (event) => {
    const newPage = (event.first / event.rows) + 1
    if (searchQuery.value) {
        search(searchQuery.value, newPage)
    }
}

const handleLogout = () => {
    logout()
    router.push('/')
}
</script>

<style scoped>
.movies-page {
    min-height: 100vh;
    padding: 2rem;
    max-width: 1400px;
    margin: 0 auto;
}

.page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
    flex-wrap: wrap;
    gap: 1rem;
}

.page-header h1 {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin: 0;
    color: var(--primary-color);
    font-size: 2rem;
}

.results-info {
    margin-bottom: 1.5rem;
    color: var(--text-color-secondary);
}

.results-info strong {
    color: var(--primary-color);
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
    color: var(--red-500);
    background: var(--red-50);
    border-radius: var(--border-radius);
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
}

.empty-state h2 {
    margin: 0;
    color: var(--text-color);
}

.empty-state p {
    color: var(--text-color-secondary);
    margin: 0;
}

@media (max-width: 768px) {
    .movies-page {
        padding: 1rem;
    }

    .movies-grid {
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
        gap: 1rem;
    }

    .page-header h1 {
        font-size: 1.5rem;
    }
}
</style>
