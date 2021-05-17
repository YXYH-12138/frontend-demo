import Vue from 'vue'
import App from './App.vue'
import "./directives"
import "./element"
import components from "@/components"
import router from "@/router"

import "./assets/css/reset.css"

Vue.config.productionTip = false

Object.keys(components).forEach(name => {
  Vue.component(name, components[name])
})

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
