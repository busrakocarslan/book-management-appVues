import { createStore } from 'vuex'
import auth from './modules/auth'
import books from './modules/books'
import currency from './modules/currency'

export default createStore({
  strict: process.env.NODE_ENV !== 'production',
  modules: {
    auth,
    books,
    currency
  }
})