import axios from 'axios'

const BASE_URL = 'https://api.itbook.store/1.0'

export const bookService = {
  async searchBooks(query = '') {
    try {
      const url = query ? `/search/${query}` : '/new'
      const response = await axios.get(`${BASE_URL}${url}`)
      console.log('API Response:', response.data)
      
      // API'den gelen kitaplara varsayılan kategori ve dil değerleri atayalım
      // Çünkü bu bilgiler listede yoksa detay sayfasından almamız gerekiyor
      const books = response.data.books || []
      return books.map(book => ({
        ...book,
        language: book.language || 'en', // Varsayılan olarak İngilizce
        category: book.category || 'Programming', // Varsayılan olarak Programlama
        year: book.year || new Date().getFullYear() // Yıl yoksa güncel yıl
      }))
    } catch (error) {
      console.error('API Error:', error)
      throw error
    }
  },

  async getBookDetail(isbn13) {
    try {
      const response = await axios.get(`${BASE_URL}/books/${isbn13}`)
      return response.data
    } catch (error) {
      console.error('Error fetching book detail:', error)
      throw error
    }
  }
}