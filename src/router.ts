import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";
import { cancelAll } from "@/utils/axios";

export const routes: RouteRecordRaw[] = [
	{
		path: "/",
		redirect: "/nginx"
	},
	// {
	// 	name: "leflet",
	// 	path: "/leaflet",
	// 	meta: { title: "leflet" },
	// 	component: () => import("@/example/leaflet/index.vue")
	// },
	// {
	// 	name: "leaflet-js",
	// 	path: "/leaflet-js",
	// 	meta: { title: "leaflet-js" },
	// 	component: () => import("@/example/leaflet-js/index.vue")
	// },
	// {
	// 	name: "typescript",
	// 	path: "/typescript",
	// 	meta: { title: "typescript" },
	// 	component: () => import("@/example/typescript/index.vue")
	// },
	// {
	// 	name: "components",
	// 	path: "/components",
	// 	meta: { title: "components" },
	// 	component: () => import("@/example/components/index.vue")
	// },
	// {
	// 	name: "info-scroll",
	// 	path: "/info-scroll",
	// 	meta: { title: "消息滚动" },
	// 	component: () => import("@/example/info-scroll/index.vue")
	// },

	// {
	// 	name: "meta2d",
	// 	path: "/meta2d",
	// 	meta: { title: "meta2d" },
	// 	component: () => import("@/example/meta2d/index.vue")
	// }
	// {
	// 	name: "vxe-table",
	// 	path: "/vxe-table",
	// 	meta: { title: "vxe-table" },
	// 	component: () => import("@/example/vxe-table/index.vue")
	// },
	// {
	// 	name: "ol",
	// 	path: "/ol",
	// 	meta: { title: "ol" },
	// 	component: () => import("@/example/openlayer/index.vue")
	// },
	// {
	// 	name: "cesium",
	// 	path: "/cesium",
	// 	meta: { title: "cesium" },
	// 	component: () => import("@/example/cesium/index.vue")
	// }
	// {
	// 	name: "A1",
	// 	path: "/A1",
	// 	meta: { title: "A1" },
	// 	component: () => import("@/example/test-view/A1.vue")
	// },
	// {
	// 	name: "A2",
	// 	path: "/A2",
	// 	meta: { title: "A2" },
	// 	component: () => import("@/example/test-view/A2.vue")
	// }
	// {
	// 	name: "preview-word",
	// 	path: "/preview-word",
	// 	meta: { title: "preview-word" },
	// 	component: () => import("@/example/preview-word/index.vue")
	// }
	// {
	// 	name: "leaflet-freedraw",
	// 	path: "/leaflet-freedraw",
	// 	meta: { title: "leaflet-freedraw" },
	// 	component: () => import("@/example/leaflet-freedraw/index.vue")
	// }
	{
		name: "nginx",
		path: "/nginx",
		meta: { title: "nginx" },
		component: () => import("@/example/nginx/index.vue")
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
