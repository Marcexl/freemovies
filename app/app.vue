<template>
  <div id="app">
    <NuxtRouteAnnouncer />
    <NuxtPage />
    <ClientOnly>
      <Toast />
    </ClientOnly>
  </div>
</template>

<script setup>
useHead({
  titleTemplate: (titleChunk) => {
    return titleChunk ? `${titleChunk} - FreeMovies` : 'FreeMovies - Administración de Películas'
  },
  meta: [
    { charset: 'utf-8' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    { name: 'description', content: 'Sistema de administración de películas con Vue.js/Nuxt' }
  ]
})

</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: var(--font-family);
  background-color: var(--surface-ground);
  color: var(--text-color);
  line-height: 1.6;
}

#app {
  min-height: 100vh;
}

:focus-visible {
  outline: 2px solid var(--primary-color);
  outline-offset: 2px;
}

::-webkit-scrollbar {
  width: 10px;
}

::-webkit-scrollbar-track {
  background: var(--surface-ground);
}

::-webkit-scrollbar-thumb {
  background: var(--surface-border);
  border-radius: 5px;
}

::-webkit-scrollbar-thumb:hover {
  background: var(--text-color-secondary);
}
</style>
