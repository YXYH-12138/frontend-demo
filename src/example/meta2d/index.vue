<template>
	<div class="content">
		<!-- 拖拽节点工具 -->
		<DragTools />
		<div class="topology">
			<TopologyComponent />
		</div>

		<!-- 配置面板 -->
		<Transition name="slide-up">
			<ConfigPane v-if="pen" class="config-box" :topology="meta2d!" :pen="pen" />
		</Transition>
	</div>
</template>

<script lang="ts" setup>
import DragTools from "./topology/DragTools.vue";
import ConfigPane from "./topology/ConfigPane/index.vue";
import { TopologyNodeType } from "@/constants";
import { createTopology } from "@/utils";
import { LockState } from "@meta2d/core";
import data from "./data.json";

// 创建概化图
const topology = createTopology({ activeColor: "" });

const { TopologyComponent, meta2d, pen } = topology;

async function initTopology() {
	const [meta2d] = await Promise.all([topology.promise]);
	meta2d.clear();
	if (data && data.json) {
		const lines = JSON.parse(data.json);
		// 隐藏计算信息节点
		for (const pen of lines.pens) {
			if (pen.nodeType === TopologyNodeType.CalcInfo) {
				pen.visible = false;
				pen.locked = LockState.Disable;
			}
		}
		// const _pens = lines.pens.filter((o: Required<IStationNodeConfig>) => o.type !== PenType.Line);
		// pens.value = _pens;
		// riverStations.value = pens.value
		// 	.filter((item) => item.nodeType !== TopologyNodeType.CalcInfo)
		// 	.map((p) => p.sttpObj)
		// 	.filter(Boolean) as StationRaw[];
		// console.log(lines);
		// 加载数据
		meta2d.open(lines);
		meta2d.scale(0.8);
		// 画布居中
		// meta2d.centerView();
		// meta2d.lock(LockState.DisableEdit);
		// topology.lockLine(lines.pens, LockState.Disable);
		// 判读是否禁止线条拖动
		// nodeLock != null && meta2d.lock(nodeLock);
		// 判读是否禁止线条拖动
		// lineLock != null && topology.lockLine(lines.pens, lineLock);
		// load && load(meta2d);
	}
}

initTopology();
</script>

<style lang="scss" scoped>
.content {
	position: relative;
	display: flex;
	height: calc(100% - 60px);
	overflow: hidden;
}
.topology {
	flex: 1;
	z-index: 0;
}
.config-box {
	position: absolute;
	right: 0;
	top: 0;
	width: 310px;
	overflow-y: auto;
	background-color: #fff;
}
</style>
