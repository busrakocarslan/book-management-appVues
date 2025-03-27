<template>
  <div class="app">
    <Navbar v-if="isAuthenticated" /><!--Sadece griş yapmış kulıcıların görmesi için v-if eklendi-->
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

const showBackground = computed(() => {// giriş-register-ve şifremi unuttum sayfalarında arkaplan çizgileri gözükmesi için kontrolu sağlıyorum.
  const route = router.currentRoute.value.name
  return !['login', 'register','forgot-password'].includes(route)
})

const isAuthenticated = computed(() => store.getters['auth/isAuthenticated'])// oturum durumunu kontrol ediyorum.
</script>

<style>
.app {
  font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif, sans-serif;
}
</style>