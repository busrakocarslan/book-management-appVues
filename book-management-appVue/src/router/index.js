import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/auth/LoginView.vue'
import BookDetailView from '../views/books/BookDetailView.vue'
import AddBookView from '../views/books/AddBookView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: { requiresAuth: true }
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView
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

// Navigation Guard
router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('user-token')
  
  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login')
  } else {
    next()
  }
})

export default router