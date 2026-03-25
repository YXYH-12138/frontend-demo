<script setup lang="tsx">
// import { ElButton, ElNotification } from "element-plus";
import { routes } from "./router";
import MenuList from "./components/MenuList/index.vue";
// import { UpdateEventName } from "../script/version-check";

let isOpen = false;

// window.addEventListener(UpdateEventName, () => {
// 	if (isOpen) return;

// 	isOpen = true;
// 	const handle = ElNotification({
// 		title: "版本更新提示",
// 		duration: 0,
// 		message: (
// 			<>
// 				<span>发现系统版本更新，请刷新页面~~</span>
// 				<div style={{ marginTop: "10px" }}>
// 					<ElButton type="primary" onClick={() => location.reload()}>
// 						确认刷新
// 					</ElButton>
// 					<ElButton onClick={close}>我知道了</ElButton>
// 				</div>
// 			</>
// 		),
// 		position: "top-right"
// 	});

// 	function close() {
// 		isOpen = false;
// 		handle.close();
// 	}
// });

const menus = { path: "/", children: routes.slice(1) };
</script>

<template>
	<el-container style="height: 100%">
		<el-aside width="200px">
			<MenuList :menus="menus" router />
		</el-aside>
		<el-main class="position-relative">
			<router-view></router-view>
		</el-main>
	</el-container>
</template>

<style>
#app {
	width: 100%;
	height: 100%;
}
.el-main {
	padding: 0;
}
</style>
