import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '../views/HomePage.vue'
import ShopPage from '../views/ShopPage.vue'
import ProductPage from '../views/ProductPage.vue'
import CartPage from '../views/CartPage.vue'
import Checkouts from '../views/Checkouts.vue'
import FinalPage from '../views/FinalPage.vue'
import LoginPage from '../views/LoginPage.vue'
import AdminPanel from '../views/AdminPanel.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomePage
    },
    {
      path: '/shop',
      name: 'shop',
      component: ShopPage
    },
    {
      path: '/product-page/:id',
      name: 'product-page',
      component: ProductPage
    },
    {
      path: '/cart',
      name: 'cart',
      component: CartPage
    },
    {
      path: '/about-us',
      name: 'about-us',
      component: () => import('../views/AboutUs.vue')
    },
    {
      path: '/checkouts',
      name: 'checkouts',
      component: Checkouts
    },
    {
      path: '/final-page/:id',
      name: 'final-page',
      component: FinalPage
    },
    {
      path: '/admin',
      name: 'login',
      component: LoginPage
    },
    {
      path: '/admin-panel',
      name: 'admin-panel',
      component: AdminPanel,
      meta: { requiresAuth: true }
    }
  ],
  /* To open the new page from the top. */
  scrollBehavior(to, from, savedPosition) {
    return { left: 0, top: 0 };
  }
})

// Admin sayfaları için güvenlik kontrolü
router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth) {
    const isAdmin = localStorage.getItem('isAdmin') === 'true'
    if (!isAdmin) {
      next('/admin')
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router
