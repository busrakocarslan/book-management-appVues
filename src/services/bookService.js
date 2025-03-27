import axios from 'axios'

const BASE_URL = 'https://api.itbook.store/1.0'

export const bookService = {
  async searchBooks(query = '') {
    try {
      const url = query ? `/search/${query}` : '/new'
      const response = await axios.get(`${BASE_URL}${url}`)
      console.log('API Response:', response.data)      
    
      const books = response.data.books || []
      return books.map(book => ({
        ...book,
        language: book.language || 'en', 
        category: book.category || 'Programming',
        year: book.year || new Date().getFullYear() 
      }))
    } catch (error) {
      console.error('API Error:', error)
      throw new Error('Kitaplar yüklenirken bir hata oluştu')
    }
  },

  async getBookDetail(isbn13) {
    try {
      const response = await axios.get(`${BASE_URL}/books/${isbn13}`)
      return response.data
    } catch (error) {
      throw error
    }
  },

  async getRelatedBooks(category = 'programming') {
    try {
     
      const response = await axios.get(`${BASE_URL}/search/$/${category}}`)      
      return response.data && response.data.books || []     
    } catch (error) {
      console.error('İlgili kitaplar yüklenirken hata:', error.message)
      return []
    }
  }
}