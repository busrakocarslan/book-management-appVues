import axios from 'axios'

const API_KEY = 'YOUR_API_KEY' // https://exchangeratesapi.io/ üzerinden ücretsiz API key alabilirsiniz
const BASE_URL = 'https://api.exchangeratesapi.io/v1'

export const currencyService = {
  async getRates(base = 'USD') {
    try {
      const response = await axios.get(`${BASE_URL}/latest?access_key=${API_KEY}&base=${base}`)
      return response.data.rates
    } catch (error) {
      console.error('Error fetching rates:', error)
      return null
    }
  }
}