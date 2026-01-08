<template>
    <div class="movie-carousel">
        <div v-if="loading" class="carousel-loading">
            <MovieSkeleton v-for="n in 10" :key="n" class="carousel-item" />
        </div>
        <div v-else-if="movies.length > 0" class="carousel-wrapper">
            <Button 
                icon="pi pi-chevron-left" 
                class="carousel-nav carousel-nav-left"
                text
                rounded
                @click="scrollLeft"
                :disabled="scrollPosition === 0"
            />
            <div class="carousel-container" ref="carouselRef">
                <div class="carousel-track" :style="{ transform: `translateX(-${scrollPosition}px)` }">
                    <div 
                        v-for="movie in movies" 
                        :key="movie.imdbID" 
                        class="carousel-item"
                    >
                        <MovieCard :movie="movie" />
                    </div>
                </div>
            </div>
            <Button 
                icon="pi pi-chevron-right" 
                class="carousel-nav carousel-nav-right"
                text
                rounded
                @click="scrollRight"
                :disabled="isAtEnd"
            />
        </div>
    </div>
</template>

<script setup>
const props = defineProps({
    movies: {
        type: Array,
        default: () => []
    },
    loading: {
        type: Boolean,
        default: false
    }
})

const carouselRef = ref(null)
const scrollPosition = ref(0)
const itemWidth = 280
const gap = 16
const visibleItems = 5
const scrollAmount = (itemWidth + gap) * 2

const isAtEnd = computed(() => {
    if (!carouselRef.value) return false
    const maxScroll = (props.movies.length - visibleItems) * (itemWidth + gap)
    return scrollPosition.value >= maxScroll
})

const scrollLeft = () => {
    scrollPosition.value = Math.max(0, scrollPosition.value - scrollAmount)
}

const scrollRight = () => {
    const maxScroll = (props.movies.length - visibleItems) * (itemWidth + gap)
    scrollPosition.value = Math.min(maxScroll, scrollPosition.value + scrollAmount)
}
</script>

<style scoped>
.movie-carousel {
    position: relative;
    width: 100%;
}

.carousel-loading {
    display: flex;
    gap: 1rem;
    overflow-x: auto;
    padding: 1rem 0;
}

.carousel-wrapper {
    position: relative;
    display: flex;
    align-items: center;
    gap: 1rem;
}

.carousel-container {
    flex: 1;
    overflow: hidden;
    position: relative;
}

.carousel-track {
    display: flex;
    gap: 1rem;
    transition: transform 0.5s ease;
    will-change: transform;
}

.carousel-item {
    flex: 0 0 280px;
    min-width: 280px;
}

.carousel-nav {
    width: 3rem;
    height: 3rem;
    color: #ffffff;
    background: rgba(0, 0, 0, 0.5);
    border: 1px solid rgba(255, 255, 255, 0.2);
    z-index: 2;
    flex-shrink: 0;
}

.carousel-nav:hover:not(:disabled) {
    background: rgba(0, 0, 0, 0.7);
    border-color: var(--netflix-red);
}

.carousel-nav:disabled {
    opacity: 0.3;
    cursor: not-allowed;
}

@media (max-width: 768px) {
    .carousel-item {
        flex: 0 0 200px;
        min-width: 200px;
    }

    .carousel-nav {
        width: 2.5rem;
        height: 2.5rem;
    }
}
</style>
