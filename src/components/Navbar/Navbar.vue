<template>
  <nav class="navbar">
    <div class="navbar-left">
      <router-link to="/" class="nav-link"> <i class="fas fa-home"></i> Anasayfa </router-link>
      <router-link to="/profile" class="nav-link"> <i class="fas fa-user"></i> Profil </router-link>
    </div>
    <div class="navbar-right">
      <a href="#" @click.prevent="handleLogout" class="nav-link logout-link">
        <i class="fas fa-door-open"></i> Çıkış Yap
      </a>
    </div>
  </nav>
</template>

<script setup>
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

const store = useStore()
const router = useRouter()

const handleLogout = () => {
  store.dispatch('auth/logout')
  router.push('/login')
}
</script>

<style scoped>
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #42b883;
  padding: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.navbar-left,
.navbar-right {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.nav-link {
  color: white;
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
}

.nav-link i {
  font-size: 1.1rem;
}

.nav-link:hover {
  background-color: rgba(255, 255, 255, 0.1);
  transform: translateY(-1px);
}

.logout-link {
  background-color: rgba(255, 255, 255, 0.1);
}

.logout-link:hover {
  background-color: rgba(255, 255, 255, 0.2);
}

.router-link-active {
  background-color: rgba(255, 255, 255, 0.2);
  font-weight: 500;
}
@media (max-width: 768px) {
  .navbar {
    padding: 0.75rem;
  }

  .nav-link {
    padding: 0.4rem 0.75rem;
    font-size: 0.8rem;
  }
}
</style>
