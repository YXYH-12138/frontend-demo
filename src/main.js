import Vue from 'vue'
import App from './App.vue'
import "./required"
import "@/components"
import router from "@/router"
import store from '@/store'

import "./assets/css/reset.css"

import 'leaflet/dist/leaflet.css'

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
