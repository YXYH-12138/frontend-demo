<script lang="ts" setup>
import { inject, onBeforeUnmount, onMounted, ref, toRef, watch } from "vue-demi";
import * as L from "leaflet";
import { LIcon, LMarker } from "..";
import { mapContextKey, flyContextKey } from "../context";

type Highlight = boolean | { color?: string };
const props = withDefaults(
  defineProps<{
    active?: L.LatLng;
    highlight?: Highlight;
    outerClose?: boolean;
    size?: number[];
    flyOptions?: L.ZoomPanOptions;
    flyZoom?: number;
  }>(),
  {
    // 点击地图是否隐藏高亮
    outerClose: true,
    // 高亮配置
    highlight: false,
    // 大小
    size: () => [20, 20],
    // fly的位置
    active: () => L.latLng(0, 0)
  }
);

const { map, events: mapEvents } = inject(mapContextKey)!;
const { markerMap, events: flyEvents } = inject(flyContextKey)!;

const visible = ref(false);
const active = toRef(props, "active");

const highlightConfig = Object.assign(
  { color: "blue" },
  typeof props.highlight === "boolean" ? {} : props.highlight || {}
);

let preMakrer: L.Marker;
const flagMap: Record<string, boolean> = {};

const flyTo = (latlng: L.LatLngExpression) => {
  const { flyZoom, flyOptions, active } = props;
  map!.flyTo(latlng, flyZoom, flyOptions);
  visible.value = true;
  if (preMakrer) {
    const { flyName } = preMakrer.options.params;
    if (flagMap[flyName] === false) {
      map!.removeLayer(preMakrer);
    }
  }
  for (const [_, markers] of markerMap) {
    for (const marker of markers) {
      if (!map!.hasLayer(marker) && map!.distance(marker.getLatLng(), active) === 0) {
        map!.addLayer(marker);
        preMakrer = marker;
        return;
      }
    }
  }
};

mapEvents.on("layerVisible", ({ name, visible }) => {
  if (!name) return;
  flagMap[name] = visible;
});

onMounted(() => {
  if (!map) return;
  const { outerClose, highlight } = props;

  watch(active, (val) => val && flyTo(val));

  outerClose &&
    map.on("click", () => {
      visible.value = false;
    });

  highlight &&
    flyEvents.on("layerHidden", ({ name }) => {
      if (!visible.value) return;
      const markers = markerMap.get(name);
      const has =
        markers && markers.some((marker) => map.distance(marker.getLatLng(), props.active) === 0);
      if (has) {
        visible.value = false;
      }
    });
});

onBeforeUnmount(() => {
  flyEvents.off("*");
  markerMap.clear();
});
</script>

<template>
  <slot></slot>
  <LMarker v-if="highlight" :lat-lng="active" :visible="visible" :z-index="-1000">
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
