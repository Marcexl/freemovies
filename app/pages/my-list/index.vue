<template>
    <div class="my-list-page">
        <div v-if="error" class="error-container">
            <i class="pi pi-exclamation-triangle"></i>
            <p>{{ error }}</p>
        </div>

        <div v-else-if="loading && myListItems.length === 0" class="my-list-grid">
            <MovieSkeleton v-for="n in 12" :key="n" />
        </div>

        <div v-else-if="myListItems.length > 0" class="my-list-container">
            <div class="results-info">
                <p>
                    <strong>{{ myListItems.length }}</strong> {{ myListItems.length === 1 ? 'item' : 'items' }} in your
                    list
                </p>
            </div>

            <div class="my-list-grid">
                <MovieCard v-for="item in myListItems" :key="item.imdbID" :movie="item" />
            </div>
        </div>

        <div v-else-if="!loading" class="empty-state">
            <i class="pi pi-bookmark" style="font-size: 4rem; color: var(--text-color-secondary)"></i>
            <h2>Your list is empty</h2>
            <p>Start adding movies and series to your list by clicking the + icon on any card</p>
        </div>
    </div>
</template>

<script setup>
import { useMyList } from '../../composables/useMyList'

definePageMeta({
    middleware: 'auth'
})

const { myList, loading, error, loadMyList } = useMyList()

// Convert myList items to MovieCard format
const myListItems = computed(() => {
    return myList.value.map(item => ({
        imdbID: item.imdbID,
        Title: item.title,
        Year: item.year,
        Type: item.type,
        Poster: item.poster
    }))
})

// Load list on mount
onMounted(async () => {
    await loadMyList()
})
</script>

<style scoped>
.my-list-page {
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

.my-list-container {
    margin-top: 2rem;
}

.my-list-grid {
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
    .my-list-page {
        padding: 1rem;
    }

    .my-list-grid {
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
        gap: 1rem;
    }
}
</style>