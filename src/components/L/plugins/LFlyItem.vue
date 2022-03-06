<script lang="ts" setup>
import { inject, provide } from "vue-demi";
import { flyContextKey, flyKey } from "../context";

const props = defineProps<{ name: string }>();

const flyContext = inject(flyContextKey)!;
const { markerMap } = flyContext;

provide(flyKey, props.name);

markerMap.has(props.name) || markerMap.set(props.name, []);
</script>

<template>
	<slot></slot>
</template>
