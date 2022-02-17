import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '../store'

Vue.use(VueRouter)

const ifNotAuthenticated = (to, from, next) => {
  if (!store.getters.getLoginStatus) {
    next()
    return
  }
  next('/')
}

const ifAuthenticated = (to, from, next) => {
  if (store.getters.getLoginStatus) {
    next()
    return
  }
  next('/')
}

const routes = [
  {
    path: '/',
    name: 'Login',
    component: () => import('../components/Login.vue'),
    beforeEnter: ifNotAuthenticated,
  },
  {
    path: '/default',
    name: 'Default',
    component: () => import('../components/Default.vue'),
    beforeEnter: ifAuthenticated,
  },
  {
    path: '/myOrders',
    name: 'MyOrders',
    component: () => import('../components/MyOrders.vue'),
    beforeEnter: ifAuthenticated,
  },
  {
    path: '/myProducts',
    name: 'MyProducts',
    component: () => import('../components/MyProducts.vue'),
    beforeEnter: ifAuthenticated,
  },
  {
    path: '/upload-products',
    name: 'UploadProducts',
    component: () => import('../components/UploadProducts.vue'),
    beforeEnter: ifAuthenticated,
  },

]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
