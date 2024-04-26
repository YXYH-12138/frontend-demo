<template>
	<div class="box">
		<el-button type="primary" @click="start">start</el-button>
		<el-button type="warning" @click="handleClear">clear</el-button>
		<TextScroll :data="data" direction="horizontal">
			<template #default="row">
				<span style="border: 1px solid red">
					{{ row.label }}
				</span>
			</template>
			<template #empty> 数据为空 </template>
		</TextScroll>
	</div>
</template>

<script lang="ts" setup>
import { shallowRef } from "vue";
import TextScroll from "@/components/TextScroll/index.vue";

const data = shallowRef<any[]>([]);
start();

function handleClear() {
	data.value = [];
}

function start() {
	data.value = [
		{ label: "1111111111111111111111111111" },
		{ label: "2222222222222222222222222222" },
		{ label: "33333333333333333333333333" },
		{ label: "4" }
		// { label: "55555" }
	];
}
</script>

<style scoped>
.box {
	padding: 20px;
	height: 50px;
}
</style>
