import axios from 'axios'

const BASE_URL = 'https://api.itbook.store/1.0'

export const bookService = {
  async searchBooks(query = '') {
    try {
      const response = await axios.get(`${BASE_URL}/search/${query}`)
      return response.data.books
    } catch (error) {
      console.error('Error fetching books:', error)
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