<template>
    <div class="login-container">
        <Card class="login-card">
            <template #title>
                <div class="login-title">
                    <img src="/logo-transp.png" alt="FreeMovies" class="logo-image">
                    <p class="subtitle">The only really free movies streaming website</p>
                </div>
            </template>
            <template #content>
                <div class="auth-tabs">
                    <Button :label="isRegisterMode ? 'Login' : 'Register'"
                        :icon="isRegisterMode ? 'pi pi-sign-in' : 'pi pi-user-plus'" text @click="toggleMode"
                        class="toggle-button" />
                </div>

                <form @submit.prevent="handleSubmit" class="login-form">
                    <div v-if="isRegisterMode" class="form-group">
                        <label for="name">Name</label>
                        <InputText id="name" v-model="name" type="text" placeholder="Full name"
                            class="w-full text-white" :class="{ 'p-invalid': errors.name }" autocomplete="name"
                            required />
                        <small v-if="errors.name" class="p-error">{{ errors.name }}</small>
                    </div>

                    <div class="form-group">
                        <label for="email">Email</label>
                        <InputText id="email" v-model="email" type="email" placeholder="your@email.com"
                            class="w-full text-white" :class="{ 'p-invalid': errors.email }" autocomplete="email"
                            required :disabled="isLoading" />
                        <small v-if="errors.email" class="p-error">{{ errors.email }}</small>
                    </div>

                    <div class="form-group">
                        <label for="password">Password</label>
                        <Password id="password" v-model="password" placeholder="••••••••" class="w-full text-white"
                            :class="{ 'p-invalid': errors.password }" :feedback="isRegisterMode" toggleMask
                            :inputStyle="{ width: '100%' }" required :disabled="isLoading" />
                        <small v-if="errors.password" class="p-error">{{ errors.password }}</small>
                    </div>

                    <Button type="submit" :label="isRegisterMode ? 'Register' : 'Login'"
                        :icon="isRegisterMode ? 'pi pi-user-plus' : 'pi pi-sign-in'" class="w-full login-button"
                        :loading="isLoading" :disabled="isLoading" />

                    <div class="divider">
                        <span>or continue with</span>
                    </div>

                    <Button label="Google Sign In" icon="pi pi-google" class="w-full google-button" :loading="isLoading"
                        :disabled="isLoading" @click="handleGoogleLogin" />

                    <div v-if="errorMessage" class="error-message">
                        <i class="pi pi-exclamation-triangle"></i>
                        {{ errorMessage }}
                    </div>
                </form>
            </template>
        </Card>
    </div>
</template>

<script setup>
definePageMeta({
    layout: false
})

const { login, register, loginWithGoogle, isAuthenticated } = useAuth()
const router = useRouter()

const isRegisterMode = ref(false)
const email = ref('')
const password = ref('')
const name = ref('')
const loading = ref(false)
const googleLoading = ref(false)

const errorMessage = ref('')
const errors = ref({})

// Redirect if already authenticated
watch(isAuthenticated, (authenticated) => {
    if (authenticated) {
        router.push('/home')
    }
}, { immediate: true })

const toggleMode = () => {
    isRegisterMode.value = !isRegisterMode.value
    errorMessage.value = ''
    errors.value = {}
    email.value = ''
    password.value = ''
    name.value = ''
}

const validateForm = () => {
    errors.value = {}

    if (isRegisterMode.value && (!name.value || name.value.trim().length < 2)) {
        errors.value.name = 'El nombre debe tener al menos 2 caracteres'
    }

    if (!email.value || !email.value.includes('@')) {
        errors.value.email = 'Email inválido'
    }

    if (!password.value) {
        errors.value.password = 'La contraseña es requerida'
    } else if (isRegisterMode.value && password.value.length < 6) {
        errors.value.password = 'La contraseña debe tener al menos 6 caracteres'
    } else if (!isRegisterMode.value && password.value.length < 3) {
        errors.value.password = 'La contraseña debe tener al menos 3 caracteres'
    }

    return Object.keys(errors.value).length === 0
}

const handleSubmit = async () => {
    errorMessage.value = ''
    errors.value = {}

    if (!validateForm()) {
        return
    }

    loading.value = true

    try {
        let result
        if (isRegisterMode.value) {
            result = await register(email.value, password.value, name.value.trim())
        } else {
            result = await login(email.value, password.value)
        }

        if (result.success) {
            router.push('/home')
        } else {
            errorMessage.value = result.error || 'Error al procesar la solicitud'
        }
    } catch (error) {
        errorMessage.value = 'Ocurrió un error inesperado'
        console.error('Auth error:', error)
    } finally {
        loading.value = false
    }
}

const handleGoogleLogin = async () => {
    errorMessage.value = ''
    googleLoading.value = true

    try {
        const result = await loginWithGoogle()
        if (result.success) {
            router.push('/home')
        } else {
            errorMessage.value = result.error || 'Error al iniciar sesión con Google'
        }
    } catch (error) {
        errorMessage.value = 'Ocurrió un error al iniciar sesión con Google'
        console.error('Google login error:', error)
    } finally {
        googleLoading.value = false
    }
}

const isLoading = computed(() => {
    return loading.value || googleLoading.value
})
</script>

<style scoped>
.login-container {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, var(--surface-ground) 0%, var(--surface-section) 100%);
    padding: 2rem;
}

.login-card {
    width: 100%;
    max-width: 450px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

.login-title {
    text-align: center;
    margin-bottom: 2rem;
}

.login-title h1 {
    margin: 1rem 0 0.5rem 0;
    color: var(--primary-color);
    font-size: 2.5rem;
    font-weight: 700;
}

.subtitle {
    color: var(--text-color-secondary);
    margin: 0;
    font-size: 0.9rem;
}

.login-form {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
}

.form-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.form-group label {
    font-weight: 500;
    color: var(--text-color);
}

.login-button {
    margin-top: 1rem;
    padding: 0.75rem;
    font-size: 1.1rem;
}

.error-message {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: var(--red-500);
    background: var(--red-50);
    padding: 0.75rem;
    border-radius: var(--border-radius);
    margin-top: 1rem;
}

.auth-tabs {
    display: flex;
    justify-content: flex-end;
    margin-bottom: 1rem;
}

.toggle-button {
    padding: 0.5rem 1rem;
    font-size: 0.9rem;
}

.divider {
    display: flex;
    align-items: center;
    text-align: center;
    margin: 1.5rem 0;
    color: var(--text-color-secondary);
}

.divider::before,
.divider::after {
    content: '';
    flex: 1;
    border-bottom: 1px solid var(--surface-border);
}

.divider span {
    padding: 0 1rem;
    font-size: 0.9rem;
}

.google-button {
    background: #4285f4;
    border: none;
    color: white;
    padding: 0.75rem;
    font-size: 1.1rem;
}

.google-button:hover {
    background: #357ae8 !important;
}

.logo-image {
    width: 250px;
}
</style>
