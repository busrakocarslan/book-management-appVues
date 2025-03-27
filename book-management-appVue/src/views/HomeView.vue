<template>
  <div class="home">
    <!-- Header Section -->
    <div class="header">
      <div class="left-section">
        <h1>Kitap Listesi</h1>
        <button 
      @click="router.push('/add-book')" 
      class="add-book-btn"
    >
      <i class="fas fa-plus"></i>Kitap Ekle
    </button>
        <div class="view-controls">
          <button 
            :class="['view-btn', { active: viewMode === 'grid' }]"
            @click="viewMode = 'grid'"
          >
            <i class="fas fa-th"></i> Grid
          </button>
          <button 
            :class="['view-btn', { active: viewMode === 'list' }]"
            @click="viewMode = 'list'"
          >
            <i class="fas fa-list"></i> Liste
          </button>
        </div>
      </div>

      <div class="filter-controls">
        <div class="search-container">
          <input 
            type="text" 
            v-model="searchQuery" 
            @input="handleSearch"
            placeholder="Kitap ara..."
            class="search-input"
          />
        </div>

        <select v-model="sortBy" class="sort-select">
          <option value="title">İsme Göre</option>
          <option value="year">Yayın Tarihine Göre</option>
          <option value="price">Fiyata Göre</option>
        </select>

        <select v-model="currency" class="currency-select">
          <option value="TRY">₺ TRY</option>
          <option value="USD">$ USD</option>
          <option value="EUR">€ EUR</option>
        </select>

        <button @click="showFilters = !showFilters" class="filter-btn">
          Filtreler {{ showFilters ? '▼' : '▲' }}
        </button>
      </div>
    </div>

    <!-- Featured Books Carousel -->
    <div class="featured-books" v-if="featuredBooks.length">
      <h2>Öne Çıkan Kitaplar</h2>
      <div class="carousel">
        <button class="carousel-btn prev" @click="prevSlide">❮</button>
        <div class="carousel-track" :style="carouselStyle">
          <div 
            v-for="(book) in featuredBooks" 
            :key="book.isbn13"
            class="carousel-item"
          >
            <img :src="book.image" :alt="book.title">
            <div class="carousel-info">
              <h3>{{ book.title }}</h3>
              <p>{{ formatPrice(book.price) }}</p>
            </div>
          </div>
        </div>
        <button class="carousel-btn next" @click="nextSlide">❯</button>
      </div>
    </div>

    <!-- Filters Panel -->
    <div v-if="showFilters" class="filters-panel">
      <div class="filter-grid">
        <div class="filter-group">
          <h3>Kategoriler</h3>
          <div class="checkbox-group">
            <label v-for="cat in categories" :key="cat">
              <input 
                type="checkbox" 
                v-model="filters.categories" 
                :value="cat"
              > {{ cat }}
            </label>
          </div>
        </div>

        <div class="filter-group">
          <h3>Dil</h3>
          <select v-model="filters.language" multiple class="language-select">
    <option v-for="lang in availableLanguages" :key="lang.value" :value="lang.value">
      {{ lang.label }}
    </option>
  </select>
        </div>

        <div class="filter-group">
          <h3>Fiyat Aralığı ($)</h3>
          <div class="range-inputs">
            <input 
              type="number" 
              v-model.number="filters.price.min" 
              placeholder="Min"
            >
            <span>-</span>
            <input 
              type="number" 
              v-model.number="filters.price.max" 
              placeholder="Max"
            >
          </div>
        </div>

        <div class="filter-group">
          <h3>Yayın Yılı</h3>
          <div class="range-inputs">
            <input 
              type="number" 
              v-model.number="filters.year.min" 
              placeholder="Başlangıç"
            >
            <span>-</span>
            <input 
              type="number" 
              v-model.number="filters.year.max" 
              placeholder="Bitiş"
            >
          </div>
        </div>

        <label class="filter-group">
          <input 
            type="checkbox" 
            v-model="filters.freeOnly"
          > Sadece Ücretsiz İçerik
        </label>
      </div>
    </div>

    <!-- Books Grid/List -->
    <div 
      :class="['books-container', viewMode]"
      v-infinite-scroll="loadMore"
      infinite-scroll-disabled="loading"
      infinite-scroll-distance="10"
    >
      <div 
        v-for="book in filteredBooks" 
        :key="book.isbn13" 
        class="book-item"
      >
        <div class="book-image">
          <img :src="book.image" :alt="book.title">
          <button 
            :class="['favorite-btn', { active: isFavorite(book.isbn13) }]"
            @click="toggleFavorite(book)"
          >
            ❤
          </button>
        </div>
        <div class="book-info">
          <h3>{{ book.title }}</h3>
          <p class="subtitle">{{ book.subtitle }}</p>
          <p class="price">{{ formatPrice(book.price) }}</p>
          <div class="book-meta">
            <span class="year">{{ book.year }}</span>
            <span class="language">{{ book.language }}</span>
          </div>
          <button @click="viewDetails(book.isbn13)" class="details-btn">
            Detayları Gör
          </button>
        </div>
      </div>
    </div>
  </div>
</template>


<script setup>
import { ref, computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import debounce from 'lodash/debounce'
import VueInfiniteScroll from 'vue-infinite-scroll'
import { currencyService } from '@/services/currencyService' 

const store = useStore()
const router = useRouter()

// State
const viewMode = ref('grid')
const searchQuery = ref('')
const showFilters = ref(false)
const currency = ref('TRY')
const sortBy = ref('title')
const currentSlide = ref(0)
const exchangeRates = ref(null)
const categories = ref([
  'Programming',
  'Money',
  'Career',
  'Business',
  'Design',
  'Marketing',  
])
const availableLanguages = ref([
  { value: 'en', label: 'İngilizce' },
  { value: 'tr', label: 'Türkçe' },
  { value: 'de', label: 'Almanca' },
  { value: 'fr', label: 'Fransızca' },
  { value: 'it', label: 'İtalyanca' },
  { value: 'pt', label: 'Portekizce' }
]);
const filters = ref({
  categories: [],
  language: [],
  price: { min: null, max: null },
  year: { min: null, max: null },
  freeOnly: false
})



// Computed
const books = computed(() => store.getters['books/getAllBooks'])
const loading = computed(() => store.state.books.loading)
const error = computed(() => store.state.books.error)

const featuredBooks = computed(() => 
  books.value.filter(book => parseFloat(book.price) > 30).slice(0, 5)
)

const filteredBooks = computed(() => {
  let result = [...books.value]

  // Filtreler
    // Kategori filtresi
    if (filters.value.categories.length > 0) {
    console.log('Applying category filter:', filters.value.categories)
    result = result.filter(book => {
      if (!book.category) return false
      return filters.value.categories.includes(book.category)
    })
    console.log('After category filter:', result.length, 'books')
  }

    // Dil filtresi
    if (filters.value.language.length > 0) {
    console.log('Applying language filter:', filters.value.language)
    result = result.filter(book => {
      // Dil API'den gelmediyse ya da net değilse kontrolü
      if (!book.language) return false
      return filters.value.language.includes(book.language)
    })
    console.log('After language filter:', result.length, 'books')
  }
  // Yayın yılı filtresi
if (filters.value.year.min !== null) {
  console.log('Applying min year filter:', filters.value.year.min)
  result = result.filter(book => {
    const year = parseInt(book.year) || 0
    return year >= filters.value.year.min
  })
}

if (filters.value.year.max !== null) {
  console.log('Applying max year filter:', filters.value.year.max)
  result = result.filter(book => {
    const year = parseInt(book.year) || 0
    return year <= filters.value.year.max
  })
}

  // Fiyat aralığı filtresi
  if (filters.value.price.min !== null) {
    console.log('Applying min price filter:', filters.value.price.min)
    result = result.filter(book => {
      const price = typeof book.price === 'string' ? 
        parseFloat(book.price.replace(/[^0-9.]/g, '')) : 
        book.price
      return price >= filters.value.price.min
    })
    console.log('After min price filter:', result.length, 'books')
  }

  if (filters.value.price.max !== null) {
    console.log('Applying max price filter:', filters.value.price.max)
    result = result.filter(book => {
      const price = typeof book.price === 'string' ? 
        parseFloat(book.price.replace(/[^0-9.]/g, '')) : 
        book.price
      return price <= filters.value.price.max
    })
    console.log('After max price filter:', result.length, 'books')
  }

    // Ücretsiz içerik
    if (filters.value.freeOnly) {
    console.log('Applying free only filter')
    result = result.filter(book => {
      const price = typeof book.price === 'string' ? 
        parseFloat(book.price.replace(/[^0-9.]/g, '')) : 
        book.price
      return price === 0
    })
    console.log('After free only filter:', result.length, 'books')
  }

  result.sort((a, b) => {
    switch (sortBy.value) {
      case 'title':
        return a.title.localeCompare(b.title)
      case 'year':
        const yearA = a.year ? parseInt(a.year) : 0
        const yearB = b.year ? parseInt(b.year) : 0
        return yearB - yearA
      case 'price':
        const priceA = typeof a.price === 'string' ? 
          parseFloat(a.price.replace(/[^0-9.]/g, '')) : 
          a.price || 0
        const priceB = typeof b.price === 'string' ? 
          parseFloat(b.price.replace(/[^0-9.]/g, '')) : 
          b.price || 0
        return priceA - priceB
      default:
        return 0
    }
  })

  return result
})

// Foksiyonlar
const handleSearch = debounce((event) => {
  const query = event.target.value
  if (query.length >= 3) {
    store.dispatch('books/searchBooks', query)
  }
}, 200)

const loadMore = async () => {
  if (!loading.value) {
    await store.dispatch('books/loadMoreBooks')
  }
}

const toggleFavorite = (book) => {
  store.dispatch('books/toggleFavorite', book)
}

const isFavorite = (isbn13) => {
  return store.getters['books/isFavorite'](isbn13)
}

const formatPrice = (price) => {
  if (!price) return 'Ücretsiz'

  // $ işaretini kaldır ve sayıya çevir
  const usdAmount = typeof price === 'string' ? 
    parseFloat(price.replace(/[^0-9.]/g, '')) : 
    price

  if (isNaN(usdAmount)) return 'Ücretsiz'

  // Para birimi dönüşümü
  let finalAmount = usdAmount
  if (currency.value !== 'USD' && exchangeRates.value) {
    const rate = exchangeRates.value[currency.value]
    if (rate) {
      finalAmount = usdAmount * rate
    }
  }

  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: currency.value,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(finalAmount)
}

const viewDetails = async (isbn13) => {
  try {
    await router.push({
      name: 'book-detail',
      params: { isbn13: isbn13.toString() }
    })
  } catch (error) {
    console.error('Kitap detayına giderken hata:', error)
  }
}

// Carousel Methods
// const nextSlide = () => {
//   if (currentSlide.value < featuredBooks.value.length - 1) {
//     currentSlide.value++
//   }
// }

// const prevSlide = () => {
//   if (currentSlide.value > 0) {
//     currentSlide.value--
//   }
// }

// const carouselStyle = computed(() => ({
//   transform: `translateX(-${currentSlide.value * 100}%)`
// }))

const updateExchangeRates = async () => {
  try {
    const rates = await currencyService.getRates('USD')
    exchangeRates.value = rates
    console.log("Exchange rates updated:", rates)
  } catch (err) {
    console.error("Error updating exchange rates:", err)
  }
}

onMounted(async () => {
  // İlk önce kitapları yükle
  await store.dispatch('books/searchBooks')
  // Döviz kurlarını getir
  updateExchangeRates()
  // 30 dakikada bir kur güncellemesi yap (30 * 60 * 1000 = 1,800,000ms)
  setInterval(() => {
    updateExchangeRates()
  }, 1800000)
})

</script>





<style scoped>
.home {
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.left-section {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
}
.add-book-btn {
  padding: 0.75rem 1rem;
  background: #42b883;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;
  transition: all 0.3s ease;
  margin-right: 1rem;
}

.add-book-btn:hover {
  background: #3aa876;
  transform: translateY(-2px);
  box-shadow: 0 2px 8px rgba(66, 184, 131, 0.2);
}

.add-book-btn i {
  font-size: 1rem;
}

.filter-controls {
  display: flex;
  gap: 1rem;
  align-items: center;
  justify-content:space-between ;
  gap: 5rem;
  flex-wrap: wrap;
}

.search-container {
  position: relative;
  width: 300px;
}

.search-input {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 2px solid #eee;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s;
}

.search-input:focus {
  border-color: #42b883;
  outline: none;
}

.sort-select, .currency-select {
  padding: 0.75rem;
  border: 2px solid #eee;
  border-radius: 8px;
  background: white;
  cursor: pointer;
  min-width: 150px;
}

.filter-btn {
  padding: 0.75rem 1.5rem;
  background: #42b883;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.filter-btn:hover {
  background: #3aa876;
}

.filters-panel {
  background: linear-gradient(135deg, #fafafa, #f2f2f2);
  padding: 1.5rem;
  border: 1px solid #ddd;
  border-radius: 12px;
  margin-top: 1.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  animation: fadeIn 0.5s ease-in-out;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}

.filter-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1.2rem;
}

.filter-group {
  display: flex;
  flex-direction: column;
  background: #fff;
  padding: 1rem;
  border-radius: 8px;
  border: 1px solid #eee;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.04);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.filter-group:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
}

.filter-group h3 {
  margin-bottom: 0.8rem;
  font-size: 1.1rem;
  color: #333;
  border-bottom: 1px solid #eee;
  padding-bottom: 0.3rem;
}

.checkbox-group label,
.filter-group label {
  font-size: 0.95rem;
  color: #555;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
}

.filter-group select,
.filter-group input[type="number"] {
  font-size: 0.95rem;
  padding: 0.5rem;
  margin-top: 0.4rem;
  border: 1px solid #ccc;
  border-radius: 6px;
  outline: none;
  transition: border-color 0.3s ease;
}

.filter-group select:focus,
.filter-group input[type="number"]:focus {
  border-color: #42b883;
}




.view-controls {
  display: flex;
  gap: 0.5rem;
}

.view-btn {
  padding: 0.6rem 1.2rem;
  background: white;
  border: 2px solid #42b883;
  border-radius: 6px;
  color: #42b883;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}


.view-btn.active {
  background: #42b883;
  color: white;
}

.view-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 2px 8px rgba(66, 184, 131, 0.2);
}

/* Books Container */
.books-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  margin-top: 2rem;
}

.books-container.list {
  grid-template-columns: 1fr;
}

.book-item {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
}

.book-item:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 24px rgba(0,0,0,0.15);
}

.book-image {
  position: relative;
  height: 300px;
  overflow: hidden;
}

.book-image img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  transition: transform 0.3s ease;
}
.book-item:hover .book-image img {
  transform: scale(1.1);
}

.favorite-btn {
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  width: 35px;
  height: 35px;
  border-radius: 50%;
  background: white;
  border: none;
  box-shadow: 0 2px 8px rgba(0,0,0,0.15);
  color: #999;
  font-size: 1.2rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  opacity: 1;
}

.book-item:hover .favorite-btn {
  opacity: 1;
}

.favorite-btn.active {
  color: #ff4757;
  
}

.book-info {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  background: linear-gradient(to bottom, #fff, #f8f9fa);
}

.book-info h3 {
  margin: 0;
  font-size: 1rem;
  color: #2c3e50;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.subtitle {
  color: #666;
  margin: 0.5rem 0;
  font-size: 0.85rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.price {
  color: #42b883;
  font-weight: 600;
  font-size: 1.2rem;
  margin: 1rem 0;
}

.book-meta {
  margin-top: auto;
  padding-top: 1rem;
  border-top: 1px solid #eee;
  display: flex;
  justify-content: space-evenly;
  gap: 1rem;
  color: #666;
  font-size: 0.85rem;
  margin-bottom: .5rem;
}
.book-meta .year,
.book-meta .language {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.25rem 0.75rem;
  background: #f8f9fa;
  border-radius: 4px;
  font-size: 0.8rem;
  color: #42b883;
  border: 1px solid #eee;
}
.book-meta .year::before {
  content: "📅";
}

.book-meta .language::before {
  content: "🌐";
}

.book-meta .year:hover,
.book-meta .language:hover {
  background: #42b883;
  color: white;
  border-color: #42b883;
}

.details-btn {
  width: 100%;
  padding: 0.75rem;
  background: #42b883;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.details-btn:hover {
  background: #3aa876;
}

/* Responsive kısmı */
@media (max-width: 1200px) {
  .books-container {
    grid-template-columns: repeat(2, 1fr);
  }
}
@media (max-width: 768px) {
  .header {
    flex-direction: column;
    align-items: stretch;
  }
  .books-container {
    grid-template-columns: 1fr;
  }
  .left-section {
    flex-direction: column;
    align-items: stretch;
  }

  .search-container {
    width: 100%;
  }

  .filter-controls {
    flex-direction: column;
  }

  .sort-select, .currency-select {
    width: 100%;
  }
}
</style>