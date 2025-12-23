<template>
	<el-collapse-item title="文本属性" name="station">
		<el-form :model="config" label-width="auto" label-suffix=":">
			<el-form-item label="内容">
				<el-input v-model="config.text" @input="lazyUpdateValue('text', $event)"></el-input>
			</el-form-item>
		</el-form>
		<div>背景颜色：</div>
		<div class="pl16 pr16 flex items-center">
			<el-color-picker
				v-model="config.textBackground"
				show-alpha
				@change="lazyUpdateValue('textBackground')"
			/>
			<el-input
				class="pl10"
				v-model="config.textBackground"
				@keyup.enter="lazyUpdateValue('textBackground')"
				@blur="lazyUpdateValue('textBackground')"
			/>
		</div>
	</el-collapse-item>
</template>

<script lang="ts" setup>
import { useConfig } from "../../composables";

const { config, lazyUpdateValue } = useConfig();
</script>

<style lang="scss" scoped></style>
