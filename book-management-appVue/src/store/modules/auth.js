export default {
  namespaced: true,
    
  state: {
    token: localStorage.getItem('user-token') || '',
    user: JSON.parse(localStorage.getItem('user')) || null,
    loading: false,
    error: null
  },

  getters: {
    isAuthenticated: state => !!state.token,
    currentUser: state => state.user,
    isLoading: state => state.loading,
    error: state => state.error
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
    },
    SET_LOADING(state, status) {
      state.loading = status
    },
    SET_ERROR(state, error) {
      state.error = error
    }
  },

  actions: {
    // Register action
    async register({ commit }, credentials) {
      commit('SET_LOADING', true)
      commit('SET_ERROR', null)
      
      try {
        // Önce email kayıtlı mı kontrol et
        const users = JSON.parse(localStorage.getItem('users') || '[]')
        const existingUser = users.find(user => user.email === credentials.email)
        
        if (existingUser) {
          throw new Error('Bu email adresi zaten kayıtlı!')
        }

        // Yeni kullanıcı oluştur
        const newUser = {
          id: Date.now(),
          name: credentials.name,
          email: credentials.email,
          password: credentials.password, // Gerçek projede hash'lenmelidir!
          createdAt: new Date().toISOString()
        }

        // Kullanıcıyı kaydet
        users.push(newUser)
        localStorage.setItem('users', JSON.stringify(users))

        // Token oluştur
        const token = `token-${Math.random()}`
        
        // Hassas bilgileri çıkar
        const { password, ...safeUser } = newUser
        
        commit('SET_TOKEN', token)
        commit('SET_USER', safeUser)
        return safeUser

      } catch (error) {
        commit('SET_ERROR', 'Registration failed. Please try again.')
        throw error
      } finally {
        commit('SET_LOADING', false)
      }
    },

    // Login action
    async login({ commit }, credentials) {
      commit('SET_LOADING', true)
      commit('SET_ERROR', null)

      try {
        // Kullanıcıları getir
        const users = JSON.parse(localStorage.getItem('users') || '[]')
        
        // Email ile kullanıcıyı bul
        const user = users.find(user => user.email === credentials.email)
        
        if (!user) {
          throw new Error('Kullanıcı bulunamadı!')
        }

        // Şifre kontrolü
        if (user.password !== credentials.password) {
          throw new Error('Hatalı şifre!')
        }

        // Token oluştur
        const token = `token-${Math.random()}`
        
        // Hassas bilgileri çıkar
        const { password, ...safeUser } = user

        commit('SET_TOKEN', token)
        commit('SET_USER', safeUser)
        return safeUser

      } catch (error) {
        commit('SET_ERROR', 'Login failed. Please check your credentials.')
        throw error
      } finally {
        commit('SET_LOADING', false)
      }
    },

    // Forgot password action
    async forgotPassword({ commit }, email) {
      commit('SET_LOADING', true)
      commit('SET_ERROR', null)

      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000))
        return { 
          success: true, 
          message: 'Şifre sıfırlama talimatları e-postanıza gönderildi.' 
        }
      } catch (error) {
        commit('SET_ERROR', 'Failed to process password reset request.')
        throw error
      } finally {
        commit('SET_LOADING', false)
      }
    },

    // Update profile action
    async updateProfile({ commit, state }, profileData) {
      commit('SET_LOADING', true)
      commit('SET_ERROR', null)

      try {
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        const updatedUser = {
          ...state.user,
          ...profileData,
          updatedAt: new Date().toISOString()
        }
        
        commit('SET_USER', updatedUser)
        return updatedUser
      } catch (error) {
        commit('SET_ERROR', 'Failed to update profile.')
        throw error
      } finally {
        commit('SET_LOADING', false)
      }
    },

    // Logout action
    logout({ commit }) {
      commit('CLEAR_AUTH')
    }
  }
}