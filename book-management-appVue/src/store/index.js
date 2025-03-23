import { createStore } from 'vuex'
import auth from './modules/auth'
import books from './modules/books'
import currency from './modules/currency'

export default createStore({
  modules: {
    auth,
    books,
    currency
  }
})