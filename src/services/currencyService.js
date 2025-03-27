import axios from 'axios'

// const API_KEY = import.meta.env.VITE_CURRENCY_API_KEY// import meta env vıte şeklinde kullanmadığımda api keyi bulamadı
// const BASE_URL = 'https://api.collectapi.com/economy/currencyToAll'
// export const currencyService = {
//   async getRates(base = 'USD', int = 10) {
//     try {
//       const response = await axios.get(
//         `${BASE_URL}?int=${int}&base=${base}`,
//         {
//           headers: {
//             'content-type': 'application/json',
//             'authorization': `apikey ${API_KEY}`
//           }
//         }
//       )
//       console.log('Fetched exchange rates:', response.data)
//       if (response.data.success) {
//         const rates = {}
//         response.data.result.data.forEach(item => {
//           rates[item.code] = item.rate
//         })
//         return rates
//       } else {
//         throw new Error('Currency API returned unsuccessful response')
//       }
//     } catch (error) {
//       console.error('Error fetching currency rates:', error)
//       throw error
//     }
//   }
// }
// currencyService.js
export const currencyService = {
  async getRates(base = 'USD') {
    try {
      const response = await fetch(`https://open.er-api.com/v6/latest/${base}`)
      const data = await response.json()
      
      if (data && data.rates) {
        return data.rates
      } else {
        throw new Error('Invalid response format')
      }
    } catch (error) {
      console.error('Error fetching exchange rates:', error)
      return {
        USD: 1,
        EUR: 0.93,
        TRY: 32.56,
        GBP: 0.81
      }
    }
  }
}