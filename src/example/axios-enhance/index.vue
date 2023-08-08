<script lang="ts" setup>
import { getFy2DataByAxios } from "@/api/modules";

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
</template>

<style scoped>
.box {
	padding: 20px;
}
</style>
