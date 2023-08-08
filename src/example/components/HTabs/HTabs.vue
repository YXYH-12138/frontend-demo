<script lang="ts" setup>
import { provide, reactive, toRef } from "vue-demi";
import { tabContextKey, type Context } from "./token";

interface Props {
	modelValue: string;
}
interface Emits {
	(e: "update:modelValue", val: string): void;
	(e: "tabClick", val: string): void;
}

const props = defineProps<Props>();
const emits = defineEmits<Emits>();

const active = toRef(props, "modelValue");

const context: Context = reactive({
	tabs: [],
	active: active
});

provide(tabContextKey, context);

function handleClick(name: string) {
	if (name !== active.value) {
		emits("update:modelValue", name);
		emits("tabClick", name);
	}
}
</script>

<template>
	<div class="h-tabs">
		<div class="h-tabs-header">
			<div
				class="header-item"
				:class="{ active: item.name === modelValue }"
				@click="handleClick(item.name)"
				v-for="item in context.tabs"
				:key="item.name"
			>
				{{ item.label }}
			</div>
		</div>
		<div class="header-contet">
			<slot></slot>
		</div>
	</div>
</template>

<style lang="scss" scoped>
.h-tabs {
	height: 400px;
	.h-tabs-header {
		display: flex;
		.header-item {
			cursor: pointer;
			&.active {
				color: pink;
			}
			&:nth-child(n + 2) {
				margin-left: 20px;
			}
		}
	}
}
</style>
