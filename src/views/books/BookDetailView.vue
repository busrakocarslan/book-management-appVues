<template>
  <div class="book-detail" v-if="book">
    <div class="container">
      <div class="book-header">
        <button class="back-button" @click="router.back()">← Geri</button>
        <h1>{{ book.title }}</h1>
      </div>
      <div class="book-content">
        <div class="book-image-container">
          <button class="favorite-button" @click="toggleFavorite" :class="{ active: isFavorite }">
            ❤
          </button>
          <img :src="book.image" :alt="book.title" class="book-image" />
          <div class="price-tag">{{ book.price }}</div>
          <a :href="book.url" target="_blank" rel="noopener noreferrer" class="buy-button">
            <i class="fas fa-shopping-cart"></i> Satın Al
          </a>
        </div>

        <BookMetaInfo :book="book" />
        <BookReviews :bookId="book.isbn13" :currentUserId="currentUserId" />

        <BookDescription :description="book.desc" :pdfLink="book.pdf" />

        <SocialShare :title="book.title" :url="currentUrl" />
        <RelatedBooks :category="book.category" :currentBookId="book.isbn13" />
      </div>
    </div>
  </div>
  <div v-else-if="loading" class="loading">Yükleniyor...</div>
  <div v-else class="error">Kitap bulunamadı.</div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { bookService } from '@/services/bookService'
import BookMetaInfo from '@/components/BookDetail/BookMetaInfo.vue'
import BookReviews from '@/components/BookDetail/BookReviews.vue'
import RelatedBooks from '@/components/BookDetail/RelatedBooks.vue'
import SocialShare from '@/components/BookDetail/SocialShare.vue'
import BookDescription from '@/components/BookDetail/BookDescription.vue'

const route = useRoute()
const router = useRouter()
const store = useStore()
const book = ref(null)
const loading = ref(true)

const isFavorite = computed(() => store.getters['books/isFavorite'](book.value?.isbn13))

const currentUserId = computed(() => store.getters['auth/currentUser']?.id)

const currentUrl = computed(() => window.location.href)

const toggleFavorite = () => {
  if (!book.value) return
  store.dispatch('books/toggleFavorite', book.value)
}

const loadBookDetails = async (isbn13) => {
  try {
    loading.value = true
    book.value = await bookService.getBookDetail(isbn13)
  } catch (error) {
    console.error('Error fetching book details:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadBookDetails(route.params.isbn13)
})
</script>

<style scoped>
.book-detail {
  padding: 2rem;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}
.favorite-button {
  position: absolute;
  top: 1rem;
  left: 1rem;
  border: none;
  border-radius: 50%;
  background: white;
  width: 40px;
  height: 40px;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
  color: gray;
}

.favorite-button.active {
  background: #ff4757;
  color: white;
}

.book-header {
  display: flex;
  align-items: center;
  margin-bottom: 2rem;
}

.back-button {
  background: none;
  border: none;
  color: #42b883;
  font-size: 1.1rem;
  cursor: pointer;
  margin-right: 1rem;
}

.book-content {
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 2rem;
}

.book-image-container {
  position: relative;
}

.book-image {
  width: 100%;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.price-tag {
  position: absolute;
  top: 1rem;
  right: -1rem;
  background: #42b883;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  font-weight: bold;
}

.buy-button {
  position: absolute;
  bottom: 1rem;
  left: 50%;
  transform: translateX(-50%);
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: #42b883;
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  text-decoration: none;
  font-weight: bold;
  transition: all 0.3s ease;
  border: none;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.buy-button:hover {
  background: #3aa876;
  transform: translateX(-50%) translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

@media (max-width: 768px) {
  .book-content {
    grid-template-columns: 1fr;
  }

  .book-image-container {
    max-width: 300px;
    margin: 0 auto;
  }
  .buy-button {
    position: static;
    transform: none;
    width: 80%;
    margin-top: 1rem;
    justify-content: center;
  }

  .buy-button:hover {
    transform: translateY(-2px);
  }
}
</style>
