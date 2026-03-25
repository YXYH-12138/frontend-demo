<template>
	<div class="popup-pane">
		<div class="font-600">{{ row.stnm }}</div>
		<div pt8 flex flex-col gap-2>
			<span>时间：{{ row.time }}</span>
			<span>水位：{{ row.h }}m</span>
			<span>流量：{{ row.q }}m³/s</span>
		</div>
	</div>
</template>

<script lang="ts" setup>
defineProps<{ row: any }>();
</script>

<style lang="scss" scoped></style>
