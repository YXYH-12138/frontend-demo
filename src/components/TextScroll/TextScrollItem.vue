<template>
	<div class="scroll-item" :style="style" ref="itemRef">
		<slot></slot>
	</div>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref, onBeforeUnmount } from "vue";
import type { RectData, Direction } from "./props";

interface Props {
	index: number;
	space: number;
	direction: Direction;
	reacData: Array<RectData>;
}

const props = defineProps<Props>();

const itemRef = ref<HTMLElement>();

const getSpace = () => {
	if (props.index === 0) return 0;
	return props.space;
};

const style = computed(() => {
	const isHorizontal = props.direction === "horizontal";
	return {
		display: isHorizontal ? "inline-block" : "block",
		[isHorizontal ? "margin-left" : "margin-top"]: getSpace() + "px"
	};
});

onMounted(() => {
	const { index, reacData } = props;
	const { width, height } = itemRef.value!.getBoundingClientRect();
	reacData[index] = { width, height, space: getSpace() };
});

onBeforeUnmount(() => {
	const { index, reacData } = props;
	reacData[index] = { width: 0, height: 0, space: 0 };
});
</script>

<style lang="scss" scoped>
.scroll-item {
	width: auto;
}
</style>
