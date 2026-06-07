<template>
	<div id="graph-container" class="my-graph-container"></div>
</template>

<script lang="ts" setup>
import "@maxgraph/core/css/common.css";
import { onMounted } from "vue";
import {
	Graph,
	InternalEvent,
	SelectionHandler,
	RubberBandHandler,
	getDefaultPlugins,
	EdgeHandler,
	Guide,
	eventUtils,
	PolylineShape
} from "@maxgraph/core";

function draw() {
	const container = <HTMLElement>document.getElementById("graph-container");
	// Disables the built-in context menu
	InternalEvent.disableContextMenu(container);

	// constants.GUIDE_COLOR = "#FF0000";

	EdgeHandler.prototype.snapToTerminals = true;

	// Enables rubberband selection
	const plugins = getDefaultPlugins();
	plugins.push(RubberBandHandler);

	const graph = new Graph(container, undefined, plugins);
	// 设置拖动
	graph.setPanning(true);

	graph.setGridSize(10); // 可选：设置网格大小
	graph.setGridEnabled(true); // 确保网格已启用
	// graph.setConnectable(true);

	// Enables guides
	const selectionHandler = graph.getPlugin<SelectionHandler>("SelectionHandler")!;

	// selectionHandler.shape = new PolylineShape();

	const guide = new Guide(graph, []);
	// guide.sh

	selectionHandler.guide = guide;
	selectionHandler.guidesEnabled = true;

	selectionHandler.useGuidesForEvent = function (me) {
		return !eventUtils.isAltDown(me.getEvent());
	};

	graph.batchUpdate(() => {
		const v1 = graph.insertVertex({
			value: "Hello,",
			x: 200,
			y: 40,
			width: 80,
			height: 70
		});
		const v2 = graph.insertVertex({
			value: "World!",
			x: 400,
			y: 140,
			width: 80,
			height: 40
		});
		graph.insertEdge({
			source: v1,
			target: v2,
			value: "edge",
			style: {
				edgeStyle: "orthogonalEdgeStyle",
				rounded: true
			}
		});
	});
}

onMounted(draw);
</script>

<style lang="scss" scoped>
/* 定义网格样式 */
.my-graph-container {
	height: 500px;
	border: 1px solid #ccc;

	/* 关键：使用 CSS 绘制【视觉网格】 */
	background-color: #f9f9f9; /* 画布底色 */
	background-image:
		linear-gradient(to right, #e0e0e0 1px, transparent 1px),
		linear-gradient(to bottom, #e0e0e0 1px, transparent 1px);

	/* 这里的 30px 必须和 graph.gridSize = 30 一致 */
	background-size: 10px 10px;
}
</style>
