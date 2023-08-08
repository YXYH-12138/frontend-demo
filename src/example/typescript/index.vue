<script lang="ts" setup>
import { ref, watchEffect, type Ref } from "vue";
import { getFy2Data } from "@/api/modules";
import { sleep } from "@/utils/main";
import { Message } from "@/components/VMessage";

const a = ref(0);

async function getData() {
	const data = await getFy2Data();
	if (a.value % 2 == 0) {
		await sleep(2000);
		return data.data.data.slice(0, 2);
	} else {
		return data.data.data;
	}
}

const data = computedAsync(async () => {
	const data = await getData();
	return data;
}, []);

function computedAsync<T>(callback: () => T | Promise<T>, initialState?: T): Ref<T> {
	const current = ref(initialState) as Ref<T>;
	let counter = 0;

	watchEffect(async (onInvalidate) => {
		counter++;
		const counterAtBeginning = counter;
		try {
			const value = await callback();
			if (counterAtBeginning === counter) {
				current.value = value;
			}
			onInvalidate(() => {
				console.log("end");
			});
		} catch (error) {
			//
		}
	});

	return current;
}

let i = 0;
const showMessage = () => Message({ message: i++ + "" });

// console.log(a.value);
</script>

<template>
	<div class="box">
		<el-button @click="showMessage">message</el-button>
		<!-- <el-button @click="a++">+1</el-button>{{ a }} -->
		<!-- <el-table :data="data" border height="400px">
			<el-table-column prop="title" label="title" width="180" />
			<el-table-column prop="dateTime" label="dateTime" width="180" />
			<el-table-column prop="filename" label="filename" />
		</el-table> -->
	</div>
</template>

<style lang="scss" scoped>
.box {
	margin: 20px;
	width: 500px;
	height: 500px;
	/* background-color: rgba($color: #000000, $alpha: 0.2); */
}
</style>
