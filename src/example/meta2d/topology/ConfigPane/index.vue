<template>
	<el-collapse v-model="activeNames" class="config-box">
		<component v-for="item of components" :key="item.name" :is="item" />
	</el-collapse>
</template>

<script lang="tsx" setup>
import { computed, provide, reactive, toRefs } from "vue";
import { PenType, type Meta2d } from "@meta2d/core";
import { TopologyNodeType } from "@/constants";
import { contextKey } from "../token";
import LineConfig from "./LineConfig.vue";
import BaseConfig from "./BaseConfig.vue";
import ColorConfig from "./ColorConfig.vue";
import TextConfig from "./TextConfig.vue";
import type { Pen } from "@/utils";

const props = defineProps<{ topology: Meta2d; pen: Pen }>();

const { pen } = toRefs(props);

const activeNames = reactive(["line", "node", "station"]);

provide(contextKey, {
	pen,
	topology: props.topology,
	setValue: (value) => {
		props.topology.setValue({ id: props.pen.id, ...value });
	}
});

const components = computed(() => {
	const { type, nodeType } = props.pen;
	if (type === PenType.Line) return [LineConfig];
	switch (nodeType) {
		// case TopologyNodeType.体系选择:
		// return [BaseConfig];
		case TopologyNodeType.文本:
			return [BaseConfig, TextConfig];
		default:
			return [
				() => (
					<BaseConfig>
						<ColorConfig />
					</BaseConfig>
				)
			];
	}
});
</script>

<style lang="scss" scoped>
.config-box {
	height: 100%;
	padding: 0 10px;
	box-sizing: border-box;
	border-left: 1px solid #ccc;
	--el-collapse-header-font-size: 16px;
	:deep(.el-collapse-item__wrap) {
		overflow: initial;
	}
}
</style>
