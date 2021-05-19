import Vue from 'vue'
import App from './App.vue'
// import "./directives"
import "./required"
import "@/components"
import router from "@/router"
import store from '@/store'

import "./assets/css/reset.css"

import 'leaflet/dist/leaflet.css'
// 引入Leaflet对象 挂载到Vue上
import * as L from 'leaflet'
Vue.prototype.$L = L

import api from "./api"

Vue.prototype.$api = api

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
