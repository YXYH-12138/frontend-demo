<script lang="ts" setup>
import { inject, provide } from "vue-demi";
import { flyContextKey, flyKey } from "../context";

const props = defineProps<{ name: string }>();

const { markerMap } = inject(flyContextKey, { markerMap: undefined });

provide(flyKey, props.name);

markerMap && (markerMap.has(props.name) || markerMap.set(props.name, []));
</script>

<template>
	<slot></slot>
</template>
