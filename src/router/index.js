import Router from "vue-router"
import Vue from "vue"

Vue.use(Router)

export default new Router({
  routes: [
    {
      redirect: '/containar-scroll',
      path: '/',
    },
    {
      component: () => import('../example/ex-containar-scroll.vue'),
      path: '/containar-scroll',
      meta: {
        title: '容器滚动组件'
      }
    }
  ]
})

