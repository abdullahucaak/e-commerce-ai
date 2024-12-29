<template>
  <div class="login-container">
    <div class="login-box">
      <h2>Admin Girişi</h2>
      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label for="username">Kullanıcı Adı</label>
          <input 
            type="text" 
            id="username" 
            v-model="username" 
            required
            placeholder="Kullanıcı adınızı giriniz"
          >
        </div>
        <div class="form-group">
          <label for="password">Şifre</label>
          <input 
            type="password" 
            id="password" 
            v-model="password" 
            required
            placeholder="Şifrenizi giriniz"
          >
        </div>
        <div v-if="error" class="error-message">
          {{ error }}
        </div>
        <button type="submit" class="login-btn">Giriş Yap</button>
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
const error = ref('')

const handleLogin = async () => {
  try {
    const response = await axios.get('http://localhost:3000/admins')
    const admin = response.data.find(
      admin => admin.username === username.value && admin.password === password.value
    )

    if (admin) {
      localStorage.setItem('isAdmin', 'true')
      localStorage.setItem('adminData', JSON.stringify(admin))
      router.push('/admin-panel')
      error.value = ''
    } else {
      error.value = 'Kullanıcı adı veya şifre hatalı!'
    }
  } catch (err) {
    error.value = 'Bir hata oluştu. Lütfen tekrar deneyin.'
    console.error('Login error:', err)
  }
}
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f5f5f5;
}

.login-box {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
}

h2 {
  text-align: center;
  color: #333;
  margin-bottom: 2rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  color: #666;
}

input {
  width: 100%;
  padding: 0.8rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

input:focus {
  outline: none;
  border-color: #4a90e2;
}

.login-btn {
  width: 100%;
  padding: 1rem;
  background-color: #4a90e2;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s;
}

.login-btn:hover {
  background-color: #357abd;
}

.error-message {
  color: #dc3545;
  margin-bottom: 1rem;
  text-align: center;
}
</style> 