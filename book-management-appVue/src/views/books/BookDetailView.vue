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
            <i class="fas" :class="isFavorite ? 'fa-heart' : 'fa-heart-o'"></i>
          </button>
          <img :src="book.image" :alt="book.title" class="book-image" />
          <div class="price-tag">{{ book.price }}</div>
        </div>

        <BookMetaInfo :book="book" />
        <BookReviews :bookId="book.isbn13" :currentUserId="currentUserId" />
       
      <BookDescription 
  :description="book.desc" 
  :pdfLink="book.pdf"
/>
       
        <SocialShare :title="book.title" :url="currentUrl" />
        <RelatedBooks :category="book.category" :currentBookId="book.isbn13" />
      </div>
    </div>
  </div>
  <div v-else-if="loading" class="loading">Yükleniyor...</div>
  <div v-else class="error">Kitap bulunamadı.</div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { bookService } from '@/services/bookService'
import BookMetaInfo from '@/components/BookDetail/BookMetaInfo.vue'
import BookReviews from '@/components/BookDetail/BookReviews.vue'
import RelatedBooks from '@/components/BookDetail/RelatedBooks.vue'
import SocialShare from '@/components/BookDetail/SocialShare.vue'
import BookDescription from '@/components/BookDetail/BookDescription.vue'

const route = useRoute()
const router = useRouter()
const book = ref(null)
const loading = ref(true)

const toggleFavorite = () => {
  store.dispatch('books/toggleFavorite', book.value)
}

onMounted(async () => {
  try {
    const isbn13 = route.params.isbn13
    book.value = await bookService.getBookDetail(isbn13)
  } catch (error) {
    console.error('Error fetching book details:', error)
  } finally {
    loading.value = false
  }
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
  background: white;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
}

.favorite-button.active {
  background: #ff4757;
  color: white;
}
.favorite-button:hover {
  transform: scale(1.1);
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

.book-info {
  padding: 1rem;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  margin: 2rem 0;
}

.info-item {
  display: flex;
  flex-direction: column;
}

.description {
  margin: 2rem 0;
}

.description h3 {
  margin-bottom: 1rem;
}

.buy-button {
  display: inline-block;
  background: #42b883;
  color: white;
  padding: 1rem 2rem;
  border-radius: 4px;
  text-decoration: none;
  font-weight: bold;
  transition: background 0.2s;
}

.buy-button:hover {
  background: #3aa876;
}

@media (max-width: 768px) {
  .book-content {
    grid-template-columns: 1fr;
  }

  .book-image-container {
    max-width: 300px;
    margin: 0 auto;
  }
}
</style>
