<template>
	<el-input v-bind="$attrs">
		<template v-for="(_, key) in $slots" #[key]="data">
			<slot :name="key" v-bind="data" />
		</template>
	</el-input>
</template>

<script lang="ts" setup>
import { useSlots } from "vue";

console.log(useSlots());
</script>

<style lang="scss" scoped></style>
