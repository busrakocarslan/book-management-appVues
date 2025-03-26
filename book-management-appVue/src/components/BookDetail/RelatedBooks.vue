<template>
    <div class="related-books">
      <h3>Benzer Kitaplar</h3>
      <div class="books-grid">
        <div v-for="book in relatedBooks" 
             :key="book.isbn13" 
             class="book-card"
             @click="goToBook(book.isbn13)"
        >
          <img :src="book.image" :alt="book.title">
          <div class="book-info">
            <h4>{{ book.title }}</h4>
            <p class="price">{{ formatPrice(book.price) }}</p>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import { useRouter } from 'vue-router'
  import { bookService } from '@/services/bookService'
  
  const props = defineProps({
    category: {
      type: String,
      required: true
    },
    currentBookId: {
      type: String,
      required: true
    }
  })
  
  const router = useRouter()
  const relatedBooks = ref([])
  
  const formatPrice = (price) => {
    if (!price) return 'Ücretsiz'
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(parseFloat(price.replace(/[^0-9.-]+/g, '')))
  }
  
  const goToBook = (isbn13) => {
    router.push({ name: 'book-detail', params: { isbn13 }})
  }
  
  onMounted(async () => {
    try {
      const books = await bookService.getRelatedBooks(props.category)
      // Mevcut kitabı listeden çıkar
      relatedBooks.value = books.filter(book => book.isbn13 !== props.currentBookId)
                               .slice(0, 4) // Sadece 4 benzer kitap göster
    } catch (error) {
      console.error('Error fetching related books:', error)
    }
  })
  </script>
  
  <style scoped>
  .related-books {
    margin-top: 2rem;
    padding: 1rem;
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  }
  
  .books-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 1rem;
    margin-top: 1rem;
  }
  
  .book-card {
    cursor: pointer;
    transition: transform 0.3s ease;
    border-radius: 8px;
    overflow: hidden;
    background: #f8f9fa;
  }
  
  .book-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  }
  
  .book-card img {
    width: 100%;
    height: 200px;
    object-fit: contain;
  }
  
  .book-info {
    padding: 1rem;
  }
  
  .book-info h4 {
    margin: 0;
    font-size: 0.9rem;
    color: #2c3e50;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  
  .price {
    color: #42b883;
    margin-top: 0.5rem;
    font-weight: 600;
  }
  </style>