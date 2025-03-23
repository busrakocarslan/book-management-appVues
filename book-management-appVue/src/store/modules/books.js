import { bookService } from '@/services/bookService'

export default {
  namespaced: true,

  state: {
    books: [],
    searchQuery: '',
    loading: false,
    error: null
  },

  getters: {
    getAllBooks: state => state.books,
    getSearchQuery: state => state.searchQuery
  },

  mutations: {
    SET_BOOKS(state, books) {
      state.books = books
    },
    SET_SEARCH_QUERY(state, query) {
      state.searchQuery = query
    },
    SET_LOADING(state, status) {
      state.loading = status
    },
    SET_ERROR(state, error) {
      state.error = error
    }
  },

  actions: {
    async searchBooks({ commit }, query = 'javascript') {
      commit('SET_LOADING', true)
      commit('SET_SEARCH_QUERY', query)
      try {
        const books = await bookService.searchBooks(query)
        commit('SET_BOOKS', books)
      } catch (error) {
        commit('SET_ERROR', error.message)
      } finally {
        commit('SET_LOADING', false)
      }
    },
    async addBook({ commit, state }, bookData) {
      commit('SET_LOADING', true)
      try {
        // LocalStorage'a kaydet
        const books = [...state.books, bookData]
        commit('SET_BOOKS', books)
        return bookData
      } catch (error) {
        commit('SET_ERROR', error.message)
        throw error
      } finally {
        commit('SET_LOADING', false)
      }
    }

  }
}