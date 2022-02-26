<script lang="ts" setup>
import { inject, onMounted, ref, shallowRef, watchEffect } from "vue-demi";
import * as L from "leaflet";
import { mapContextKey } from "./context";

type Highlight = boolean | { color?: string };
const props = withDefaults(
  defineProps<{ active?: L.LatLng; highlight?: Highlight; outerClose?: boolean }>(),
  {
    // 点击地图是否隐藏高亮
    outerClose: true,
    // 高亮配置
    highlight: false
  }
);

const { map, events } = inject(mapContextKey)!;

const flyEl = shallowRef<HTMLElement>();
const visible = ref(false);

const highlightConfig = Object.assign(
  { color: "blue" },
  typeof props.highlight === "boolean" ? {} : props.highlight || {}
);

let flag = true;

onMounted(() => {
  if (!map) return;

  let containerPoint: L.Point;
  const el = flyEl.value!;

  // 获取偏移元素
  const mapPane = map.getPane("mapPane");

  watchEffect(() => {
    const { active } = props;
    if (active) {
      flag = true;
      visible.value = false;
      map.flyTo(active);
    }
  });

  props.outerClose &&
    map.on("click", () => {
      flag = false;
      visible.value = false;
    });

  const getOffset = () => {
    const offset = [0, 0];
    if (mapPane) {
      const [x = 0, y = 0] = mapPane.style.transform
        .substring(12)
        .split(",")
        .map((item) => parseFloat(item));
      offset[0] = x;
      offset[1] = y;
    }
    return offset;
  };

  // 处理高亮显示
  if (props.highlight) {
    map.on("moveend", () => {
      const { active } = props;
      if (active) {
        const [x, y] = getOffset();
        containerPoint = map.latLngToContainerPoint(active);
        el.style.left = containerPoint.x - x + "px";
        el.style.top = containerPoint.y - y + "px";
        if (flag) {
          visible.value = true;
        }
      }
    });
    events.on("layerVisible", ({ layer, visible: layerVisible }) => {
      const { active } = props;
      if (visible.value && !layerVisible && active) {
        if (layer instanceof L.Marker) {
          if (map.distance(layer.getLatLng(), active) === 0) {
            visible.value = false;
            flag = false;
          }
        } else if (layer instanceof L.LayerGroup) {
          const has = layer
            .getLayers()
            .filter((item) => item instanceof L.Marker)
            .some((marker) => map.distance((marker as L.Marker).getLatLng(), active) === 0);
          if (has) {
            visible.value = false;
            flag = false;
          }
        }
      }
    });
  }
});
</script>

<template>
  <slot></slot>
  <Teleport to=".leaflet-marker-pane" v-if="highlight">
    <ul v-show="visible" class="fly-box" ref="flyEl">
      <li
        v-for="item in 3"
        :key="item"
        :class="['fly-ripple-' + item]"
        :style="{ backgroundColor: highlightConfig.color }"
      ></li>
    </ul>
  </Teleport>
</template>

<style scoped>
.fly-box {
  position: absolute;
  width: 25px;
  height: 25px;
  transform: translate(-50%, -50%);
  border-radius: 50%;
  z-index: 1;
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
