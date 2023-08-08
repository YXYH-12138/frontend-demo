<script lang="ts" setup>
interface Props {
	counter: number;
}
interface Emits {
	(e: "update:counter", val: number): void;
}

const props = defineProps<Props>();
const emits = defineEmits<Emits>();
</script>

<template>
	<el-button @click="$emit('update:counter', counter + 1)">+1</el-button>
	{{ counter }}
</template>

<style lang="scss" scoped></style>
