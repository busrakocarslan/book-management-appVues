<template>
  <div class="forgot-password-container">
    <BlurBackground />
    <form @submit.prevent="handleForgotPassword" class="forgot-password-form">
      <h2>Şifre Sıfırlama</h2>
      <p class="form-description">
        lütfe e-mail adresinizi giriniz, şifre sıfırlama bağlantısı göndereceğiz.
      </p>

      <div class="form-group">
        <label for="email">Email</label>
        <input type="email" id="email" v-model="email" required placeholder="Email adresiniz" />
      </div>

      <button type="submit" :disabled="loading">
        {{ loading ? 'Gönderiliyor...' : 'Sıfırlama Bağlantısı Gönder' }}
      </button>

      <p v-if="error" class="error-message">{{ error }}</p>
      <p v-if="success" class="success-message">{{ success }}</p>

      <div class="auth-links">
        <router-link to="/login" class="back-to-login"> ← Giriş sayfasına dön </router-link>
      </div>
    </form>
  </div>
</template>

<script setup>
import BlurBackground from '@/components/Background/BlurBackground.vue'
import { ref } from 'vue'
import { useStore } from 'vuex'

const store = useStore()
const email = ref('')
const loading = ref(false)
const error = ref('')
const success = ref('')

const handleForgotPassword = async () => {
  try {
    loading.value = true
    error.value = ''
    success.value = ''

    const result = await store.dispatch('auth/forgotPassword', email.value)
    success.value = result.message
  } catch (err) {
    error.value = 'Şifre sıfırlama işlemi başarısız oldu.'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.forgot-password-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 80vh;
  padding: 20px;
}

.forgot-password-form {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
}

.form-description {
  color: #666;
  margin-bottom: 1.5rem;
  text-align: center;
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

.success-message {
  color: #42b883;
  text-align: center;
  margin-top: 1rem;
  padding: 0.75rem;
  background-color: #ebf9f3;
  border-radius: 4px;
}

.back-to-login {
  display: block;
  text-align: center;
  margin-top: 1.5rem;
  color: #666;
  text-decoration: none;
}

.back-to-login:hover {
  color: #42b883;
}
</style>
