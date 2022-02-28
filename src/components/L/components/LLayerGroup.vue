<script lang="ts">
import { defineComponent, inject, PropType, provide } from "vue-demi";
import * as L from "leaflet";
import { layerProps, layerEmits, layerSetup } from "../functions/layer";
import { layerMethodsKey } from "../context";

export default defineComponent({
  props: { ...layerProps, layers: Array as PropType<L.Layer[]> },
  emits: { ...layerEmits },
  setup(props, context) {
    const layerGroup = L.layerGroup(props.layers, {
      pane: props.pane,
      attribution: props.attribution
    });

    const layerMethods = inject(layerMethodsKey)!;

    const groupMethods = {
      addLayer<T extends L.Layer>(layer: T) {
        layerGroup.hasLayer(layer) || layerGroup.addLayer(layer);
      },
      removeLayer<T extends L.Layer>(layer: T) {
        layerGroup.hasLayer(layer) && layerGroup.removeLayer(layer);
      }
    };

    provide(layerMethodsKey, { ...layerMethods, ...groupMethods });

    layerSetup(props, context, layerGroup);
  }
});
</script>

<template>
  <slot></slot>
</template>
