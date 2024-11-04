<template>
	<div></div>
	<!-- <el-button class="m-10px" type="primary" @click="loadWord" v-show="visible">加载</el-button> -->
	<!-- <vxe-modal v-model="visible" width="80%" height="80%">
		<PreviewWord :data="buffer" :visible="visible" />
	</vxe-modal> -->
	<!-- <div ref="refWord" /> -->
</template>

<script lang="ts" setup>
import { onMounted, ref, shallowRef, watchEffect } from "vue";
// import PreviewWord from "@/components/PreviewWord/index.vue";

const visible = ref(false);

// const buffer = shallowRef<ArrayBuffer>();

function loadWord() {
	fetch("/安徽项目验收意见.docx")
		.then((res) => res.arrayBuffer())
		.then((data) => {
			visible.value = true;
			buffer.value = data;
		});
}

// watchEffect(() => {
// 	console.log(visible.value);
// });

setTimeout(() => {
	watchEffect(() => {
		console.log(visible.value);
	});
});
</script>

<style lang="scss" scoped></style>
