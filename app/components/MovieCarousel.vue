<template>
    <div class="movie-carousel">
        <div v-if="loading" class="carousel-loading">
            <MovieSkeleton v-for="n in 5" :key="n" class="skeleton-item" />
        </div>
        <Carousel v-else :value="movies" :numVisible="5" :numScroll="1" :responsiveOptions="responsiveOptions" circular
            :autoplayInterval="0" class="custom-carousel">
            <template #item="slotProps">
                <div class="carousel-item-wrapper">
                    <MovieCard :movie="slotProps.data" />
                </div>
            </template>
        </Carousel>
    </div>
</template>

<script setup>
import { breakpointsOptions } from '../composables/useBreakpoints'


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


const responsiveOptions = ref([
    {
        breakpoint: breakpointsOptions.desktop + 'px',
        numVisible: 5,
        numScroll: 1
    },
    {
        breakpoint: breakpointsOptions.laptop + 'px',
        numVisible: 4,
        numScroll: 1
    },
    {
        breakpoint: breakpointsOptions.tabletHorizontal + 'px',
        numVisible: 3,
        numScroll: 1
    },
    {
        breakpoint: breakpointsOptions.tabletVertical + 'px',
        numVisible: 2,
        numScroll: 1
    },
    {
        breakpoint: breakpointsOptions.mobile + 'px',
        numVisible: 1,
        numScroll: 1
    }
])
</script>

<style scoped>
.movie-carousel {
    width: 100%;
}

.carousel-loading {
    display: flex;
    gap: 1rem;
    overflow-x: hidden;
    padding: 0 0.5rem;
}

.skeleton-item {
    min-width: 250px;
}

.carousel-item-wrapper {
    padding: 0 0.5rem;
    height: 100%;
}

/* Customize PrimeVue Carousel Buttons */
:deep(.p-carousel-prev),
:deep(.p-carousel-next) {
    background: rgba(0, 0, 0, 0.6);
    color: white;
    width: 3rem;
    height: 3rem;
    border-radius: 50%;
    border: 1px solid rgba(255, 255, 255, 0.2);
    transition: all 0.2s ease;
    margin: 0 0.5rem;
    position: absolute;
    z-index: 2;
}

:deep(.p-carousel-prev) {
    left: 10px;
}

:deep(.p-carousel-next) {
    right: 10px;
}

:deep(.p-carousel-prev:hover),
:deep(.p-carousel-next:hover) {
    background: rgba(0, 0, 0, 0.9);
    border-color: var(--netflix-red);
    color: var(--netflix-red);
}

:deep(.p-carousel-prev:disabled),
:deep(.p-carousel-next:disabled) {
    opacity: 0;
    pointer-events: none;
}

/* Hide indicators/dots usually */
:deep(.p-carousel-indicators) {
    display: none;
}

/* Ensure container handles absolute buttons */
:deep(.p-carousel-content) {
    position: relative;
}
</style>
