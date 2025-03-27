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
        <button class="logout-button" @click="handleLogout">Çıkış Yap</button>
      </div>
    </div>

    <div class="favorites-section">
      <h2>Favori Kitaplarım</h2>
      <div class="favorites-grid">
        <div v-for="book in favoriteBooks" :key="book.isbn13" class="book-card">
          <img :src="book.image" :alt="book.title" class="book-image" />
          <div class="book-info">
            <h3>{{ book.title }}</h3>
            <p class="book-price">{{ formatPrice(book.price) }}</p>
            <div class="book-actions">
              <button @click="removeFromFavorites(book)" class="remove-favorite">
                <i class="fas fa-heart-broken"></i> Favorilerden Çıkar
              </button>
              <button @click="viewDetails(book.isbn13)" class="view-details">
                <i class="fas fa-info-circle"></i> Detaylar
              </button>
            </div>
          </div>
        </div>
        <div v-if="favoriteBooks.length === 0" class="no-favorites">
          Henüz favori kitabınız bulunmuyor.
        </div>
      </div>
    </div>

    <div class="user-books-section">
      <h2>Eklediğim Kitaplar</h2>
      <div class="books-grid">
        <div v-for="book in userBooks" :key="book.isbn13" class="book-card">
          <img :src="book.image" :alt="book.title" class="book-image" />
          <div class="book-info">
            <h3>{{ book.title }}</h3>
            <p class="book-author">{{ book.authors }}</p>
            <p class="book-price">{{ formatPrice(book.price) }}</p>
            <p class="book-date">Eklenme: {{ formatDate(book.addedAt) }}</p>
            <div class="book-actions">
              <button @click="viewDetails(book.isbn13)" class="view-details">
                <i class="fas fa-info-circle"></i> Detaylar
              </button>
            </div>
          </div>
        </div>
        <div v-if="userBooks.length === 0" class="no-books">Henüz kitap eklememişsiniz.</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

const store = useStore()
const router = useRouter()

const currentUser = computed(() => store.getters['auth/currentUser'])
const favoriteBooks = computed(() => store.state.books.favorites)
const userBooks = computed(() => store.getters['books/getUserBooks'])
const userInitials = computed(() => {
  if (!currentUser.value?.name) return ''
  return currentUser.value.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
})

// fonksiyonlar

const formatDate = (dateString) => {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString('tr-TR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

const handleLogout = async () => {
  await store.dispatch('auth/logout')
  router.push('/login')
}

const viewDetails = (isbn13) => {
  router.push({ name: 'book-detail', params: { isbn13 } })
}

const removeFromFavorites = (book) => {
  store.dispatch('books/toggleFavorite', book)
}

const formatPrice = (price) => {
  if (!price) return 'Ücretsiz'
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'USD',
  }).format(parseFloat(price.replace(/[^0-9.-]+/g, '')))
}

onMounted(async () => {
  try {
    await store.dispatch('books/loadUserBooks')
  } catch (error) {
    console.error('Kitaplar yüklenirken hata:', error)
  }
})
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

.favorites-section {
  margin-top: 2rem;
}

.favorites-section h2 {
  margin-bottom: 1rem;
  color: #2c3e50;
}

.favorites-grid,
.books-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-top: 1rem;
}
.book-card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.3s ease;
}

.book-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.book-image {
  width: 100%;
  height: 200px;
  object-fit: contain;
  background: #f8f9fa;
}

.book-info {
  padding: 1rem;
}

.book-info h3 {
  margin: 0;
  font-size: 1rem;
  color: #2c3e50;
  margin-bottom: 0.5rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.book-price {
  color: #42b883;
  font-weight: 600;
  margin: 0.5rem 0;
}

.book-actions {
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
}

.remove-favorite,
.view-details {
  padding: 0.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: background-color 0.3s ease;
}

.remove-favorite {
  background-color: #dc3545;
  color: white;
  flex: 1;
}

.remove-favorite:hover {
  background-color: #c82333;
}

.view-details {
  background-color: #42b883;
  color: white;
  flex: 1;
}

.view-details:hover {
  background-color: #3aa876;
}

.no-favorites,
.no-books {
  grid-column: 1 / -1;
  text-align: center;
  padding: 2rem;
  background: #f8f9fa;
  border-radius: 8px;
  color: #666;
}

.user-books-section {
  margin-top: 2rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
}
.book-date {
  color: #666;
  font-size: 0.8rem;
  margin-top: 0.5rem;
}

@media (max-width: 768px) {
  .profile-container {
    padding: 1rem;
  }
  .profile-card {
    padding: 1rem;
  }
}
</style>
