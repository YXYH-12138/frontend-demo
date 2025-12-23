<template>
	<div class="p-10px w-full box-border">
		<el-button type="primary" @click="handleLoadData">多数据加载</el-button>
		<el-button type="primary" @click="handlePtimizedLoadData">优化多数据加载</el-button>
		<el-button type="primary" @click="download">下载</el-button>
		<vxe-table
			ref="tabltRef"
			height="800"
			:data="tableData"
			:virtual-y-config="{ enabled: true }"
			:dataPasteConfig="{ onDataPaste: handlePaste }"
			:edit-config="{ trigger: 'click', mode: 'cell' }"
		>
			<vxe-column type="seq" width="60"></vxe-column>
			<vxe-column field="name" title="Name" :edit-render="{ name: 'input' }"></vxe-column>
			<vxe-column field="sex" title="Sex"></vxe-column>
			<vxe-column field="age" title="Age"></vxe-column>
		</vxe-table>
	</div>
</template>

<script lang="ts" setup>
import { shallowRef } from "vue";
import { requestHostCallback } from "./schedule";
import { VxeTableInstance } from "vxe-table";

interface RowVO {
	id: number;
	name: string;
	role: string;
	sex: string;
	age: number;
	address: string;
}

const tableData = shallowRef<RowVO[]>([
	{ id: 10001, name: "Test1", role: "Develop", sex: "Man", age: 28, address: "test abc" },
	{ id: 10002, name: "Test2", role: "Test", sex: "Women", age: 22, address: "Guangzhou" },
	{ id: 10003, name: "Test3", role: "PM", sex: "Man", age: 32, address: "Shanghai" },
	{ id: 10004, name: "Test4", role: "Designer", sex: "Women", age: 24, address: "Shanghai" }
]);

const tabltRef = shallowRef<VxeTableInstance>();

function download() {
	tabltRef.value!.exportData({ filename: "test", type: "xlsx" });
}

function handleLoadData() {
	const data = [];
	for (let i = 0; i < 2000; i++) {
		const row = {
			id: i,
			name: `Test${i}`,
			role: "Test",
			sex: "Women",
			age: 22,
			address: "Guangzhou"
		};
		data.push(row);
	}
	tableData.value = data;
}

function handlePtimizedLoadData() {
	const data = [];
	let i = 0,
		currentTime = 0;
	for (let i = 0; i < 2000; i++) {
		data.push({
			id: i,
			name: `Test${i}`,
			role: "Test",
			sex: "Women",
			age: 22,
			address: "Guangzhou"
		});
	}
	tableData.value = data;

	function workLoop(initialTime: number) {
		while (i < 2000) {
			if (initialTime - currentTime < 5) {
				return true;
			}

			currentTime = initialTime;
		}
		return false;
	}

	requestHostCallback(workLoop);
}

function handlePaste(newData: any) {
	console.log(tableData.value);
	// tableData.value = newData;
}
</script>
