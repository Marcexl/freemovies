<template>

    <div class="app-layout">
        <!-- Top Navigation Bar -->
        <Menubar :model="menuItems" class="top-navbar">
            <template #start>
                <div class="logo-container" @click="navigateTo('/movies')">
                    <i class="pi pi-film logo-icon"></i>
                    <span class="logo-text">FreeMovies</span>
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
    </div>
</template>

<script setup>
const { user, logout, isAuthenticated } = useAuth()
const router = useRouter()
const route = useRoute()
const userMenu = ref()
const showSearch = ref(false)
const searchQuery = ref('')

// Menu items for navigation
const menuItems = computed(() => [
    {
        label: 'Home',
        icon: 'pi pi-home',
        command: () => navigateTo('/movies')
    },
    {
        label: 'Movies',
        icon: 'pi pi-film',
        command: () => navigateTo('/movies')
    },
    {
        label: 'My List',
        icon: 'pi pi-bookmark',
        command: () => {
            // TODO: Navigate to favorites/watchlist
            console.log('My List clicked')
        }
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
    {
        label: 'Account Settings',
        icon: 'pi pi-cog',
        command: () => {
            // TODO: Navigate to settings
            console.log('Settings clicked')
        }
    },
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
    min-height: calc(100vh - 60px);
    padding: 2rem;
    max-width: 1400px;
    margin: 0 auto;
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
}
</style>
