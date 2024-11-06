<script lang="ts" setup>
import { inject, onMounted, toRef, watch, ref } from " vue";
import { hasOwn } from "@vue/shared";
import { useVModel } from "@vueuse/core";
import * as L from "leaflet";
import { LIcon, LMarker } from "..";
import { mapContextKey, markeMap } from "../context";

type Highlight = boolean | { color?: string };

const props = withDefaults(
	defineProps<{
		active?: string | number;
		highlight?: Highlight;
		outerClose?: boolean;
		size?: number[];
		flyOptions?: L.ZoomPanOptions;
		flyZoom?: number;
		visible?: boolean;
	}>(),
	{
		// 点击地图是否隐藏高亮
		outerClose: true,
		// 高亮配置
		highlight: false,
		// 大小
		size: () => [20, 20],
		// fly的位置
		latLng: () => [0, 0]
	}
);
const emits = defineEmits<{ (e: "update:visible", visible: boolean): void }>();

const { map } = inject(mapContextKey)!;

const visibleModel = hasOwn(props, "visible") ? ref(true) : useVModel(props, "visible", emits);
const latLng = ref<L.LatLng>(L.latLng(0, 0));
const active = toRef(props, "active");

const highlightConfig = Object.assign(
	{ color: "blue" },
	typeof props.highlight === "boolean" ? {} : props.highlight || {}
);

let prevMarker: L.Marker;

const flyTo = (id: string | number) => {
	const { flyZoom, flyOptions } = props;
	const marker = markeMap.get(id);
	if (marker) {
		latLng.value = marker.getLatLng();
		map!.flyTo(latLng.value, flyZoom, flyOptions);
		if (!map!.hasLayer(marker)) {
			// 移除之前显示的图层
			prevMarker && map!.removeLayer(prevMarker);
			prevMarker = marker;
			map!.addLayer(marker);
		}
		visibleModel.value = true;
	}
};

onMounted(() => {
	if (!map) return;
	const { outerClose, highlight } = props;

	watch(active, (val) => val && flyTo(val));

	highlight &&
		map.on("layerremove", () => {
			const marker = markeMap.get(props.active!);
			if (marker && !map!.hasLayer(marker)) {
				visibleModel.value = false;
			}
		});

	outerClose &&
		map.on("click", () => {
			visibleModel.value = false;
		});
});
</script>

<template>
	<slot></slot>
	<LMarker v-if="highlight" :lat-lng="latLng" :visible="visibleModel" :z-index="-1000">
		<LIcon :icon-size="size">
			<ul class="fly-box">
				<li
					v-for="item in 3"
					:key="item"
					:class="['fly-ripple-' + item]"
					:style="{ backgroundColor: highlightConfig.color }"
				/>
			</ul>
		</LIcon>
	</LMarker>
</template>

<style scoped>
.fly-box {
	border-radius: 50%;
	height: 100%;
}

.fly-box li {
	position: absolute;
	left: 0;
	top: 0;
	width: 100%;
	height: 100%;
	opacity: 0;
	transform-origin: center center;
	border-radius: 100%;
}

.fly-ripple-1 {
	animation: pulsate 1.5s infinite 0s;
}

.fly-ripple-2 {
	animation: pulsate 1.5s infinite 0.5s;
}

.fly-ripple-3 {
	animation: pulsate 1.5s infinite 1s;
}

@keyframes pulsate {
	0% {
		transform: scale(0.1, 0.1);
		opacity: 1;
	}

	40% {
		opacity: 0.8;
	}

	100% {
		transform: scale(3, 3);
		opacity: 0;
	}
}
</style>
