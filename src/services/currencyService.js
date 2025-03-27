import axios from 'axios'

const API_KEY = import.meta.env.VITE_CURRENCY_API_KEY// import meta env vıte şeklinde kullanmadığımda api keyi bulamadı
const BASE_URL = 'https://api.collectapi.com/economy/currencyToAll'
export const currencyService = {
  async getRates(base = 'USD', int = 10) {
    try {
      const response = await axios.get(
        `${BASE_URL}?int=${int}&base=${base}`,
        {
          headers: {
            'content-type': 'application/json',
            'authorization': `apikey ${API_KEY}`
          }
        }
      )
      console.log('Fetched exchange rates:', response.data)
      if (response.data.success) {
        const rates = {}
        response.data.result.data.forEach(item => {
          rates[item.code] = item.rate
        })
        return rates
      } else {
        throw new Error('Currency API returned unsuccessful response')
      }
    } catch (error) {
      console.error('Error fetching currency rates:', error)
      throw error
    }
  }
}
