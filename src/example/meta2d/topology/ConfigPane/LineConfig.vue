<template>
	<el-collapse-item title="河道属性" name="line">
		<div>
			<div>
				线条粗细 :
				<span>{{ lineConfig.lineWidth }}px</span>
			</div>
			<div class="Progress_item">
				<el-slider
					:show-tooltip="false"
					v-model="lineConfig.lineWidth"
					@input="lazyUpdateValue('lineWidth')"
					:min="1"
					:max="10"
					:step="1"
				/>
			</div>
		</div>
		<div>
			<div>线条颜色 :</div>
			<div class="Progress_item lineColor_item">
				<el-color-picker show-alpha v-model="lineConfig.color" @change="lazyUpdateValue('color')" />
				<el-input
					class="pl6"
					v-model="lineConfig.color"
					@keyup.enter="lazyUpdateValue('color')"
					@blur="lazyUpdateValue('color')"
				/>
			</div>
		</div>
		<div>
			<div>线条形状:</div>
			<div class="Progress_item lineColor_item">
				<el-select v-model="lineConfig.lineName" placeholder="请选择" @change="updateLineType">
					<el-option v-for="(p, i) in lineList" :key="i" :label="p.name" :value="p.code" />
				</el-select>
			</div>
		</div>
		<div>
			<div>线条样式:</div>
			<div class="Progress_item lineColor_item">
				<el-select v-model="lineStyle" placeholder="请选择" @change="changeLineType">
					<el-option label="实线" value="solid"></el-option>
					<el-option label="虚线" value="dash"></el-option>
				</el-select>
			</div>
		</div>
		<div>
			<div>端点样式:</div>
			<div class="Progress_item lineColor_item">
				<el-select
					v-model="lineConfig.toArrow"
					placeholder="请选择"
					@change="lazyUpdateValue('toArrow')"
				>
					<el-option label="无端点" value=""></el-option>
					<el-option label="箭头" value="triangleSolid"></el-option>
				</el-select>
			</div>
		</div>
	</el-collapse-item>
</template>

<script lang="ts" setup>
import { ref, watch } from "vue";
import { useConfig } from "../../composables";
import type { ILineConfig, LineName } from "@/utils/topology";

const { config: lineConfig, topology, pen, setValue, lazyUpdateValue } = useConfig<ILineConfig>();

const lineList: Array<{ name: string; code: LineName }> = [
	{ name: "曲线", code: "curve" },
	{ name: "线段", code: "polyline" },
	{ name: "直线", code: "line" },
	{ name: "脑图曲线", code: "mind" }
];

const lineStyle = ref("solid");
watch(
	pen,
	(val) => {
		if (val) {
			lineStyle.value = val.lineDash ? "dash" : "solid";
		}
	},
	{ immediate: true }
);

function updateLineType(str: LineName) {
	topology.updateLineType(pen.value, str);
}

function changeLineType(e: ILineConfig["lineStyle"]) {
	setValue(e == "dash" ? { dash: 1, lineDash: [5, 5] } : { dash: 0, lineDash: undefined });
}
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
