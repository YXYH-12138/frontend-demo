import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";
import { cancelAll } from "@/utils/axios";

export const routes: RouteRecordRaw[] = [
	{
		path: "/",
		redirect: "/leaflet"
	},
	{
		name: "leflet",
		path: "/leaflet",
		meta: { title: "leflet" },
		component: () => import("@/example/leaflet/index.vue")
	},
	{
		name: "axios-enhance",
		path: "/axios-enhance",
		meta: { title: "axios-enhance" },
		component: () => import("@/example/axios-enhance/index.vue")
	}
];

const router = createRouter({
	history: createWebHashHistory(),
	routes
});

router.beforeEach((to, from, next) => {
	cancelAll();
	next();
});

export default router;
