<script lang="ts" setup>
import { getFy2Data, getFy2DataByAxios } from "@/api/modules";

const fy1 = getFy2Data()
	.pipe((data) => data.slice(-1))
	.callback("resolve", (data) => {
		console.log(data);
	})
	.callback("catch", (error) => {
		console.log(error);
	})
	.callback("finally", () => {
		console.log("finally");
	})
	.execute();

const reload = () => {
	getFy2DataByAxios();
	fy1.execute();
};
</script>

<template>
	<div class="box">
		<el-button type="primary" @click="reload">load</el-button>
		<el-button type="danger" @click="fy1.cancel()">unsubscribe</el-button>
		<el-table v-loading="fy1.proxy.loading" :data="fy1.proxy.data" border height="400px">
			<el-table-column prop="title" label="title" width="180" />
			<el-table-column prop="dateTime" label="dateTime" width="180" />
			<el-table-column prop="filename" label="filename" />
		</el-table>
	</div>
</template>

<style scoped>
.box {
	padding: 20px;
}
</style>
