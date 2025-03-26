import { bookService } from '@/services/bookService'

export default {
  namespaced: true,

  state: {
    books: [],
    searchQuery: '',
    loading: false,
    error: null,
    favorites: JSON.parse(localStorage.getItem('favorites') || '[]'),
    currency: 'TRY'
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
    }
  },

  getters: {
    getAllBooks: state => state.books,
    getSearchQuery: state => state.searchQuery,
    isFavorite: state => isbn13 => 
      state.favorites.some(book => book.isbn13 === isbn13)
  }
}