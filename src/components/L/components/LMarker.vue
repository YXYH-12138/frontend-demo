<script lang="ts">
import { defineComponent, PropType, inject } from "vue-demi";
import * as L from "leaflet";
import { layerProps, layerEmits, layerSetup } from "../functions/layer";
import { layerGroupMethodsKey } from "./context";

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
    const marker = L.marker(props.latLng as L.LatLng, props.options);
    const methods = inject(layerGroupMethodsKey);

    layerSetup(props, context, marker, methods);
  }
});
</script>

<template>
  <div style="display: none">
    <slot></slot>
  </div>
</template>
