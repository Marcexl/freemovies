<template>
  <div id="app">
    <NuxtRouteAnnouncer />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <ClientOnly>
      <Toast />
    </ClientOnly>
  </div>
</template>

<script setup>
useHead({
  titleTemplate: (titleChunk) => {
    return titleChunk ? `${titleChunk} - FreeMovies` : 'FreeMovies - Movie Streaming'
  },
  meta: [
    { charset: 'utf-8' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    { name: 'description', content: 'Stream and discover your favorite movies' }
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
  background-color: #0a0a0a;
  color: #ffffff;
  line-height: 1.6;
  overflow-x: hidden;
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
  background: #0a0a0a;
}

::-webkit-scrollbar-thumb {
  background: #333333;
  border-radius: 5px;
}

::-webkit-scrollbar-thumb:hover {
  background: #555555;
}

/* Override PrimeVue default colors for dark theme */
.p-component {
  color: #ffffff;
}
</style>
