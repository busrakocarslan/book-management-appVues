<template>
  <div class="login-container">
    <BlurBackground />
    <form @submit.prevent="handleLogin" class="login-form">
      <h2>Giriş Yap</h2>
      <div class="form-group">
        <label for="email">Email</label>
        <input type="email" id="email" v-model="email" required placeholder="Email adresiniz" />
      </div>
      <div class="form-group">
        <label for="password">Şifre</label>
        <input type="password" id="password" v-model="password" required placeholder="Şifreniz" />
        <router-link to="/forgot-password" class="forgot-password-link">
          Şifremi Unuttum
        </router-link>
      </div>
      <button type="submit" :disabled="loading">
        {{ loading ? 'Giriş yapılıyor...' : 'Giriş Yap' }}
      </button>
      <p v-if="error" class="error-message">{{ error }}</p>
      <div class="auth-links">
        <p class="register-link">
          Hesabınız yok mu?
          <router-link to="/register">Kayıt Ol</router-link>
        </p>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import BlurBackground from '@/components/Background/BlurBackground.vue'

const store = useStore()
const router = useRouter()

const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')

const handleLogin = async () => {
  try {
    loading.value = true
    error.value = ''

    await store.dispatch('auth/login', {
      email: email.value,
      password: password.value,
    })

    router.push('/')
  } catch (err) {
    error.value = 'Giriş başarısız oldu.'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 80vh;
  padding: 20px;
}

.login-form {
  background: white;
  padding: 3rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 500px;
}

h2 {
  text-align: center;
  color: #42b883;
  margin-bottom: 2rem;
}

.form-group {
  margin-bottom: 1rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  color: #2c3e50;
}

input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

input:focus {
  outline: none;
  border-color: #42b883;
}

button {
  width: 100%;
  padding: 0.75rem;
  background-color: #42b883;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

button:hover {
  background-color: #3aa876;
}

button:disabled {
  background-color: #9be0c8;
  cursor: not-allowed;
}

.error-message {
  color: #dc3545;
  text-align: center;
  margin-top: 1rem;
}
.auth-links {
  margin-top: 1.5rem;
  text-align: center;
}

.register-link {
  color: #666;
}

.register-link a {
  color: #42b883;
  text-decoration: none;
  font-weight: 500;
}

.register-link a:hover {
  text-decoration: underline;
}

.forgot-password-link {
  display: block;
  text-align: right;
  font-size: 0.9rem;
  color: #666;
  margin-top: 0.5rem;
  text-decoration: none;
}

.forgot-password-link:hover {
  color: #42b883;
}
</style>
