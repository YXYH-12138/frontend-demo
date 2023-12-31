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
	},
	{
		name: "leaflet-js",
		path: "/leaflet-js",
		meta: { title: "leaflet-js" },
		component: () => import("@/example/leaflet-js/index.vue")
	},
	{
		name: "typescript",
		path: "/typescript",
		meta: { title: "typescript" },
		component: () => import("@/example/typescript/index.vue")
	},
	{
		name: "components",
		path: "/components",
		meta: { title: "components" },
		component: () => import("@/example/components/index.vue")
	},
	{
		name: "info-scroll",
		path: "/info-scroll",
		meta: { title: "消息滚动" },
		component: () => import("@/example/info-scroll/index.vue")
	},
	{
		name: "vxe-table",
		path: "/vxe-table",
		meta: { title: "vxe-table" },
		component: () => import("@/example/vxe-table/index.vue")
	}
];

const router = createRouter({
	history: createWebHashHistory(),
	routes
});

router.beforeEach(() => {
	cancelAll();
	return true;
});

export default router;
