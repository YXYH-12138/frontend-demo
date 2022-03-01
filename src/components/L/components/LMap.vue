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
import { mapContextKey, layerMethodsKey, flyContextKey, flyKey, iconUrlKey } from "../context";
import type { FlyEvents, MapContext } from "../type";

type Props = { crs?: L.CRS; options?: L.MapOptions; zIndex?: number };
type Emits = {
  (name: "ready", e: L.Map): void;
};

const props = withDefaults(defineProps<Props>(), {
  crs: () => L.CRS.EPSG4326,
  zIndex: 1
});
const emits = defineEmits<Emits>();

const attrs = useAttrs();
const iconDefault = inject(iconUrlKey);

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

provide(mapContextKey, context);
provide(layerMethodsKey, methods);
provide(flyKey, "");
provide(flyContextKey, { events: mitt<FlyEvents>(), markerMap: new Map() });

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
