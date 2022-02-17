import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import Login from './Module/login'
import Mydefault from './Module/mydefault'
import Orders from './Module/orders'
import Products from './Module/products'
import Error from './Module/error'

Vue.use(Vuex)

export default new Vuex.Store({
  plugins: [
    createPersistedState({
      storage: window.sessionStorage
    })
  ],
  state: { },
  getters: { },
  mutations: { },
  actions: { },
  modules: {
    Login,
    Mydefault,
    Orders,
    Products,
    Error
  }
})
