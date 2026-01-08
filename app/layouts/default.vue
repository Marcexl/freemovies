<template>
    <div class="app-layout">
        <!-- Top Navigation Bar -->
        <Menubar :model="menuItems" class="top-navbar">
            <template #start>
                <div class="logo-container" @click="navigateTo('/home')">
                    <img src="/logo-cutted.png" alt="FreeMovies" class="logo-image">
                </div>
            </template>

            <template #end>
                <div class="nav-actions">
                    <!-- Search Icon (can be expanded to search bar) -->
                    <Button icon="pi pi-search" text rounded aria-label="Search" @click="toggleSearch"
                        class="search-button" />

                    <!-- User Profile Menu -->
                    <Menu ref="userMenu" :model="userMenuItems" :popup="true" />
                    <Button :label="user?.name || 'User'" :icon="user?.photoURL ? undefined : 'pi pi-user'" text
                        class="user-button" @click="toggleUserMenu">
                        <Avatar v-if="user?.photoURL" :image="user.photoURL" shape="circle" class="user-avatar" />
                        <i class="pi pi-chevron-down ml-2"></i>
                    </Button>
                </div>
            </template>
        </Menubar>

        <!-- Search Bar (expandable) -->
        <Transition name="slide-down">
            <div v-if="showSearch" class="search-overlay">
                <div class="search-container">
                    <SearchBar v-model="searchQuery" :loading="false" @search="handleSearch" class="expanded-search" />
                    <Button icon="pi pi-times" text rounded @click="showSearch = false" class="close-search" />
                </div>
            </div>
        </Transition>

        <!-- Main Content -->
        <main class="main-content">
            <slot />
        </main>

        <!-- Footer -->
        <footer class="app-footer">
            <div class="footer-content">
                <p class="footer-text">
                    All rights reserved © 2026 by
                    <a href="https://marcexl.com.ar" target="_blank" rel="noopener noreferrer" class="footer-link">
                        marcexl.com.ar
                    </a>
                </p>
            </div>
        </footer>
    </div>
</template>

<script setup>
const { user, logout, isAuthenticated } = useAuth()
const router = useRouter()
const route = useRoute()
const userMenu = ref()
const showSearch = ref(false)
const searchQuery = ref('')

// Helper to check if route matches
const isActiveRoute = (path) => {
    if (path === '/home') {
        return route.path === '/home' || route.path === '/'
    }
    return route.path.startsWith(path)
}

// Menu items for navigation
const menuItems = computed(() => [
    {
        label: 'Home',
        icon: 'pi pi-home',
        command: () => navigateTo('/home'),
        class: isActiveRoute('/home') ? 'p-menuitem-active' : ''

    },
    {
        label: 'Movies',
        icon: 'pi pi-film',
        command: () => navigateTo('/movies'),
        class: isActiveRoute('/movies') ? 'p-menuitem-active' : ''
    },
    {
        label: 'Series',
        icon: 'pi pi-tv',
        command: () => navigateTo('/series'),
        class: isActiveRoute('/series') ? 'p-menuitem-active' : ''
    },
    {
        label: 'My List',
        icon: 'pi pi-bookmark',
        command: () => {
            // TODO: Navigate to favorites/watchlist
            console.log('My List clicked')
        },
        class: isActiveRoute('/my-list') ? 'p-menuitem-active' : ''
    }
])

// User menu items
const userMenuItems = computed(() => [
    {
        label: user.value?.name || 'Profile',
        icon: 'pi pi-user',
        disabled: true
    },
    {
        separator: true
    },
    /*{
        label: 'Account Settings',
        icon: 'pi pi-cog',
        command: () => {
            // TODO: Navigate to settings
            console.log('Settings clicked')
        }
    },*/
    {
        separator: true
    },
    {
        label: 'Sign Out',
        icon: 'pi pi-sign-out',
        command: handleLogout
    }
])

const toggleUserMenu = (event) => {
    userMenu.value.toggle(event)
}

const toggleSearch = () => {
    showSearch.value = !showSearch.value
    if (showSearch.value) {
        nextTick(() => {
            // Focus search input when opened
            const searchInput = document.querySelector('.expanded-search input')
            if (searchInput) searchInput.focus()
        })
    }
}

const handleSearch = (query) => {
    if (query && query.trim()) {
        router.push({
            path: '/movies',
            query: { search: query }
        })
        showSearch.value = false
    }
}

const handleLogout = async () => {
    await logout()
    router.push('/')
}

// Watch for route changes to close search
watch(() => route.path, () => {
    showSearch.value = false
})
</script>

<style scoped>
.app-layout {
    min-height: 100vh;
    background: #0a0a0a;
    color: #ffffff;
    display: flex;
    flex-direction: column;
}

/* Top Navigation Bar */
.top-navbar {
    background: linear-gradient(180deg, rgba(0, 0, 0, 0.9) 0%, rgba(0, 0, 0, 0.7) 100%);
    backdrop-filter: blur(10px);
    border: none;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    padding: 0.75rem 2rem;
    position: sticky;
    top: 0;
    z-index: 1000;
    transition: background 0.3s ease;
}

.top-navbar :deep(.p-menubar-root-list) {
    gap: 2rem;
}

.top-navbar :deep(.p-menubar-root-list > .p-menuitem > .p-menuitem-link) {
    color: #e5e5e5;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    transition: all 0.2s ease;
}

.top-navbar :deep(.p-menubar-root-list > .p-menuitem > .p-menuitem-link:hover) {
    background: rgba(255, 255, 255, 0.1);
    color: #ffffff;
}

.top-navbar :deep(.p-menubar-root-list > .p-menuitem.p-highlight > .p-menuitem-link) {
    background: rgba(255, 255, 255, 0.15);
    color: #ffffff;
}

/* Logo */
.logo-container {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    cursor: pointer;
    margin-right: 2rem;
    transition: transform 0.2s ease;
}

.logo-container:hover {
    transform: scale(1.05);
}

.logo-icon {
    font-size: 2rem;
    color: #e50914;
    font-weight: bold;
}

.logo-text {
    font-size: 1.5rem;
    font-weight: 700;
    color: #ffffff;
    letter-spacing: -0.5px;
}

.logo-image {
    width: 120px;
}

/* Navigation Actions */
.nav-actions {
    display: flex;
    align-items: center;
    gap: 1rem;
}

.search-button {
    color: #ffffff;
    width: 2.5rem;
    height: 2.5rem;
}

.search-button:hover {
    background: rgba(255, 255, 255, 0.1);
}

.user-button {
    color: #ffffff;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
}

.user-button:hover {
    background: rgba(255, 255, 255, 0.1);
}

.user-avatar {
    width: 2rem;
    height: 2rem;
}

/* Search Overlay */
.search-overlay {
    background: rgba(0, 0, 0, 0.95);
    backdrop-filter: blur(10px);
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    padding: 1.5rem 2rem;
    position: sticky;
    top: 60px;
    z-index: 999;
}

.search-container {
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    gap: 1rem;
}

.expanded-search {
    flex: 1;
}

.close-search {
    color: #ffffff;
    width: 2.5rem;
    height: 2.5rem;
}

.close-search:hover {
    background: rgba(255, 255, 255, 0.1);
}

/* Main Content */
.main-content {
    flex: 1;
    min-height: calc(100vh - 60px);
    padding: 2rem;
    max-width: 1400px;
    margin: 0 auto;
    width: 100%;
}

/* Footer Styles */
.app-footer {
    background: rgba(0, 0, 0, 0.8);
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    padding: 2rem;
    margin-top: auto;
}

.footer-content {
    max-width: 1400px;
    margin: 0 auto;
    text-align: center;
}

.footer-text {
    color: #b3b3b3;
    font-size: 0.9rem;
    margin: 0;
}

.footer-link {
    color: var(--netflix-red);
    text-decoration: none;
    transition: color 0.2s ease;
}

.footer-link:hover {
    color: var(--netflix-red-dark);
    text-decoration: underline;
}

/* Transitions */
.slide-down-enter-active,
.slide-down-leave-active {
    transition: all 0.3s ease;
}

.slide-down-enter-from {
    opacity: 0;
    transform: translateY(-20px);
}

.slide-down-leave-to {
    opacity: 0;
    transform: translateY(-20px);
}

/* User Menu Styling */
:deep(.p-menu) {
    background: rgba(20, 20, 20, 0.95);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 8px;
    padding: 0.5rem;
    min-width: 200px;
}

:deep(.p-menu .p-menuitem-link) {
    color: #e5e5e5;
    padding: 0.75rem 1rem;
    border-radius: 4px;
    transition: all 0.2s ease;
}

:deep(.p-menu .p-menuitem-link:hover) {
    background: rgba(255, 255, 255, 0.1);
    color: #ffffff;
}

:deep(.p-menu .p-menuitem-separator) {
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    margin: 0.5rem 0;
}

/* Responsive */
@media (max-width: 768px) {
    .top-navbar {
        padding: 0.75rem 1rem;
    }

    .logo-text {
        display: none;
    }

    .top-navbar :deep(.p-menubar-root-list) {
        gap: 0.5rem;
    }

    .top-navbar :deep(.p-menubar-root-list > .p-menuitem > .p-menuitem-link) {
        padding: 0.5rem;
    }

    .top-navbar :deep(.p-menubar-root-list > .p-menuitem > .p-menuitem-link .p-menuitem-text) {
        display: none;
    }

    .main-content {
        padding: 1rem;
    }

    .search-overlay {
        padding: 1rem;
    }

    .app-footer {
        padding: 1.5rem 1rem;
    }

    .footer-text {
        font-size: 0.85rem;
    }
}
</style>
