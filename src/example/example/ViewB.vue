<template>
	<div ref="divRef"></div>
</template>

<script lang="ts" setup>
import { createVNode, onBeforeUnmount, onMounted, ref, render } from "vue";
import PopupPanel from "./PopupPanel.vue";

const divRef = ref<HTMLDivElement>(null);

// 创建父元素
const div = document.createElement("div");
// 将组件生成vnode
const vnode = createVNode(PopupPanel, { row: {} });
// 渲染vnode到父元素中
render(vnode, div);

onMounted(() => {
	divRef.value?.appendChild(div);
	// console.dir(div);
});

onBeforeUnmount(() => {
	render(null, div);
});
</script>

<style lang="scss" scoped></style>
