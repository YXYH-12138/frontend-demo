<template>
	<div class="box">
		<el-button type="primary" @click="start">start</el-button>
		<el-button type="warning" @click="handleClear">clear</el-button>
		<TextScroll :data="data">
			<template #default="row">
				{{ row.label }}
			</template>
			<template #empty> 数据为空 </template>
			<!-- <TextScrollItem>
				<a href="javascript:void(0)">1111111111111111111111111111</a>
			</TextScrollItem>
			<TextScrollItem>222222222222222222222222222222</TextScrollItem>
			<TextScrollItem>333333333333333333333333333333</TextScrollItem>
			<TextScrollItem>44444444444444</TextScrollItem>
			<TextScrollItem>55555</TextScrollItem> -->
			<!-- <TextScrollItem v-for="(item, index) in data" :key="index">{{ item.label }}</TextScrollItem> -->
		</TextScroll>
	</div>
</template>

<script lang="ts" setup>
import { shallowRef } from "vue";
import TextScroll from "@/components/TextScroll/index.vue";
// import TextScrollItem from "@/components/TextScroll/TextScrollItem.vue";

const data = shallowRef<any[]>([]);
start();

function handleClear() {
	data.value = [];
}

function start() {
	data.value = [
		{ label: "1111111111111111111111111111" },
		{ label: "2222222222222222222222222" },
		{ label: "3333333333333333333333333" },
		{ label: "44444444444444" },
		{ label: "55555" }
	];
}
</script>

<style scoped>
.box {
	padding: 20px;
	height: 50px;
}
</style>
