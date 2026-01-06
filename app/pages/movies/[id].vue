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
                        <h3>Sinopsis</h3>
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
                    <h4><i class="pi pi-users"></i> Actores</h4>
                    <p>{{ movie.Actors }}</p>
                </div>

                <div v-if="movie.Writer && movie.Writer !== 'N/A'" class="detail-item">
                    <h4><i class="pi pi-pencil"></i> Escritor</h4>
                    <p>{{ movie.Writer }}</p>
                </div>

                <div v-if="movie.Language && movie.Language !== 'N/A'" class="detail-item">
                    <h4><i class="pi pi-globe"></i> Idioma</h4>
                    <p>{{ movie.Language }}</p>
                </div>

                <div v-if="movie.Country && movie.Country !== 'N/A'" class="detail-item">
                    <h4><i class="pi pi-map-marker"></i> País</h4>
                    <p>{{ movie.Country }}</p>
                </div>

                <div v-if="movie.Released && movie.Released !== 'N/A'" class="detail-item">
                    <h4><i class="pi pi-calendar-plus"></i> Fecha de Estreno</h4>
                    <p>{{ movie.Released }}</p>
                </div>

                <div v-if="movie.BoxOffice && movie.BoxOffice !== 'N/A'" class="detail-item">
                    <h4><i class="pi pi-dollar"></i> Taquilla</h4>
                    <p>{{ movie.BoxOffice }}</p>
                </div>

                <div v-if="movie.Production && movie.Production !== 'N/A'" class="detail-item">
                    <h4><i class="pi pi-building"></i> Producción</h4>
                    <p>{{ movie.Production }}</p>
                </div>
            </div>

            <div v-if="movie.Awards && movie.Awards !== 'N/A'" class="awards">
                <h3><i class="pi pi-trophy"></i> Premios</h3>
                <p>{{ movie.Awards }}</p>
            </div>
        </div>
    </div>
</template>

<script setup>
definePageMeta({
    middleware: 'auth'
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
    min-height: 100vh;
    padding: 2rem;
    max-width: 1400px;
    margin: 0 auto;
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
    color: var(--red-500);
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
    border-radius: var(--border-radius);
    background: var(--surface-ground);
    display: flex;
    align-items: center;
    justify-content: center;
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
    color: var(--text-color-secondary);
    height: 100%;
}

.movie-info h1 {
    margin: 0 0 1rem 0;
    color: var(--primary-color);
    font-size: 2.5rem;
}

.movie-meta {
    display: flex;
    flex-wrap: wrap;
    gap: 1.5rem;
    margin-bottom: 1.5rem;
    color: var(--text-color-secondary);
}

.movie-meta span {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.movie-meta i {
    color: var(--primary-color);
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
    color: var(--primary-color);
}

.plot {
    margin-bottom: 2rem;
}

.plot h3 {
    margin: 0 0 0.5rem 0;
    color: var(--text-color);
}

.plot p {
    line-height: 1.6;
    color: var(--text-color-secondary);
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
    background: var(--surface-section);
    border-radius: var(--border-radius);
}

.detail-item h4 {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin: 0 0 0.5rem 0;
    color: var(--primary-color);
    font-size: 1rem;
}

.detail-item p {
    margin: 0;
    color: var(--text-color);
    line-height: 1.6;
}

.awards {
    padding: 2rem;
    background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-600) 100%);
    border-radius: var(--border-radius);
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
    .movie-detail-page {
        padding: 1rem;
    }

    .movie-details-grid {
        grid-template-columns: 1fr;
    }
}
</style>
