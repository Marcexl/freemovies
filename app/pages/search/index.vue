<template>
    <div class="search-page">
        <div class="search-header">
            <h1>Search Results for "{{ searchQuery }}"</h1>
            <p v-if="totalResults > 0">Found {{ totalResults }} results</p>
        </div>

        <div v-if="loading" class="loading-state">
            <i class="pi pi-spin pi-spinner" style="font-size: 2rem"></i>
        </div>

        <div v-else-if="error" class="error-state">
            <i class="pi pi-exclamation-circle"></i>
            <p>{{ error }}</p>
            <Button label="Try Again" @click="performSearch" />
        </div>

        <div v-else-if="movies.length === 0" class="empty-state">
            <i class="pi pi-search"></i>
            <p>No results found for "{{ searchQuery }}"</p>
        </div>

        <div v-else class="results-container">
            <div class="movies-grid">
                <MovieCard v-for="movie in movies" :key="movie.imdbID" :movie="movie" />
            </div>

            <Paginator v-if="totalResults > 10" :rows="10" :totalRecords="totalResults" :first="(currentPage - 1) * 10"
                @page="onPageChange" class="custom-paginator"
                template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink" />
        </div>
    </div>
</template>

<script setup>
const route = useRoute()
const router = useRouter()
const { searchMovies } = useOMDB()

const movies = ref([])
const totalResults = ref(0)
const loading = ref(false)
const error = ref(null)

// Computed property for easy access to query params
const searchQuery = computed(() => route.query.q || '')
const currentPage = computed(() => parseInt(route.query.page) || 1)

// Perform search based on current route params
const performSearch = async () => {
    if (!searchQuery.value) return

    loading.value = true
    error.value = null

    try {
        const result = await searchMovies(searchQuery.value, currentPage.value)
        if (result.success) {
            movies.value = result.movies
            totalResults.value = result.totalResults
        } else {
            error.value = result.error
            movies.value = []
            totalResults.value = 0
        }
    } catch (e) {
        error.value = 'An unexpected error occurred'
        console.error(e)
    } finally {
        loading.value = false
    }
}

// Handle page change from Paginator
const onPageChange = (event) => {
    // PrimeVue Paginator uses 0-based index for 'page', but we want 1-based for API/URL
    // However, event.page is 0-based index of the new page.
    // event.first is the index of the first record
    // We can use event.page + 1
    const newPage = event.page + 1

    router.push({
        path: '/search',
        query: {
            ...route.query,
            page: newPage
        }
    })

    // Scroll to top of results on page change
    window.scrollTo({ top: 0, behavior: 'smooth' })
}

// Watch for changes in route query to trigger search
watch(
    () => [route.query.q, route.query.page],
    () => {
        performSearch()
    },
    { immediate: true }
)

// Update page title
useHead({
    title: computed(() => `Search: ${searchQuery.value}`)
})
</script>

<style scoped>
.search-page {
    padding: 2rem 0;
}

.search-header {
    margin-bottom: 2rem;
    color: var(--netflix-white);
}

.search-header h1 {
    font-size: 2.5rem;
    margin-bottom: 0.5rem;
}

.search-header p {
    color: var(--netflix-light-gray);
    font-size: 1.1rem;
}

.movies-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 2rem;
    margin-bottom: 3rem;
}

.loading-state,
.error-state,
.empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 4rem;
    text-align: center;
    color: var(--netflix-light-gray);
    gap: 1rem;
}

.loading-state i,
.error-state i,
.empty-state i {
    font-size: 3rem;
    color: var(--netflix-red);
    margin-bottom: 1rem;
}

.custom-paginator {
    background: transparent;
    border: none;
    margin-top: 2rem;
}

:deep(.p-paginator) {
    background: transparent;
    color: var(--netflix-white);
}

:deep(.p-paginator-page),
:deep(.p-paginator-first),
:deep(.p-paginator-prev),
:deep(.p-paginator-next),
:deep(.p-paginator-last) {
    background: transparent;
    color: var(--netflix-white);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 4px;
    margin: 0 0.25rem;
    transition: all 0.2s ease;
}

:deep(.p-paginator-page:hover),
:deep(.p-paginator-first:hover),
:deep(.p-paginator-prev:hover),
:deep(.p-paginator-next:hover),
:deep(.p-paginator-last:hover) {
    background: rgba(255, 255, 255, 0.1);
    color: var(--netflix-white);
    border-color: rgba(255, 255, 255, 0.3);
}

:deep(.p-paginator-page.p-highlight) {
    background: var(--netflix-red);
    border-color: var(--netflix-red);
    color: white;
}
</style>
