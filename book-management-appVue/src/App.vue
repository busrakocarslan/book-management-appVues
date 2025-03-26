<template>
  <div class="app">
    <Navbar v-if="isAuthenticated" />
    <template v-else>      
    </template>
    
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
import Navbar from './components/Navbar/Navbar.vue'

const store = useStore()
const router = useRouter()

const showBackground = computed(() => {
  const route = router.currentRoute.value.name
  return !['login', 'register','forgot-password'].includes(route)
})

const isAuthenticated = computed(() => store.getters['auth/isAuthenticated'])
</script>

<style>
.app {
  font-family: Arial, sans-serif;
}

/* Remove old nav styles as they're now in Navbar component */
</style>