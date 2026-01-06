<template>
    <Card class="movie-skeleton">
        <template #header>
            <Skeleton width="100%" height="400px" />
        </template>
        <template #content>
            <Skeleton width="80%" height="1.5rem" class="mb-2" />
            <Skeleton width="60%" height="1rem" />
        </template>
    </Card>
</template>

<script setup>
</script>

<style scoped>
.movie-skeleton {
    height: 100%;
}
</style>
