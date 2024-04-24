<template>
	<div class="p-10px w-full box-border">
		<vxe-table
			:data="tableData"
			:dataPasteConfig="{ onDataPaste: handlePaste }"
			:edit-config="{ trigger: 'click', mode: 'cell' }"
		>
			<vxe-column type="seq" width="60"></vxe-column>
			<vxe-column field="name" title="Name" :edit-render="{ name: 'input' }"></vxe-column>
			<vxe-column field="sex" title="Sex"></vxe-column>
			<vxe-column field="age" title="Age"></vxe-column>
		</vxe-table>

		<vxe-table
			:data="tableData"
			:data-paste-config="{ onDataPaste: handlePaste }"
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

function handlePaste(newData: any) {
	console.log(tableData.value);
	// tableData.value = newData;
}
</script>
