import Router from "vue-router"
import Vue from "vue"

Vue.use(Router)

export default new Router({
  routes: [
    {
      redirect: '/cascader',
      path: '/',
    },
    {
      component: () => import('../example/ex-cascader.vue'),
      path: '/cascader',
      meta: {
        title: '级联组件'
      }
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

