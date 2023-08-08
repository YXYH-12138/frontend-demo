<template>
	<div class="box">
		<TextScroll>
			<TextScrollItem>1111111111111111111111111111</TextScrollItem>
			<TextScrollItem>222222222222222222222222222222</TextScrollItem>
			<TextScrollItem>333333333333333333333333333333</TextScrollItem>
			<TextScrollItem>44444444444444</TextScrollItem>
			<TextScrollItem>55555</TextScrollItem>
		</TextScroll>
	</div>
</template>

<script lang="ts" setup>
import TextScroll from "@/components/TextScroll/index.vue";
import TextScrollItem from "@/components/TextScroll/TextScrollItem.vue";
</script>

<style scoped>
.box {
	padding: 20px;
	height: 50px;
}
</style>
