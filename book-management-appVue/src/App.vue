<template>
  <div class="app">
    <nav class="nav">
      <template v-if="isAuthenticated">
        <router-link to="/" class="nav-link">Ana Sayfa</router-link>
        <a href="#" @click.prevent="handleLogout" class="nav-link">Çıkış Yap</a>
      </template>
      <template v-else>
        <router-link to="/login" class="nav-link">Giriş Yap</router-link>
      </template>
    </nav>
    
    <main>
      <BackgroundLines v-if="showBackground" />
      <router-view></router-view>
    </main>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import BackgroundLines from './components/Background/BackgroundLines.vue'

const store = useStore()
const router = useRouter()

const showBackground = computed(() => {
  const route = router.currentRoute.value.name
  return !['login', 'register','forgot-password'].includes(route)
})

const isAuthenticated = computed(() => store.getters['auth/isAuthenticated'])

const handleLogout = () => {
  store.dispatch('auth/logout')
  router.push('/login')
}
</script>

<style>
.app {
  font-family: Arial, sans-serif;
}

.nav {
  background-color: #42b883;
  padding: 1rem;
  margin-bottom: 2rem;
}

.nav-link {
  color: white;
  text-decoration: none;
  padding: 0.5rem 1rem;
  margin-right: 1rem;
  border-radius: 4px;
}

.nav-link:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.router-link-active {
  background-color: rgba(255, 255, 255, 0.2);
}
</style>