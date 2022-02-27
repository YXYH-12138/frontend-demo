import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";

export const routes: RouteRecordRaw[] = [
  {
    path: "/",
    redirect: "/leaflet",
    component: () => import("@/example/leaflet.vue")
  },
  {
    name: "leflet",
    path: "/leaflet",
    meta: { title: "leflet" },
    component: () => import("@/example/leaflet/index.vue")
  }
];

export default createRouter({
  history: createWebHashHistory(),
  routes
});
