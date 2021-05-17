import Vue from 'vue'
import App from './App.vue'
import "./directives"
import "./required"
import "@/components"
import router from "@/router"

import "./assets/css/reset.css"

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
