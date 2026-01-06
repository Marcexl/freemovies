<template>
    <div class="login-container">
        <Card class="login-card">
            <template #title>
                <div class="login-title">
                    <i class="pi pi-film" style="font-size: 3rem; color: var(--primary-color)"></i>
                    <h1>FreeMovies</h1>
                    <p class="subtitle">Administración de Películas</p>
                </div>
            </template>
            <template #content>
                <form @submit.prevent="handleLogin" class="login-form">
                    <div class="form-group">
                        <label for="email">Email</label>
                        <InputText id="email" v-model="email" type="email" placeholder="tu@email.com" class="w-full"
                            :class="{ 'p-invalid': errors.email }" autocomplete="email" required />
                        <small v-if="errors.email" class="p-error">{{ errors.email }}</small>
                    </div>

                    <div class="form-group">
                        <label for="password">Password</label>
                        <InputText id="password" v-model="password" type="password" placeholder="••••••••"
                            class="w-full" :class="{ 'p-invalid': errors.password }" autocomplete="current-password"
                            required />
                        <small v-if="errors.password" class="p-error">{{ errors.password }}</small>
                    </div>

                    <Button type="submit" label="Iniciar Sesión" icon="pi pi-sign-in" class="w-full login-button"
                        :loading="loading" />

                    <div v-if="loginError" class="error-message">
                        <i class="pi pi-exclamation-triangle"></i>
                        {{ loginError }}
                    </div>
                </form>

                <div class="login-info">
                    <p><small>Autenticación dummy - Usa cualquier email y password</small></p>
                </div>
            </template>
        </Card>
    </div>
</template>

<script setup>
definePageMeta({
    layout: false
})

const { login } = useAuth()
const router = useRouter()

const email = ref('')
const password = ref('')
const loading = ref(false)
const loginError = ref('')
const errors = ref({})

const validateForm = () => {
    errors.value = {}

    if (!email.value || !email.value.includes('@')) {
        errors.value.email = 'Email inválido'
    }

    if (!password.value || password.value.length < 3) {
        errors.value.password = 'Password debe tener al menos 3 caracteres'
    }

    return Object.keys(errors.value).length === 0
}

const handleLogin = async () => {
    loginError.value = ''
    errors.value = {}

    if (!validateForm()) {
        return
    }

    loading.value = true

    // Simular un pequeño delay para mejor UX
    await new Promise(resolve => setTimeout(resolve, 500))

    const result = login(email.value, password.value)

    if (result.success) {
        router.push('/movies')
    } else {
        loginError.value = result.error || 'Error al iniciar sesión'
    }

    loading.value = false
}
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

.login-info {
    margin-top: 1.5rem;
    text-align: center;
    padding-top: 1.5rem;
    border-top: 1px solid var(--surface-border);
}

.login-info p {
    color: var(--text-color-secondary);
    margin: 0;
}
</style>
