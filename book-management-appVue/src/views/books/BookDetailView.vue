<template>
    <div class="book-detail" v-if="book">
      <div class="container">
        <div class="book-header">
          <button class="back-button" @click="router.back()">← Geri</button>
          <h1>{{ book.title }}</h1>
        </div>
  
        <div class="book-content">
          <div class="book-image-container">
            <img :src="book.image" :alt="book.title" class="book-image">
            <div class="price-tag">{{ book.price }}</div>
          </div>
  
          <div class="book-info">
            <h2>{{ book.subtitle }}</h2>
            <div class="info-grid">
              <div class="info-item">
                <strong>ISBN13:</strong>
                <span>{{ book.isbn13 }}</span>
              </div>
              <div class="info-item">
                <strong>Yazarlar:</strong>
                <span>{{ book.authors }}</span>
              </div>
              <div class="info-item">
                <strong>Yayın:</strong>
                <span>{{ book.publisher }}</span>
              </div>
              <div class="info-item">
                <strong>Yıl:</strong>
                <span>{{ book.year }}</span>
              </div>
            </div>
  
            <div class="description">
              <h3>Açıklama</h3>
              <p>{{ book.desc }}</p>
            </div>
  
            <a :href="book.url" target="_blank" class="buy-button">
              Satın Al
            </a>
          </div>
        </div>
      </div>
    </div>
    <div v-else-if="loading" class="loading">
      Yükleniyor...
    </div>
    <div v-else class="error">
      Kitap bulunamadı.
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { bookService } from '@/services/bookService'
  
  const route = useRoute()
  const router = useRouter()
  const book = ref(null)
  const loading = ref(true)
  
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
    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
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