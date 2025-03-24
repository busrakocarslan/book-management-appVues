<template>
    <div class="profile-container">
      <div class="profile-card">
        <div class="profile-header">
          <div class="user-avatar large">
            {{ userInitials }}
          </div>
          <h2>Profil Bilgileri</h2>
        </div>
  
        <div class="profile-info">
          <div class="info-group">
            <label>Ad Soyad</label>
            <div class="info-value">{{ currentUser?.name }}</div>
          </div>
  
          <div class="info-group">
            <label>E-posta</label>
            <div class="info-value">{{ currentUser?.email }}</div>
          </div>
  
          <div class="info-group">
            <label>Hesap Oluşturma Tarihi</label>
            <div class="info-value">{{ formatDate(currentUser?.createdAt) }}</div>
          </div>
        </div>
  
        <div class="profile-actions">
          <button class="logout-button" @click="handleLogout">
            Çıkış Yap
          </button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { computed } from 'vue'
  import { useStore } from 'vuex'
  import { useRouter } from 'vue-router'
  
  const store = useStore()
  const router = useRouter()
  
  const currentUser = computed(() => store.getters['auth/currentUser'])
  const userInitials = computed(() => {
    if (!currentUser.value?.name) return ''
    return currentUser.value.name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
  })
  
  const formatDate = (dateString) => {
    if (!dateString) return ''
    return new Date(dateString).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }
  
  const handleLogout = async () => {
    await store.dispatch('auth/logout')
    router.push('/login')
  }
  </script>
  
  <style scoped>
  .profile-container {
    padding: 2rem;
    max-width: 600px;
    margin: 0 auto;
  }
  
  .profile-card {
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    padding: 2rem;
  }
  
  .profile-header {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 2rem;
  }
  
  .user-avatar.large {
    width: 80px;
    height: 80px;
    background-color: #42b883;
    color: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    font-size: 2rem;
    margin-bottom: 1rem;
  }
  
  .info-group {
    margin-bottom: 1.5rem;
  }
  
  .info-group label {
    display: block;
    color: #666;
    font-size: 0.9rem;
    margin-bottom: 0.5rem;
  }
  
  .info-value {
    font-size: 1.1rem;
    color: #2c3e50;
  }
  
  .profile-actions {
    margin-top: 2rem;
    padding-top: 2rem;
    border-top: 1px solid #eee;
  }
  
  .logout-button {
    width: 100%;
    padding: 0.75rem;
    background-color: #dc3545;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 1rem;
  }
  
  .logout-button:hover {
    background-color: #c82333;
  }
  </style>