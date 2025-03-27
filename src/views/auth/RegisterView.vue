<template>
  <div class="register-container">
    <BlurBackground />
    <form @submit.prevent="handleRegister" class="register-form">
      <h2>Kayıt Ol</h2>

      <div class="form-group">
        <label for="name">Ad Soyad</label>
        <input type="text" id="name" v-model="formData.name" required />
      </div>

      <div class="form-group">
        <label for="email">E-posta</label>
        <input type="email" id="email" v-model="formData.email" required />
      </div>

      <div class="form-group">
        <label for="password">Şifre</label>
        <input type="password" id="password" v-model="formData.password" required />
      </div>

      <button type="submit" :disabled="loading">
        {{ loading ? 'Kaydediliyor...' : 'Kayıt Ol' }}
      </button>

      <div v-if="error" class="error-message">
        {{ error }}
      </div>

      <p class="login-link">
        Zaten hesabınız var mı?
        <router-link to="/login">Giriş Yap</router-link>
      </p>
    </form>
  </div>
</template>

<script setup>
import { reactive, computed } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import BlurBackground from '@/components/Background/BlurBackground.vue'

const store = useStore()
const router = useRouter()

const formData = reactive({
  name: '',
  email: '',
  password: '',
})

const loading = computed(() => store.getters['auth/isLoading'])
const error = computed(() => store.getters['auth/error'])

const handleRegister = async () => {
  try {
    await store.dispatch('auth/register', formData)
    router.push('/')
  } catch (err) {
     error.value = 'Kayıt işlemi başarısız oldu:'
  }
}
</script>

<style scoped>
.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 2rem;
}

.register-form {
  background: white;
  padding: 4rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
}

h2 {
  text-align: center;
  color: #2c3e50;
  margin-bottom: 2rem;
}

.form-group {
  margin-bottom: 1.5rem;
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

button {
  width: 100%;
  padding: 0.75rem;
  background-color: #42b883;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
}

button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.error-message {
  margin-top: 1rem;
  padding: 0.75rem;
  background-color: #dc3545;
  color: white;
  border-radius: 4px;
  text-align: center;
}

.login-link {
  margin-top: 1.5rem;
  text-align: center;
}

.login-link a {
  color: #42b883;
  text-decoration: none;
}

.login-link a:hover {
  text-decoration: underline;
}
</style>
