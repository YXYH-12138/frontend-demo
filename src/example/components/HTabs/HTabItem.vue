<script lang="ts" setup>
import { inject } from "vue-demi";
import { tabContextKey } from "./token";

interface Props {
	label: string;
	name: string;
}

const props = defineProps<Props>();

const context = inject(tabContextKey, { tabs: [], active: "" });

context.tabs.push({
	name: props.name,
	label: props.label
});
</script>

<template>
	<div class="header-item" v-show="props.name === context.active">
		<slot></slot>
	</div>
</template>

<style lang="scss" scoped></style>
