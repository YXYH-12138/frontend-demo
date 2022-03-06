<script lang="ts">
import { defineComponent, PropType, inject } from "vue-demi";
import * as L from "leaflet";
import { layerProps, layerEmits, layerSetup } from "../functions/layer";
import { flyContextKey, flyKey } from "../context";

export default defineComponent({
  props: {
    latLng: {
      type: Object as PropType<L.LatLng | number[]>,
      required: true
    },
    options: {
      type: Object as PropType<L.MarkerOptions>
    },
    ...layerProps
  },
  emits: { ...layerEmits },
  setup(props, context) {
    const { markerMap } = inject(flyContextKey, { markerMap: undefined });
    const flyName = inject(flyKey, "");

    const marker = L.marker(props.latLng as L.LatLng, {
      zIndexOffset: props.zIndex || 0,
      ...props.options,
      params: { flyName }
    });

    if (flyName && markerMap) {
      const current = markerMap.get(flyName)!;
      current.push(marker);
    }

    layerSetup(props, context, marker);
  }
});
</script>

<template>
  <div style="display: none">
    <slot></slot>
  </div>
</template>
