<script lang="ts" setup>
import { ref } from "vue-demi";
import { HTabs, HTabItem } from "./HTabs";

const activeName = ref("first");

function handleClick(val: string) {
	console.log(val);
}
</script>

<template>
	<HTabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
		<HTabItem label="User" name="first">123</HTabItem>
		<HTabItem label="Config" name="second">Config</HTabItem>
		<HTabItem label="Role" name="third">Role</HTabItem>
		<HTabItem label="Task" name="fourth">Task</HTabItem>
	</HTabs>
</template>

<style lang="scss" scoped></style>
