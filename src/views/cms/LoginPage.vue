<template>
    <div class="login-container">
        <div class="login-box">
            <div class="logo">
                <img src="../../assets/Alaya-Logo_300x300.jpg" alt="Logo">
            </div>
            <h2>Admin Girişi</h2>
            <form @submit.prevent="handleLogin">
                <div class="form-group">
                    <label>Kullanıcı Adı</label>
                    <input 
                        type="text" 
                        v-model="username" 
                        required
                        :class="{ 'error': loginError }"
                    >
                </div>
                <div class="form-group">
                    <label>Şifre</label>
                    <input 
                        type="password" 
                        v-model="password" 
                        required
                        :class="{ 'error': loginError }"
                    >
                </div>
                <div v-if="loginError" class="error-message">
                    Kullanıcı adı veya şifre hatalı!
                </div>
                <button type="submit" :disabled="loading">
                    {{ loading ? 'Giriş yapılıyor...' : 'Giriş Yap' }}
                </button>
            </form>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const router = useRouter()
const username = ref('')
const password = ref('')
const loading = ref(false)
const loginError = ref(false)

const handleLogin = async () => {
    loading.value = true
    loginError.value = false
    
    try {
        const response = await axios.get('http://localhost:3000/admins')
        const admin = response.data.find(
            admin => admin.username === username.value && admin.password === password.value
        )
        
        if (admin) {
            localStorage.setItem('isAdmin', 'true')
            router.push('/cms/dashboard')
        } else {
            loginError.value = true
        }
    } catch (error) {
        console.error('Login error:', error)
        loginError.value = true
    } finally {
        loading.value = false
    }
}
</script>

<style scoped>
.login-container {
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #f5f5f5;
}

.login-box {
    background: white;
    padding: 2rem;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    width: 100%;
    max-width: 400px;
}

.logo {
    text-align: center;
    margin-bottom: 1.5rem;
}

.logo img {
    width: 150px;
    height: auto;
}

h2 {
    text-align: center;
    color: #333;
    margin-bottom: 1.5rem;
    font-weight: 400;
}

.form-group {
    margin-bottom: 1rem;
}

label {
    display: block;
    margin-bottom: 0.5rem;
    color: #666;
}

input {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 1rem;
}

input.error {
    border-color: #dc3545;
}

.error-message {
    color: #dc3545;
    font-size: 0.875rem;
    margin-bottom: 1rem;
}

button {
    width: 100%;
    padding: 0.75rem;
    background-color: #1B9C85;
    color: white;
    border: none;
    border-radius: 4px;
    font-size: 1rem;
    cursor: pointer;
    transition: background-color 0.3s;
}

button:hover {
    background-color: #158c77;
}

button:disabled {
    background-color: #ccc;
    cursor: not-allowed;
}

@media (max-width: 480px) {
    .login-box {
        margin: 1rem;
        padding: 1.5rem;
    }
}
</style> 