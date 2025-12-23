<template>
	<div>背景颜色 :</div>
	<div class="pl16 pr16 flex items-center">
		<el-color-picker v-model="nodeConfig.background" @change="lazyUpdateValue('background')" />
		<el-input
			class="pl10"
			v-model="nodeConfig.background"
			@keyup.enter="lazyUpdateValue('background')"
			@blur="lazyUpdateValue('background')"
		/>
	</div>
	<div>边框颜色 :</div>
	<div class="pl16 pr16 flex items-center">
		<el-color-picker v-model="nodeConfig.color" show-alpha @change="lazyUpdateValue('color')" />
		<el-input
			class="pl10"
			v-model="nodeConfig.color"
			@keyup.enter="lazyUpdateValue('color')"
			@blur="lazyUpdateValue('color')"
		/>
	</div>
</template>

<script lang="ts" setup>
import { useConfig } from "../../composables";

const { config: nodeConfig, lazyUpdateValue } = useConfig();
</script>

<style lang="scss" scoped></style>
