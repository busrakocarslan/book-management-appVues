export default {
    namespaced: true,
    
    state: {
      token: localStorage.getItem('user-token') || '',
      user: JSON.parse(localStorage.getItem('user')) || null,
    },
  
    getters: {
      isAuthenticated: state => !!state.token,
      currentUser: state => state.user,
    },
  
    mutations: {
      SET_TOKEN(state, token) {
        state.token = token
        localStorage.setItem('user-token', token)
      },
      SET_USER(state, user) {
        state.user = user
        localStorage.setItem('user', JSON.stringify(user))
      },
      CLEAR_AUTH(state) {
        state.token = ''
        state.user = null
        localStorage.removeItem('user-token')
        localStorage.removeItem('user')
      }
    },
  
    actions: {
      login({ commit }, credentials) {
        // Simüle edilmiş login
        return new Promise((resolve) => {
          setTimeout(() => {
            const token = 'fake-token-' + Math.random()
            const user = {
              id: 1,
              email: credentials.email,
              name: 'Test User'
            }
            commit('SET_TOKEN', token)
            commit('SET_USER', user)
            resolve(user)
          }, 300)
        })
      },
  
      logout({ commit }) {
        commit('CLEAR_AUTH')
      }
    }
  }