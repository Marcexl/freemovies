<template>
    <div class="series-page">
        <div v-if="error" class="error-container">
            <i class="pi pi-exclamation-triangle"></i>
            <p>{{ error }}</p>
        </div>

        <div v-else-if="loading && series.length === 0" class="series-grid">
            <MovieSkeleton v-for="n in 12" :key="n" />
        </div>

        <div v-else-if="series.length > 0" class="series-container">
            <div class="results-info">
                <p>
                    <strong>{{ totalResults }}</strong> series found
                    <span v-if="searchQuery"> for "{{ searchQuery }}"</span>
                </p>
            </div>

            <DataView :value="series" layout="grid" :paginator="true" :rows="12" :first="(currentPage - 1) * 12"
                @page="onPageChange" :totalRecords="totalResults">
                <template #grid="slotProps">
                    <div class="series-grid">
                        <MovieCard v-for="item in slotProps.items" :key="item.imdbID" :movie="item" />
                    </div>
                </template>
            </DataView>
        </div>

        <div v-else-if="!loading" class="empty-state">
            <i class="pi pi-tv" style="font-size: 4rem; color: var(--text-color-secondary)"></i>
            <h2>Browse Series</h2>
            <p>Use the search bar to find your favorite series</p>
        </div>
    </div>
</template>

<script setup>
definePageMeta({
    middleware: 'auth',
    layout: 'default'
})

const route = useRoute()
const { getSeries, searchMovies } = useOMDB()

const series = ref([])
const loading = ref(true)
const error = ref(null)
const searchQuery = ref('')
const currentPage = ref(1)
const totalResults = ref(0)

onMounted(async () => {
    const searchParam = route.query.search
    if (searchParam) {
        await searchSeries(searchParam, 1)
    } else {
        await loadSeries()
    }
})

watch(() => route.query.search, async (newSearch) => {
    if (newSearch) {
        await searchSeries(newSearch, 1)
    } else {
        await loadSeries()
    }
})

const loadSeries = async () => {
    loading.value = true
    error.value = null
    const result = await getSeries(50) // Load more for pagination
    if (result.success) {
        series.value = result.movies
        totalResults.value = result.movies.length
    } else {
        error.value = result.error
        series.value = []
    }
    loading.value = false
}

const searchSeries = async (query, page = 1) => {
    loading.value = true
    error.value = null
    searchQuery.value = query
    currentPage.value = page

    try {
        const result = await searchMovies(query, page)
        if (result.success) {
            // Filter to only show series
            series.value = result.movies.filter(m => m.Type === 'series')
            totalResults.value = result.totalResults
        } else {
            error.value = result.error
            series.value = []
        }
    } catch (err) {
        error.value = 'Error searching series'
        series.value = []
    }
    
    loading.value = false
}

const onPageChange = (event) => {
    const newPage = (event.first / event.rows) + 1
    if (searchQuery.value) {
        searchSeries(searchQuery.value, newPage)
    }
}
</script>

<style scoped>
.series-page {
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

.series-container {
    margin-top: 2rem;
}

.series-grid {
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
    .series-page {
        padding: 1rem;
    }

    .series-grid {
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
        gap: 1rem;
    }
}
</style>
