<template>
    <div class="search-bar">
        <div class="search-input-wrapper">
            <i class="pi pi-search search-icon"></i>
            <InputText v-model="localQuery" :placeholder="placeholder" class="search-input" @keyup.enter="handleSearch"
                @input="handleInput" />
            <Button label="Search" icon="pi pi-search" @click="handleSearch" :loading="loading" />
        </div>
    </div>
</template>

<script setup>
const props = defineProps({
    modelValue: {
        type: String,
        default: ''
    },
    placeholder: {
        type: String,
        default: 'Search movies...'
    },
    loading: {
        type: Boolean,
        default: false
    }
})

const emit = defineEmits(['update:modelValue', 'search'])

const localQuery = ref(props.modelValue)

watch(() => props.modelValue, (newVal) => {
    localQuery.value = newVal
})

const handleInput = () => {
    emit('update:modelValue', localQuery.value)
}

const handleSearch = () => {
    if (localQuery.value.trim()) {
        emit('search', localQuery.value.trim())
    }
}
</script>

<style scoped>
.search-bar {
    width: 100%;
    margin-bottom: 2rem;
}

.search-input-wrapper {
    display: flex;
    gap: 1rem;
    align-items: center;
    max-width: 800px;
    margin: 0 auto;
}

.search-input-wrapper :deep(.p-inputtext) {
    flex: 1;
    padding-left: 2.5rem;
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    color: #ffffff;
}

.search-input-wrapper :deep(.p-inputtext:focus) {
    background: rgba(255, 255, 255, 0.15);
    border-color: rgba(255, 255, 255, 0.3);
    box-shadow: 0 0 0 2px rgba(229, 9, 20, 0.2);
}

.search-input-wrapper :deep(.p-inputtext::placeholder) {
    color: rgba(255, 255, 255, 0.5);
}

.search-icon {
    position: absolute;
    left: 1rem;
    color: rgba(255, 255, 255, 0.6);
    pointer-events: none;
    z-index: 1;
}

.search-input-wrapper :deep(.p-button) {
    background: #e50914;
    border: none;
    color: #ffffff;
}

.search-input-wrapper :deep(.p-button:hover) {
    background: #b20710;
}

.search-input-wrapper {
    position: relative;
}

@media (max-width: 768px) {
    .search-input-wrapper {
        flex-direction: column;
    }

    .search-input-wrapper :deep(.p-inputtext),
    .search-input-wrapper :deep(.p-button) {
        width: 100%;
    }
}
</style>
