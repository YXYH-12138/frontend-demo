<script lang="ts" setup>
import { getFy2DataByAxios } from "@/api/modules";
import { onMounted } from "vue";

const { run, data, loading } = getFy2DataByAxios();

// run("1");
</script>

<template>
	<div class="box">
		<el-button type="primary" @click="run()">load</el-button>
		<el-button type="danger" @click="run()">unsubscribe</el-button>
		<el-table v-loading="loading" :data="data.data.data" border height="400px">
			<el-table-column prop="title" label="title" width="180" />
			<el-table-column prop="dateTime" label="dateTime" width="180" />
			<el-table-column prop="filename" label="filename" />
		</el-table>
	</div>
	<svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
		<!-- 绘制上半部分圆柱 -->
		<ellipse cx="100" cy="50" rx="40" ry="20" fill="gray" />
		<rect x="60" y="30" width="80" height="40" fill="gray" />

		<!-- 绘制下半部分圆柱 -->
		<ellipse cx="100" cy="150" rx="40" ry="20" fill="gray" />
		<rect x="60" y="130" width="80" height="40" fill="gray" />

		<!-- 连接上下两部分 -->
		<path d="M60,30 L60,130" stroke="gray" />
		<path d="M140,30 L140,130" stroke="gray" />
	</svg>
</template>

<style scoped>
.box {
	padding: 20px;
}
#myCanvas {
	/* width: 600px;
	height: 400px; */
}
</style>
