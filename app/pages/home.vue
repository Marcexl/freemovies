<template>
    <div class="homepage">
        <!-- Hero Slider -->
        <div v-if="heroMovies.length > 0" class="hero-slider">
            <Carousel :value="heroMovies" :numVisible="1" :numScroll="1" :autoplayInterval="5000" :circular="true"
                :showIndicators="true" :showNavigators="true" class="hero-carousel">
                <template #item="slotProps">
                    <div class="hero-slide" @click="goToMovie(slotProps.data.imdbID)">
                        <div class="hero-backdrop">
                            <img v-if="slotProps.data.Poster && slotProps.data.Poster !== 'N/A'"
                                :src="slotProps.data.Poster" :alt="slotProps.data.Title" />
                            <div v-else class="hero-placeholder">
                                <i class="pi pi-film" style="font-size: 5rem"></i>
                            </div>
                        </div>
                        <div class="hero-content">
                            <h1 class="hero-title">{{ slotProps.data.Title }}</h1>
                            <p v-if="slotProps.data.Plot && slotProps.data.Plot !== 'N/A'" class="hero-plot">
                                {{ slotProps.data.Plot.substring(0, 150) }}...
                            </p>
                            <div class="hero-meta">
                                <span v-if="slotProps.data.Year">
                                    <i class="pi pi-calendar"></i> {{ slotProps.data.Year }}
                                </span>
                                <span v-if="slotProps.data.imdbRating && slotProps.data.imdbRating !== 'N/A'">
                                    <i class="pi pi-star"></i> {{ slotProps.data.imdbRating }}
                                </span>
                                <span v-if="slotProps.data.Runtime && slotProps.data.Runtime !== 'N/A'">
                                    <i class="pi pi-clock"></i> {{ slotProps.data.Runtime }}
                                </span>
                            </div>
                            <Button label="Watch Now" icon="pi pi-play" class="hero-button" />
                        </div>
                    </div>
                </template>
            </Carousel>
        </div>

        <!-- Genre Carousels -->
        <div class="carousels-container">
            <!-- Movies Carousel -->
            <div class="carousel-section">
                <h2 class="carousel-title">Movies</h2>
                <MovieCarousel :movies="moviesList" :loading="loadingMovies" />
            </div>

            <!-- Series Carousel -->
            <div class="carousel-section">
                <h2 class="carousel-title">Series</h2>
                <MovieCarousel :movies="seriesList" :loading="loadingSeries" />
            </div>

            <!-- Suspense Carousel -->
            <div class="carousel-section">
                <h2 class="carousel-title">Suspense</h2>
                <MovieCarousel :movies="suspenseList" :loading="loadingSuspense" />
            </div>

            <!-- Terror Carousel -->
            <div class="carousel-section">
                <h2 class="carousel-title">Terror</h2>
                <MovieCarousel :movies="terrorList" :loading="loadingTerror" />
            </div>
        </div>
    </div>
</template>

<script setup>
definePageMeta({
    middleware: 'auth',
    layout: 'default'
})

const router = useRouter()
const { getMoviesByGenre, getSeries, getMovieById } = useOMDB()

const heroMovies = ref([])
const moviesList = ref([])
const seriesList = ref([])
const suspenseList = ref([])
const terrorList = ref([])

const loadingHero = ref(true)
const loadingMovies = ref(true)
const loadingSeries = ref(true)
const loadingSuspense = ref(true)
const loadingTerror = ref(true)

onMounted(async () => {
    await Promise.all([
        loadMovies(),
        loadSeries(),
        loadSuspense(),
        loadTerror()
    ])
    
    // After all carousels load, create hero from random items
    createHeroFromCarousels()
})

const createHeroFromCarousels = async () => {
    loadingHero.value = true
    const heroItems = []
    
    // Pick one random from each category
    if (moviesList.value.length > 0) {
        const randomMovie = moviesList.value[Math.floor(Math.random() * moviesList.value.length)]
        const fullDetails = await getMovieById(randomMovie.imdbID)
        if (fullDetails.success) {
            heroItems.push(fullDetails.movie)
        } else {
            heroItems.push(randomMovie)
        }
    }
    
    if (seriesList.value.length > 0) {
        const randomSeries = seriesList.value[Math.floor(Math.random() * seriesList.value.length)]
        const fullDetails = await getMovieById(randomSeries.imdbID)
        if (fullDetails.success) {
            heroItems.push(fullDetails.movie)
        } else {
            heroItems.push(randomSeries)
        }
    }
    
    if (suspenseList.value.length > 0) {
        const randomSuspense = suspenseList.value[Math.floor(Math.random() * suspenseList.value.length)]
        const fullDetails = await getMovieById(randomSuspense.imdbID)
        if (fullDetails.success) {
            heroItems.push(fullDetails.movie)
        } else {
            heroItems.push(randomSuspense)
        }
    }
    
    if (terrorList.value.length > 0) {
        const randomTerror = terrorList.value[Math.floor(Math.random() * terrorList.value.length)]
        const fullDetails = await getMovieById(randomTerror.imdbID)
        if (fullDetails.success) {
            heroItems.push(fullDetails.movie)
        } else {
            heroItems.push(randomTerror)
        }
    }
    
    heroMovies.value = heroItems
    loadingHero.value = false
}

const loadMovies = async () => {
    loadingMovies.value = true
    const result = await getMoviesByGenre('movies', 10)
    if (result.success) {
        moviesList.value = result.movies
    }
    loadingMovies.value = false
}

const loadSeries = async () => {
    loadingSeries.value = true
    const result = await getSeries(10)
    if (result.success) {
        seriesList.value = result.movies
    }
    loadingSeries.value = false
}

const loadSuspense = async () => {
    loadingSuspense.value = true
    const result = await getMoviesByGenre('suspense', 10)
    if (result.success) {
        suspenseList.value = result.movies
    }
    loadingSuspense.value = false
}

const loadTerror = async () => {
    loadingTerror.value = true
    const result = await getMoviesByGenre('terror', 10)
    if (result.success) {
        terrorList.value = result.movies
    }
    loadingTerror.value = false
}

const goToMovie = (imdbID) => {
    router.push(`/movies/${imdbID}`)
}
</script>

<style scoped>
.homepage {
    min-height: calc(100vh - 60px);
    padding: 0;
}

/* Hero Slider */
.hero-slider {
    width: 100%;
    height: 70vh;
    min-height: 500px;
    margin-bottom: 3rem;
    position: relative;
}

.hero-carousel {
    height: 100%;
}

.hero-slide {
    position: relative;
    width: 100%;
    height: 100%;
    cursor: pointer;
    overflow: hidden;
}

.hero-backdrop {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
}

.hero-backdrop img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    filter: brightness(0.4);
}

.hero-backdrop::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 60%;
    background: linear-gradient(to top, rgba(10, 10, 10, 0.95) 0%, transparent 100%);
}

.hero-placeholder {
    width: 100%;
    height: 100%;
    background: #1a1a1a;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #666;
}

.hero-content {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    padding: 4rem 3rem;
    z-index: 2;
    max-width: 800px;
}

.hero-title {
    font-family: var(--p-font-family-heading);
    font-size: 4rem;
    font-weight: 400;
    color: #ffffff;
    margin-bottom: 1rem;
    text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.8);
}

.hero-plot {
    font-size: 1.2rem;
    color: #e5e5e5;
    margin-bottom: 1.5rem;
    line-height: 1.6;
    text-shadow: 1px 1px 4px rgba(0, 0, 0, 0.8);
}

.hero-meta {
    display: flex;
    gap: 2rem;
    margin-bottom: 2rem;
    color: #b3b3b3;
    font-size: 1rem;
}

.hero-meta span {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.hero-button {
    background: var(--netflix-red);
    border: none;
    padding: 1rem 2rem;
    font-size: 1.1rem;
    font-weight: 600;
}

.hero-button:hover {
    background: var(--netflix-red-dark);
}

/* Carousels Container */
.carousels-container {
    padding: 0 2rem 3rem;
    max-width: 1400px;
    margin: 0 auto;
}

.carousel-section {
    margin-bottom: 3rem;
}

.carousel-title {
    font-family: var(--p-font-family-heading);
    font-size: 2rem;
    color: #ffffff;
    margin-bottom: 1.5rem;
    font-weight: 400;
    letter-spacing: 0.05em;
}

@media (max-width: 768px) {
    .hero-slider {
        height: 50vh;
        min-height: 400px;
    }

    .hero-content {
        padding: 2rem 1.5rem;
    }

    .hero-title {
        font-size: 2.5rem;
    }

    .hero-plot {
        font-size: 1rem;
    }

    .hero-meta {
        flex-direction: column;
        gap: 0.5rem;
    }

    .carousels-container {
        padding: 0 1rem 2rem;
    }
}
</style>
