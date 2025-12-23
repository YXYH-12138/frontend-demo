<template>
	<el-collapse-item title="节点属性" name="node">
		<div>
			宽度 :
			<el-input v-model.number="pneRect.width" @input="updatePenRect('width', $event)" />
		</div>
		<div style="margin: 15px 0">
			高度 :
			<el-input v-model.number="pneRect.height" @input="updatePenRect('height', $event)" />
		</div>
		<div>
			字体大小 :
			<span>{{ nodeConfig.fontSize }}px</span>
		</div>
		<div class="Progress_item">
			<el-slider
				v-model="nodeConfig.fontSize"
				:show-tooltip="false"
				@input="lazyUpdateValue('fontSize')"
				:min="12"
				:max="22"
				:step="1"
			/>
		</div>
		<div>
			字体粗细 :
			<span>{{ nodeConfig.fontWeight }}</span>
		</div>
		<div class="Progress_item">
			<el-slider
				:show-tooltip="false"
				v-model="nodeConfig.fontWeight"
				@input="lazyUpdateValue('fontWeight')"
				:min="400"
				:max="700"
				:step="100"
			/>
		</div>
		<div class="mt4 mb4">
			文字y轴偏移：
			<el-input-number v-model="nodeConfig.textTop" @input="lazyUpdateValue('textTop')" />
		</div>
		<div class="mt4 mb4">
			文字x轴偏移：
			<el-input-number v-model="nodeConfig.textLeft" @input="lazyUpdateValue('textLeft')" />
		</div>
		<div>字体颜色 :</div>
		<div class="Progress_item lineColor_item">
			<el-color-picker v-model="nodeConfig.textColor" @change="lazyUpdateValue('textColor')" />
			<el-input
				class="pl10"
				v-model="nodeConfig.textColor"
				@keyup.enter="lazyUpdateValue('textColor')"
				@blur="lazyUpdateValue('textColor')"
			/>
		</div>
		<slot></slot>
	</el-collapse-item>
</template>

<script lang="ts" setup>
import { reactive, watch } from "vue";
import { useConfig } from "../../composables";
import { toFixed } from "@/utils";
import { debounce } from "xe-utils";
import type { Pen } from "@meta2d/core";

const {
	config: nodeConfig,
	pen,
	topology,
	lazyUpdateValue
} = useConfig<Pen & Record<"fontWeight", any>>();

const pneRect = reactive({ width: 100, height: 100 });
watch(
	pen,
	(val) => {
		if (!val) return;
		const { width, height } = topology.getPenRect(val);
		pneRect.width = toFixed(width, 0);
		pneRect.height = toFixed(height, 0);
	},
	{ immediate: true }
);

const updatePenRect = debounce((key: "width" | "height", val: number) => {
	const { x, y, width, height } = topology.getPenRect(pen.value);
	topology.setPenRect(pen.value, { x, y, width, height, [key]: val });
}, 200);
</script>

<style lang="scss" scoped>
.Progress_item {
	padding: 0 16px;
}
.lineColor_item {
	display: flex;
	align-items: center;
}
</style>
