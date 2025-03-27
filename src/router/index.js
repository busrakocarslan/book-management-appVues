import { createRouter, createWebHistory } from 'vue-router'
import store from '../store'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/HomeView.vue'),// lazyloading için en baştan import etmiyorum
      meta: { requiresAuth: true }// sadece giriş yapmış kullanıcıların görebilmesi için ekledim.
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/auth/LoginView.vue'),
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/auth/RegisterView.vue'),
      meta: { requiresGuest: true }
    },
    {
      path: '/forgot-password',
      name: 'forgot-password',
      component: () => import('../views/auth/ForgotPassword.vue'),
      meta: { requiresGuest: true }
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('../views/ProfileView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/book/:isbn13',
      name: 'book-detail',
      component: () => import('../views/books/BookDetailView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path:'/add-book',
      name: 'add-book',
      component: () => import('../views/books/AddBookView.vue'),
      meta: { requiresAuth: true }
    }

  ]
})

// Navigation Guard: Giriş yapılmamışsa ilgili sayfalara erişimi engellemek için ekledim.
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