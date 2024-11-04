<template>
	<el-button type="primary" class="position-absolute left-2 top-2 z-10" @click="addNode"
		>添加节点</el-button
	>
	<topology.TopologyComponent />
</template>

<script lang="ts" setup>
import { TopologyNodeType } from "@/constants";
import { createTopology, IStationNodeConfig } from "@/utils";
import { LockState, Meta2d, Pen, PenType } from "@meta2d/core";
import data from "./data.json";

// 创建概化图
const topology = createTopology({ activeColor: "" });

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
		console.log(lines);
		// 加载数据
		meta2d.open(lines);
		meta2d.scale(0.8);
		// 画布居中
		// meta2d.centerView();
		meta2d.lock(LockState.DisableEdit);
		topology.lockLine(lines.pens, LockState.Disable);
		// 判读是否禁止线条拖动
		// nodeLock != null && meta2d.lock(nodeLock);
		// 判读是否禁止线条拖动
		// lineLock != null && topology.lockLine(lines.pens, lineLock);
		// load && load(meta2d);
	}
}

let meta2d: Meta2d;
topology.promise.then((_meta2d) => {
	meta2d = _meta2d;
});

function addNode() {
	const { pens } = meta2d.data();
	for (const pen of pens) {
		pen.type !== PenType.Line &&
			meta2d
				.addPen({
					// id,
					text: "1",
					name: "circle",
					x: pen.x! + pen.width! - 12,
					y: pen.y! + pen.height! - 12,
					width: 20,
					height: 20,
					textColor: "#fff",
					color: "#fff",
					background: "#f2c228",
					nodeType: TopologyNodeType.FloodType
				} as Pen)
				.then(() => meta2d.inactive());
	}
}

initTopology();
</script>

<style lang="scss" scoped></style>
