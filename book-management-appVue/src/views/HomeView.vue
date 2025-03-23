<template>
  <div class="home">
    <div class="header">
      <h1>Kitap Listesi</h1>
      <div class="search-container">
        <input 
          type="text" 
          v-model="searchQuery" 
          @input="handleSearch"
          placeholder="Kitap ara..."
          class="search-input"
        />
      </div>
      <button class="add-button" @click="navigateToAddBook">
        + Yeni Kitap Ekle
      </button>
      
    </div>

    <div v-if="loading" class="loading">
      Yükleniyor...
    </div>

    <div v-else-if="error" class="error">
      {{ error }}
    </div>

    <div v-else class="book-grid">
      <div v-for="book in books" :key="book.isbn13" class="book-card">
        <img :src="book.image" :alt="book.title" class="book-image">
        <div class="book-info">
          <h3>{{ book.title }}</h3>
          <p class="subtitle">{{ book.subtitle }}</p>
          <p class="price">{{ book.price }}</p>
          <button @click="viewDetails(book.isbn13)" class="details-button">
            Detayları Gör
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, computed, ref } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import debounce from 'lodash/debounce'

const store = useStore()
const router = useRouter()
const searchQuery = ref('')

const books = computed(() => store.getters['books/getAllBooks'])
const loading = computed(() => store.state.books.loading)
const error = computed(() => store.state.books.error)

const navigateToAddBook = () => {
  router.push('/add-book')
}

const handleSearch = debounce(async (event) => {
  const query = event.target.value
  if (query.length >= 3) {
    await store.dispatch('books/searchBooks', query)
  }
}, 500)

const viewDetails = (isbn13) => {
  router.push(`/book/${isbn13}`)
}

onMounted(async () => {
  await store.dispatch('books/searchBooks')
})
</script>

<style scoped>
.home {
  padding: 2rem;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.add-button {
  background-color: #42b883;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
}

.book-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
}

.book-card {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.author {
  color: #666;
  margin: 0.5rem 0;
}

.price {
  font-weight: bold;
  color: #42b883;
}

.description {
  margin: 1rem 0;
  font-size: 0.9rem;
}

.category-badge {
  display: inline-block;
  background-color: #e9ecef;
  padding: 0.25rem 0.75rem;
  border-radius: 15px;
  font-size: 0.8rem;
}

.loading {
  text-align: center;
  padding: 2rem;
  color: #666;
}

.error {
  color: #dc3545;
  text-align: center;
  padding: 2rem;
}
.search-container {
  margin-left: 2rem;
}

.search-input {
  padding: 0.5rem 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  min-width: 300px;
}

.book-image {
  width: 100%;
  height: 200px;
  object-fit: contain;
  margin-bottom: 1rem;
}

.subtitle {
  color: #666;
  font-size: 0.9rem;
  margin: 0.5rem 0;
}
.details-button {
  background-color: #42b883;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  width: 100%;
  margin-top: 1rem;
}

.details-button:hover {
  background-color: #3aa876;
}
</style>