import Vue from 'vue'
import Vuex from 'vuex'
import { order } from "@/store/module/order"
import VuexPersistence from 'vuex-persist'

Vue.use(Vuex)


const vuexLocal = new VuexPersistence({
  storage: window.localStorage,
  modules: ['order']
})


export default new Vuex.Store({
  state: {
    auth:window.localStorage.getItem("auth")
  },
  mutations: {
    setAuth(state){
      state.auth = window.localStorage.getItem("auth")
    }
  },
  modules:{
    order
  },
  plugins: [vuexLocal.plugin]
})
