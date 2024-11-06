<script lang="ts" setup>
import { provide } from " vue";
import { iconUrlKey } from "../context";

const props = defineProps<{
	iconRetinaUrl?: string | Promise<string>;
	iconUrl?: string | Promise<string>;
	shadowUrl?: string | Promise<string>;
}>();

provide(iconUrlKey, props);
</script>

<template>
	<slot></slot>
</template>
