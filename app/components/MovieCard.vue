<template>
    <Card class="movie-card">
        <template #header>
            <div class="movie-poster" @click="goToDetail">
                <img v-if="movie.Poster && movie.Poster !== 'N/A'" :src="movie.Poster" :alt="movie.Title"
                    loading="lazy" />
                <div v-else class="no-poster">
                    <i class="pi pi-image" style="font-size: 3rem"></i>
                    <p>No image</p>
                </div>
                <div class="card-overlay">
                    <Button 
                        :icon="isInList ? 'pi pi-check' : 'pi pi-plus'" 
                        :class="['add-to-list-btn', { 'in-list': isInList }]"
                        rounded 
                        :severity="isInList ? 'success' : 'secondary'"
                        @click.stop="toggleMyList"
                        v-tooltip.top="isInList ? 'Remove from My List' : 'Add to My List'"
                    />
                </div>
            </div>
        </template>
        <template #title>
            <div @click="goToDetail" style="cursor: pointer;">
                {{ movie.Title }}
            </div>
        </template>
        <template #content>
            <div class="movie-info">
                <p class="movie-year">
                    <i class="pi pi-calendar"></i>
                    {{ movie.Year }}
                </p>
                <p v-if="movie.Type" class="movie-type">
                    <i class="pi pi-tag"></i>
                    {{ movie.Type }}
                </p>
            </div>
        </template>
    </Card>
</template>

<script setup>
import { useMyList } from '../composables/useMyList'
import { useAuth } from '../composables/useAuth'

const props = defineProps({
    movie: {
        type: Object,
        required: true
    }
})

const router = useRouter()
const { user } = useAuth()
const { isInMyList, addToMyList, removeFromMyList } = useMyList()

const isInList = computed(() => {
    if (!user.value) return false
    return isInMyList(props.movie.imdbID)
})

const goToDetail = () => {
    // Route to series page if it's a series, otherwise movies page
    if (props.movie.Type === 'series') {
        router.push(`/series/${props.movie.imdbID}`)
    } else {
        router.push(`/movies/${props.movie.imdbID}`)
    }
}

const toggleMyList = async () => {
    if (!user.value) {
        // Could show a toast notification here
        return
    }

    if (isInList.value) {
        await removeFromMyList(props.movie.imdbID)
    } else {
        await addToMyList(props.movie)
    }
}
</script>

<style scoped>
.movie-card {
    cursor: pointer;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    height: 100%;
    display: flex;
    flex-direction: column;
}

.movie-card:hover {
    transform: translateY(-8px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
}

.movie-poster {
    width: 100%;
    height: 400px;
    overflow: hidden;
    background: var(--surface-ground);
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    cursor: pointer;
}

.movie-poster img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
}

.movie-card:hover .movie-poster img {
    transform: scale(1.05);
}

.card-overlay {
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
    opacity: 0;
    transition: opacity 0.3s ease;
    z-index: 10;
}

.movie-card:hover .card-overlay {
    opacity: 1;
}

.add-to-list-btn {
    width: 2.5rem;
    height: 2.5rem;
    background: rgba(0, 0, 0, 0.7);
    border: 2px solid rgba(255, 255, 255, 0.5);
    color: white;
    transition: all 0.2s ease;
}

.add-to-list-btn:hover {
    background: rgba(229, 9, 20, 0.9);
    border-color: var(--netflix-red);
    transform: scale(1.1);
}

.add-to-list-btn.in-list {
    background: rgba(76, 175, 80, 0.9);
    border-color: #4caf50;
}

.add-to-list-btn.in-list:hover {
    background: rgba(76, 175, 80, 1);
}

.no-poster {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: var(--text-color-secondary);
    height: 100%;
}

.movie-info {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.movie-year,
.movie-type {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin: 0;
    color: var(--text-color-secondary);
    font-size: 0.9rem;
}

.movie-year i,
.movie-type i {
    color: var(--primary-color);
}
</style>
