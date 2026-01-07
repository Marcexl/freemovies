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
  ],
  link: [
    {
      rel: 'preconnect',
      href: 'https://fonts.googleapis.com'
    },
    {
      rel: 'preconnect',
      href: 'https://fonts.gstatic.com',
      crossorigin: ''
    },
    {
      rel: 'stylesheet',
      href: 'https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Montserrat:wght@300;400;500;600;700;800;900&display=swap'
    }
  ]
})

</script>

<style>
:root {
  /* Netflix Color Palette */
  --netflix-red: #e50914;
  --netflix-red-dark: #b20710;
  --netflix-black: #0a0a0a;
  --netflix-dark-gray: #141414;
  --netflix-gray: #2a2a2a;
  --netflix-light-gray: #b3b3b3;
  --netflix-white: #ffffff;

  /* Override PrimeVue Aura theme colors */
  --p-primary-color: var(--netflix-red);
  --p-primary-contrast-color: var(--netflix-white);
  --p-primary-hover-color: var(--netflix-red-dark);
  --p-primary-active-color: #80050c;
  --p-primary-focus-ring-color: rgba(229, 9, 20, 0.2);

  /* Surface colors for dark theme */
  --p-surface-0: var(--netflix-black);
  --p-surface-50: var(--netflix-dark-gray);
  --p-surface-100: var(--netflix-gray);
  --p-surface-200: #3a3a3a;
  --p-surface-300: #4a4a4a;

  /* Text colors */
  --p-text-color: var(--netflix-white);
  --p-text-muted-color: var(--netflix-light-gray);
  --p-text-hover-color: var(--netflix-white);

  /* Border colors */
  --p-border-color: rgba(255, 255, 255, 0.1);
  --p-border-hover-color: rgba(255, 255, 255, 0.2);

  /* Font family */
  --p-font-family: 'Montserrat', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  --p-font-family-heading: 'Bebas Neue', 'Montserrat', sans-serif;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: var(--p-font-family);
  background-color: var(--netflix-black);
  color: var(--netflix-white);
  line-height: 1.6;
  overflow-x: hidden;
}

#app {
  min-height: 100vh;
}

/* Apply Netflix font to headings */
h1,
h2,
h3,
h4,
h5,
h6,
.p-menubar .logo-text,
.brand-text,
.logo-text {
  font-family: var(--p-font-family-heading);
  font-weight: 400;
  letter-spacing: 0.05em;
  color: #ffffff;
}

:focus-visible {
  outline: 2px solid var(--netflix-red);
  outline-offset: 2px;
}

::-webkit-scrollbar {
  width: 10px;
}

::-webkit-scrollbar-track {
  background: var(--netflix-black);
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
  color: var(--netflix-white);
}

/* Override PrimeVue button primary colors */
.p-button.p-button-primary {
  background: var(--netflix-red);
  border-color: var(--netflix-red);
}

.p-button.p-button-primary:hover {
  background: var(--netflix-red-dark);
  border-color: var(--netflix-red-dark);
}

.p-button.p-button-primary:focus {
  box-shadow: 0 0 0 2px var(--p-primary-focus-ring-color);
}

/* Override PrimeVue link colors */
a,
.p-link {
  color: var(--netflix-red);
  text-decoration: none;
  transition: color 0.2s ease;
}

a:hover,
.p-link:hover {
  color: var(--netflix-red-dark);
}

/* Override PrimeVue input focus colors */
.p-inputtext:focus,
.p-password-input:focus {
  border-color: var(--netflix-red);
  box-shadow: 0 0 0 2px var(--p-primary-focus-ring-color);
}

/* Override PrimeVue menu item hover */
.p-menuitem-link:hover {
  background: rgba(255, 255, 255, 0.1);
}

.p-menuitem-link:focus {
  box-shadow: inset 0 0 0 2px var(--p-primary-focus-ring-color);
}

.p-inputtext,
input,
textarea,
p {
  color: var(--netflix-white);
}

small {
  color: var(--netflix-white);
}

label {
  color: var(--netflix-white);
}
</style>
