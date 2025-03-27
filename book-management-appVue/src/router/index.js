import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/auth/LoginView.vue'
import BookDetailView from '../views/books/BookDetailView.vue'
import AddBookView from '../views/books/AddBookView.vue'
import RegisterView from '../views/auth/RegisterView.vue'
import ForgotPasswordView from '../views/auth/ForgotPassword.vue'
import ProfileView from '../views/ProfileView.vue'
import store from '../store'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: { requiresAuth: true }// sadece giriş yapmış kullanıcıların görebilmesi için ekledim.
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView,
      meta: { requiresGuest: true }
    },
    {
      path: '/forgot-password',
      name: 'forgot-password',
      component: ForgotPasswordView,
      meta: { requiresGuest: true }
    },
    {
      path: '/profile',
      name: 'profile',
      component: ProfileView,
      meta: { requiresAuth: true }
    },
    {
      path: '/book/:isbn13',
      name: 'book-detail',
      component: BookDetailView,
      meta: { requiresAuth: true }
    },
    {
      path:'/add-book',
      name: 'add-book',
      component:AddBookView,
      meta: { requiresAuth: true }
    }

  ]
})

// Navigation Guard: Giriş yapılmamışsa ilgili sayfalara erişimi engelle
router.beforeEach((to, from, next) => {
  const isAuthenticated = store.getters['auth/isAuthenticated']
  if (to.meta.requiresAuth && !isAuthenticated) {
    next({ name: 'login' })
  } else if (to.meta.requiresGuest && isAuthenticated) {
    next({ name: 'home' })
  } else {
    next()
  }
})

export default router