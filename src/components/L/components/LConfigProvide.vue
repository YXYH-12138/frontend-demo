<script lang="ts" setup>
import { provide } from "vue-demi";
import { iconUrlKey } from "../context";

const props = defineProps<{
	iconRetinaUrl?: string;
	iconUrl?: string;
	shadowUrl?: string;
}>();

provide(iconUrlKey, props);
</script>

<template>
	<slot></slot>
</template>
