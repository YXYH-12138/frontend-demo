<template>
	<div class="scroll-item" :style="style">
		<slot></slot>
	</div>
</template>

<script lang="ts">
import { inject } from "vue-demi";
import { Context } from "./token";

export default {
	setup() {
		const { isHorizontal, space } = inject(Context) as any;

		const style = {
			display: isHorizontal ? "inline-block" : "block",
			[isHorizontal ? "margin-left" : "margin-top"]: space + "px"
		};

		return { style };
	}
};
</script>

<style lang="scss" scoped>
.scroll-item {
	width: auto;
	&:first-child {
		margin: 0 !important;
	}
}
</style>
