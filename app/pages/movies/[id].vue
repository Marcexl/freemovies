<template>
    <div class="movie-detail-page">
        <Button label="Volver" icon="pi pi-arrow-left" severity="secondary" outlined @click="goBack"
            class="back-button" />

        <div v-if="loading" class="loading-container">
            <Skeleton width="100%" height="600px" />
        </div>

        <div v-else-if="error" class="error-container">
            <i class="pi pi-exclamation-triangle"></i>
            <h2>Error</h2>
            <p>{{ error }}</p>
            <Button label="Volver al listado" @click="goBack" />
        </div>

        <div v-else-if="movie" class="movie-detail">
            <div class="movie-header">
                <div class="movie-poster-large">
                    <img v-if="movie.Poster && movie.Poster !== 'N/A'" :src="movie.Poster" :alt="movie.Title" />
                    <div v-else class="no-poster-large">
                        <i class="pi pi-image" style="font-size: 5rem"></i>
                        <p>Sin imagen</p>
                    </div>
                </div>

                <div class="movie-info">
                    <h1>{{ movie.Title }}</h1>

                    <div class="movie-meta">
                        <span v-if="movie.Year">
                            <i class="pi pi-calendar"></i>
                            {{ movie.Year }}
                        </span>
                        <span v-if="movie.Runtime && movie.Runtime !== 'N/A'">
                            <i class="pi pi-clock"></i>
                            {{ movie.Runtime }}
                        </span>
                        <span v-if="movie.Genre && movie.Genre !== 'N/A'">
                            <i class="pi pi-tag"></i>
                            {{ movie.Genre }}
                        </span>
                        <span v-if="movie.Rated && movie.Rated !== 'N/A'">
                            <i class="pi pi-info-circle"></i>
                            {{ movie.Rated }}
                        </span>
                    </div>

                    <div v-if="movie.imdbRating && movie.imdbRating !== 'N/A'" class="rating">
                        <Rating :modelValue="parseFloat(movie.imdbRating) / 2" :readonly="true" :cancel="false" />
                        <span class="rating-value">
                            <strong>{{ movie.imdbRating }}</strong> / 10
                            <small>(IMDb)</small>
                        </span>
                    </div>

                    <div v-if="movie.Plot && movie.Plot !== 'N/A'" class="plot">
                        <h3>Plot</h3>
                        <p>{{ movie.Plot }}</p>
                    </div>
                </div>
            </div>

            <div class="movie-details-grid">
                <div v-if="movie.Director && movie.Director !== 'N/A'" class="detail-item">
                    <h4><i class="pi pi-user"></i> Director</h4>
                    <p>{{ movie.Director }}</p>
                </div>

                <div v-if="movie.Actors && movie.Actors !== 'N/A'" class="detail-item">
                    <h4><i class="pi pi-users"></i> Actors</h4>
                    <p>{{ movie.Actors }}</p>
                </div>

                <div v-if="movie.Writer && movie.Writer !== 'N/A'" class="detail-item">
                    <h4><i class="pi pi-pencil"></i> Writer</h4>
                    <p>{{ movie.Writer }}</p>
                </div>

                <div v-if="movie.Language && movie.Language !== 'N/A'" class="detail-item">
                    <h4><i class="pi pi-globe"></i> Language</h4>
                    <p>{{ movie.Language }}</p>
                </div>

                <div v-if="movie.Country && movie.Country !== 'N/A'" class="detail-item">
                    <h4><i class="pi pi-map-marker"></i> Country</h4>
                    <p>{{ movie.Country }}</p>
                </div>

                <div v-if="movie.Released && movie.Released !== 'N/A'" class="detail-item">
                    <h4><i class="pi pi-calendar-plus"></i> Release Date</h4>
                    <p>{{ movie.Released }}</p>
                </div>

                <div v-if="movie.BoxOffice && movie.BoxOffice !== 'N/A'" class="detail-item">
                    <h4><i class="pi pi-dollar"></i> Box Office</h4>
                    <p>{{ movie.BoxOffice }}</p>
                </div>

                <div v-if="movie.Production && movie.Production !== 'N/A'" class="detail-item">
                    <h4><i class="pi pi-building"></i> Production</h4>
                    <p>{{ movie.Production }}</p>
                </div>
            </div>

            <div v-if="movie.Awards && movie.Awards !== 'N/A'" class="awards">
                <h3><i class="pi pi-trophy"></i> Awards</h3>
                <p>{{ movie.Awards }}</p>
            </div>
        </div>
    </div>
</template>

<script setup>
definePageMeta({
    middleware: 'auth',
    layout: 'default'
})

const route = useRoute()
const router = useRouter()
const { fetchMovieDetail, currentMovie, loading, error } = useMovies()

const movie = computed(() => currentMovie.value)

onMounted(async () => {
    const movieId = route.params.id
    if (movieId) {
        await fetchMovieDetail(movieId)
    }
})

const goBack = () => {
    router.push('/movies')
}
</script>

<style scoped>
.movie-detail-page {
    min-height: calc(100vh - 60px);
}

.back-button {
    margin-bottom: 2rem;
}

.loading-container {
    margin-top: 2rem;
}

.error-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 4rem 2rem;
    gap: 1rem;
    text-align: center;
}

.error-container i {
    font-size: 4rem;
    color: #e50914;
}

.error-container h2 {
    color: #ffffff;
}

.error-container p {
    color: #b3b3b3;
}

.movie-detail {
    margin-top: 2rem;
}

.movie-header {
    display: grid;
    grid-template-columns: 300px 1fr;
    gap: 3rem;
    margin-bottom: 3rem;
}

.movie-poster-large {
    width: 100%;
    height: 450px;
    overflow: hidden;
    border-radius: 8px;
    background: #1a1a1a;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
}

.movie-poster-large img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.no-poster-large {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: #b3b3b3;
    height: 100%;
}

.movie-info h1 {
    margin: 0 0 1rem 0;
    color: #ffffff;
    font-size: 2.5rem;
}

.movie-meta {
    display: flex;
    flex-wrap: wrap;
    gap: 1.5rem;
    margin-bottom: 1.5rem;
    color: #b3b3b3;
}

.movie-meta span {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.movie-meta i {
    color: #e50914;
}

.rating {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 2rem;
}

.rating-value {
    display: flex;
    align-items: baseline;
    gap: 0.5rem;
}

.rating-value strong {
    font-size: 1.5rem;
    color: #ffffff;
}

.plot {
    margin-bottom: 2rem;
}

.plot h3 {
    margin: 0 0 0.5rem 0;
    color: #ffffff;
}

.plot p {
    line-height: 1.6;
    color: #b3b3b3;
    margin: 0;
}

.movie-details-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 2rem;
    margin-bottom: 2rem;
}

.detail-item {
    padding: 1.5rem;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 8px;
    border: 1px solid rgba(255, 255, 255, 0.1);
}

.detail-item h4 {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin: 0 0 0.5rem 0;
    color: #e50914;
    font-size: 1rem;
}

.detail-item p {
    margin: 0;
    color: #b3b3b3;
    line-height: 1.6;
}

.awards {
    padding: 2rem;
    background: linear-gradient(135deg, #e50914 0%, #b20710 100%);
    border-radius: 8px;
    color: white;
}

.awards h3 {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin: 0 0 1rem 0;
    color: white;
}

.awards p {
    margin: 0;
    font-size: 1.1rem;
    line-height: 1.6;
}

@media (max-width: 968px) {
    .movie-header {
        grid-template-columns: 1fr;
        gap: 2rem;
    }

    .movie-poster-large {
        max-width: 300px;
        margin: 0 auto;
    }

    .movie-info h1 {
        font-size: 2rem;
        text-align: center;
    }

    .movie-meta {
        justify-content: center;
    }

    .rating {
        justify-content: center;
    }
}

@media (max-width: 768px) {
    .movie-details-grid {
        grid-template-columns: 1fr;
    }
}
</style>
