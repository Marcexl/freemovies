<template>
    <div class="series-detail-page">
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

        <div v-else-if="series" class="series-detail">
            <div class="series-header">
                <div class="series-poster-large">
                    <img v-if="series.Poster && series.Poster !== 'N/A'" :src="series.Poster" :alt="series.Title" />
                    <div v-else class="no-poster-large">
                        <i class="pi pi-image" style="font-size: 5rem"></i>
                        <p>Sin imagen</p>
                    </div>
                </div>

                <div class="series-info">
                    <h1>{{ series.Title }}</h1>

                    <div class="series-meta">
                        <span v-if="series.Year">
                            <i class="pi pi-calendar"></i>
                            {{ series.Year }}
                        </span>
                        <span v-if="series.Runtime && series.Runtime !== 'N/A'">
                            <i class="pi pi-clock"></i>
                            {{ series.Runtime }}
                        </span>
                        <span v-if="series.Genre && series.Genre !== 'N/A'">
                            <i class="pi pi-tag"></i>
                            {{ series.Genre }}
                        </span>
                        <span v-if="series.Rated && series.Rated !== 'N/A'">
                            <i class="pi pi-info-circle"></i>
                            {{ series.Rated }}
                        </span>
                    </div>

                    <div v-if="series.imdbRating && series.imdbRating !== 'N/A'" class="rating">
                        <Rating :modelValue="parseFloat(series.imdbRating) / 2" :readonly="true" :cancel="false" />
                        <span class="rating-value">
                            <strong>{{ series.imdbRating }}</strong> / 10
                            <small>(IMDb)</small>
                        </span>
                    </div>

                    <div v-if="series.Plot && series.Plot !== 'N/A'" class="plot">
                        <h3>Plot</h3>
                        <p>{{ series.Plot }}</p>
                    </div>
                </div>
            </div>

            <div class="series-details-grid">
                <div v-if="series.Director && series.Director !== 'N/A'" class="detail-item">
                    <h4><i class="pi pi-user"></i> Director</h4>
                    <p>{{ series.Director }}</p>
                </div>

                <div v-if="series.Actors && series.Actors !== 'N/A'" class="detail-item">
                    <h4><i class="pi pi-users"></i> Actors</h4>
                    <p>{{ series.Actors }}</p>
                </div>

                <div v-if="series.Writer && series.Writer !== 'N/A'" class="detail-item">
                    <h4><i class="pi pi-pencil"></i> Writer</h4>
                    <p>{{ series.Writer }}</p>
                </div>

                <div v-if="series.Language && series.Language !== 'N/A'" class="detail-item">
                    <h4><i class="pi pi-globe"></i> Language</h4>
                    <p>{{ series.Language }}</p>
                </div>

                <div v-if="series.Country && series.Country !== 'N/A'" class="detail-item">
                    <h4><i class="pi pi-map-marker"></i> Country</h4>
                    <p>{{ series.Country }}</p>
                </div>

                <div v-if="series.Released && series.Released !== 'N/A'" class="detail-item">
                    <h4><i class="pi pi-calendar-plus"></i> Release Date</h4>
                    <p>{{ series.Released }}</p>
                </div>

                <div v-if="series.totalSeasons && series.totalSeasons !== 'N/A'" class="detail-item">
                    <h4><i class="pi pi-tv"></i> Total Seasons</h4>
                    <p>{{ series.totalSeasons }}</p>
                </div>

                <div v-if="series.Production && series.Production !== 'N/A'" class="detail-item">
                    <h4><i class="pi pi-building"></i> Production</h4>
                    <p>{{ series.Production }}</p>
                </div>
            </div>

            <div v-if="series.Awards && series.Awards !== 'N/A'" class="awards">
                <h3><i class="pi pi-trophy"></i> Awards</h3>
                <p>{{ series.Awards }}</p>
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
const { getMovieById } = useOMDB()

const series = ref(null)
const loading = ref(true)
const error = ref(null)

onMounted(async () => {
    const seriesId = route.params.id
    if (seriesId) {
        loading.value = true
        error.value = null
        
        try {
            const result = await getMovieById(seriesId)
            if (result.success) {
                series.value = result.movie
            } else {
                error.value = result.error
            }
        } catch (err) {
            error.value = 'Error al obtener detalles de la serie'
        } finally {
            loading.value = false
        }
    }
})

const goBack = () => {
    router.push('/series')
}
</script>

<style scoped>
.series-detail-page {
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

.series-detail {
    margin-top: 2rem;
}

.series-header {
    display: grid;
    grid-template-columns: 300px 1fr;
    gap: 3rem;
    margin-bottom: 3rem;
}

.series-poster-large {
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

.series-poster-large img {
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

.series-info h1 {
    margin: 0 0 1rem 0;
    color: #ffffff;
    font-size: 2.5rem;
}

.series-meta {
    display: flex;
    flex-wrap: wrap;
    gap: 1.5rem;
    margin-bottom: 1.5rem;
    color: #b3b3b3;
}

.series-meta span {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.series-meta i {
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

.series-details-grid {
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
    .series-header {
        grid-template-columns: 1fr;
        gap: 2rem;
    }

    .series-poster-large {
        max-width: 300px;
        margin: 0 auto;
    }

    .series-info h1 {
        font-size: 2rem;
        text-align: center;
    }

    .series-meta {
        justify-content: center;
    }

    .rating {
        justify-content: center;
    }
}

@media (max-width: 768px) {
    .series-details-grid {
        grid-template-columns: 1fr;
    }
}
</style>
