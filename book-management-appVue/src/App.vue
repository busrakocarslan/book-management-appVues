<template>
  <div class="app">
    <nav class="nav">
      <router-link to="/" class="nav-link">Ana Sayfa</router-link>
      <router-link to="/login" class="nav-link">Giriş Yap</router-link>
    </nav>
    
    <main>
      <router-view></router-view>
    </main>
  </div>
</template>

<script setup>
import { RouterLink, RouterView } from 'vue-router'
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