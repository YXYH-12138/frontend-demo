<script lang="ts" setup>
import {
	inject,
	markRaw,
	nextTick,
	onBeforeUnmount,
	onMounted,
	provide,
	ref,
	useAttrs
} from "vue-demi";
import * as L from "leaflet";
import mitt from "mitt";
import { remapEvents, propsBinder, resetWebpackIcon } from "../utils";
import { mapContextKey, layerMethodsKey, iconUrlKey } from "../context";
import type { MapContext } from "../type";
import { useResizeObserver } from "@vueuse/core";

type Props = { crs?: L.CRS; options?: L.MapOptions; zIndex?: number };
type Emits = {
	(name: "ready", e: L.Map): void;
};

const props = withDefaults(defineProps<Props>(), {
	crs: () => L.CRS.EPSG3857,
	zIndex: 1
});
const emits = defineEmits<Emits>();

const attrs = useAttrs();
const iconDefault = inject(iconUrlKey, {
	iconRetinaUrl: import("leaflet/dist/images/marker-icon-2x.png"),
	iconUrl: import("leaflet/dist/images/marker-icon.png"),
	shadowUrl: import("leaflet/dist/images/marker-shadow.png")
});

const context: MapContext = { events: mitt() };
const rootEl = ref<HTMLElement>();
const ready = ref(false);

resetWebpackIcon(L.Icon, iconDefault);

const methods = {
	addLayer<T extends L.Layer>(layer: T) {
		const { map } = context || {};
		map && !map.hasLayer(layer) && map.addLayer(layer);
	},
	removeLayer<T extends L.Layer>(layer: T) {
		const { map } = context || {};
		map && map.hasLayer(layer) && map.removeLayer(layer);
	},
	setVisible<T extends L.Layer>(layer: T, visible: boolean) {
		const { map } = context || {};
		if (map) {
			visible ? this.addLayer(layer) : this.removeLayer(layer);
		}
	}
};

useResizeObserver(rootEl, () => {
	const { map } = context;
	if (map) {
		map.invalidateSize(true);
	}
});

provide(mapContextKey, context);
provide(layerMethodsKey, methods);

onMounted(() => {
	const mapOptions: L.MapOptions = { crs: props.crs, ...props.options };
	context.map = markRaw(L.map(rootEl.value as HTMLElement, mapOptions));

	propsBinder({}, context.map as L.Map, props);
	L.DomEvent.on(context.map as any, remapEvents(attrs));

	nextTick(() => {
		const map = context.map as L.Map;
		ready.value = true;
		emits("ready", map);
		context.events.emit("ready", map);
	});
});

onBeforeUnmount(() => {
	const { map } = context;
	map && map.remove();
	context.events.off("*");
});

defineExpose(context);
</script>

<template>
	<div ref="rootEl" style="width: 100%; height: 100%" :style="{ zIndex: zIndex }">
		<template v-if="ready">
			<slot></slot>
		</template>
	</div>
</template>
