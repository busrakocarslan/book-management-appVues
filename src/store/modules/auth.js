export default {
  namespaced: true,

  state: {
    token: localStorage.getItem('user-token') || '',
    user: JSON.parse(localStorage.getItem('user')) || null,
    loading: false,
    error: null,
  },

  getters: {
    isAuthenticated: (state) => !!state.token,
    currentUser: (state) => state.user,
    isLoading: (state) => state.loading,
    error: (state) => state.error,
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
    },
  },

  actions: {
    async register({ commit }, credentials) {
      commit('SET_LOADING', true)
      commit('SET_ERROR', null)

      try {
        const users = JSON.parse(localStorage.getItem('users') || '[]')
        const existingUser = users.find((user) => user.email === credentials.email)

        if (existingUser) {
          throw new Error('Bu email adresi zaten kayıtlı!')
        }

        const newUser = {
          id: Date.now(),
          name: credentials.name,
          email: credentials.email,
          password: credentials.password, 
          createdAt: new Date().toISOString(),
        }

        users.push(newUser)
        localStorage.setItem('users', JSON.stringify(users))

        const token = `token-${Math.random()}`

        // Hassas bilgileri çıkarmak için 
        const { password, ...safeUser } = newUser

        commit('SET_TOKEN', token)
        commit('SET_USER', safeUser)
        return safeUser
      } catch (error) {
        commit('SET_ERROR', 'Kayıt işlemi başarısız oldu. Lütfen tekrar deneyin.')
        throw error
      } finally {
        commit('SET_LOADING', false)
      }
    },

    async login({ commit }, credentials) {
      commit('SET_LOADING', true)
      commit('SET_ERROR', null)

      try {
        const users = JSON.parse(localStorage.getItem('users') || '[]')

        const user = users.find((user) => user.email === credentials.email)

        if (!user) {
          throw new Error('Kullanıcı bulunamadı!')
        }

        if (user.password !== credentials.password) {
          throw new Error('Hatalı şifre!')
        }

        const token = `token-${Math.random()}`

        const { password, ...safeUser } = user

        commit('SET_TOKEN', token)
        commit('SET_USER', safeUser)
        return safeUser
      } catch (error) {
        commit('SET_ERROR', 'Giriş başarısız. Lütfen bilgilerinizi kontrol edin.')
        throw error
      } finally {
        commit('SET_LOADING', false)
      }
    },

    async forgotPassword({ commit }, email) {
      commit('SET_LOADING', true)
      commit('SET_ERROR', null)

      try {
        await new Promise((resolve) => setTimeout(resolve, 1000))
        return {
          success: true,
          message: 'Şifre sıfırlama talimatları e-postanıza gönderildi.',
        }
      } catch (error) {
        commit('SET_ERROR', 'Şifre sıfırlama işlemi başarısız oldu.')
        throw error
      } finally {
        commit('SET_LOADING', false)
      }
    },

    async updateProfile({ commit, state }, profileData) {
      commit('SET_LOADING', true)
      commit('SET_ERROR', null)

      try {
        await new Promise((resolve) => setTimeout(resolve, 1000))

        const updatedUser = {
          ...state.user,
          ...profileData,
          updatedAt: new Date().toISOString(),
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

    logout({ commit }) {
      commit('CLEAR_AUTH')
    },
  },
}
