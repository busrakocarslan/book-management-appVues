import { bookService } from '@/services/bookService'

export default {
  namespaced: true,

  state: {
    books: [],
    searchQuery: '',
    loading: false,
    error: null,
    favorites: JSON.parse(localStorage.getItem('favorites') || '[]'),
    currency: 'TRY',
    userBooks: []
  },

  mutations: {
    SET_BOOKS(state, books) {
      // API'den gelen kitapları formatlayarak kaydet
      state.books = books.map(book => ({
        ...book,
        price: book.price || 'Ücretsiz'
      }))
    },
    SET_LOADING(state, status) {
      state.loading = status
    },
    SET_ERROR(state, error) {
      state.error = error
    },
    TOGGLE_FAVORITE(state, book) {
      const index = state.favorites.findIndex(b => b.isbn13 === book.isbn13)
      if (index > -1) {
        state.favorites.splice(index, 1)
      } else {
        state.favorites.push(book)
      }
      localStorage.setItem('favorites', JSON.stringify(state.favorites))
    },
    SET_CURRENCY(state, currency) {
      state.currency = currency
    },
    ADD_USER_BOOK(state, book) {
      state.userBooks.push(book)
    },
    SET_USER_BOOKS(state, books) {
      state.userBooks = books
    }
  },

  actions: {
    async searchBooks({ commit }, query = '') {
      commit('SET_LOADING', true)
      commit('SET_ERROR', null)
      
      try {
        const books = await bookService.searchBooks(query)
        console.log('Fetched books:', books) 
        commit('SET_BOOKS', books)
      } catch (error) {
        console.error('Search error:', error)
        commit('SET_ERROR', error.message)
      } finally {
        commit('SET_LOADING', false)
      }
    },

    toggleFavorite({ commit }, book) {
      commit('TOGGLE_FAVORITE', book)
    },
    async addBook({ commit, rootState }, book) {
      try {
        console.log("Store: addBook başladı", book)
        console.log("Kullanıcı durumu:", rootState.auth.user)
        
        if (!rootState.auth.user) {
          console.error("Kullanıcı bulunamadı")
          throw new Error('Kullanıcı girişi yapılmamış!')
        }
        
        if (!rootState.auth.user.id) {
          console.error("Kullanıcı ID'si bulunamadı")
          throw new Error('Kullanıcı ID bulunamadı!')
        }
        
        if (!book.isbn13 || !book.title || !book.authors) {
          console.error("Zorunlu alanlar eksik", {
            isbn13: book.isbn13,
            title: book.title,
            authors: book.authors
          })
          throw new Error('Zorunlu alanlar eksik')
        }
        
        if (!/^\d{13}$/.test(book.isbn13)) {
          console.error("Geçersiz ISBN13 formatı", book.isbn13)
          throw new Error('Geçersiz ISBN13 formatı')
        }
        
        // Devam eden işlemler...
        const newBook = {
          ...book,
          id: Date.now().toString(),
          userId: rootState.auth.user.id,
          addedAt: new Date().toISOString()
        }
        
        console.log("Oluşturulan kitap:", newBook)
        
        const existingBooks = JSON.parse(localStorage.getItem('userBooks') || '[]')
        console.log("Mevcut kitaplar:", existingBooks.length)
        
        const isDuplicate = existingBooks.some(b => b.isbn13 === book.isbn13)
        if (isDuplicate) {
          console.error("Duplike ISBN13", book.isbn13)
          throw new Error('Bu ISBN13 numarasına sahip bir kitap zaten mevcut')
        }
        
        existingBooks.push(newBook)
        localStorage.setItem('userBooks', JSON.stringify(existingBooks))
        commit('ADD_USER_BOOK', newBook)
        
        console.log("Kitap eklendi ve kaydedildi")
        return newBook
        
      } catch (error) {
        console.error('Store: Kitap ekleme hatası:', error.stack || error)
        throw error
      }
    },
    async loadUserBooks({ commit, rootState }) {
      try {
        const books = JSON.parse(localStorage.getItem('userBooks') || '[]')
        const userBooks = books.filter(book => book.userId === rootState.auth.user?.id)
        commit('SET_USER_BOOKS', userBooks)
        return userBooks
      } catch (error) {
        console.error('Error loading user books:', error)
        throw error
      }
    }
  },

  getters: {
    getAllBooks: state => state.books,
    getSearchQuery: state => state.searchQuery,
    isFavorite: state => isbn13 => 
      state.favorites.some(book => book.isbn13 === isbn13),
    getUserBooks: state => state.userBooks
  }
}