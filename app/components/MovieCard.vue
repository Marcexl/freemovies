<template>
    <Card class="movie-card" @click="goToDetail">
        <template #header>
            <div class="movie-poster">
                <img v-if="movie.Poster && movie.Poster !== 'N/A'" :src="movie.Poster" :alt="movie.Title"
                    loading="lazy" />
                <div v-else class="no-poster">
                    <i class="pi pi-image" style="font-size: 3rem"></i>
                    <p>Sin imagen</p>
                </div>
            </div>
        </template>
        <template #title>
            {{ movie.Title }}
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
const props = defineProps({
    movie: {
        type: Object,
        required: true
    }
})

const router = useRouter()

const goToDetail = () => {
    router.push(`/movies/${props.movie.imdbID}`)
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
