import axios from 'axios'

const API_KEY = 'YOUR_API_KEY' // https://api.exchangerate-api.com üzerinden ücretsiz API key alabilirsiniz
const BASE_URL = 'https://v6.exchangerate-api.com/v6'

export default {
  namespaced: true,

  state: {
    rates: null,
    loading: false,
    error: null,
    lastFetch: null
  },

  mutations: {
    SET_RATES(state, rates) {
      state.rates = rates
      state.lastFetch = Date.now()
    },
    SET_LOADING(state, loading) {
      state.loading = loading
    },
    SET_ERROR(state, error) {
      state.error = error
    }
  },

  actions: {
    async fetchRates({ commit, state }) {
      // Cache kontrolü - 1 saat
      if (state.rates && state.lastFetch && Date.now() - state.lastFetch < 3600000) {
        return state.rates
      }

      commit('SET_LOADING', true)
      try {
        const response = await axios.get(`${BASE_URL}/${API_KEY}/latest/USD`)
        commit('SET_RATES', response.data.conversion_rates)
        return response.data.conversion_rates
      } catch (error) {
        commit('SET_ERROR', error.message)
        // Hata durumunda örnek kurlar
        const mockRates = {
          USD: 1,
          EUR: 0.85,
          TRY: 30.5,
          GBP: 0.73
        }
        commit('SET_RATES', mockRates)
        return mockRates
      } finally {
        commit('SET_LOADING', false)
      }
    }
  },

  getters: {
    getRates: state => state.rates,
    isLoading: state => state.loading,
    getError: state => state.error
  }
}