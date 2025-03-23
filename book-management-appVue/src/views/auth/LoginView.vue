<template>
    <div class="login-container">
      <form @submit.prevent="handleLogin" class="login-form">
        <h2>Giriş Yap</h2>
        <div class="form-group">
          <label for="email">Email</label>
          <input 
            type="email" 
            id="email" 
            v-model="email" 
            required 
            placeholder="Email adresiniz"
          />
        </div>
        <div class="form-group">
          <label for="password">Şifre</label>
          <input 
            type="password" 
            id="password" 
            v-model="password" 
            required 
            placeholder="Şifreniz"
          />
        </div>
        <button type="submit" :disabled="loading">
          {{ loading ? 'Giriş yapılıyor...' : 'Giriş Yap' }}
        </button>
        <p v-if="error" class="error-message">{{ error }}</p>
      </form>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import { useStore } from 'vuex'
  import { useRouter } from 'vue-router'
  
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
        password: password.value
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
    padding: 2rem;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    width: 100%;
    max-width: 400px;
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
  </style>