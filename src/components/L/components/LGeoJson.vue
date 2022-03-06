<script lang="ts">
import { defineComponent, inject, PropType, watch, toRefs } from "vue-demi";
import * as L from "leaflet";
import { layerProps } from "../functions/layer";
import { mapContextKey } from "../context";
import type { GeoJsonObject } from "geojson";

export default defineComponent({
  props: {
    geojson: Object as PropType<GeoJsonObject>,
    options: Object as PropType<L.GeoJSONOptions>,
    ...layerProps
  },
  setup(props) {
    const { map } = inject(mapContextKey)!;
    if (!map) return;

    const { geojson, visible } = toRefs(props);

    let layer: L.Layer | null;

    const removeLayer = () => {
      if (layer) {
        map.removeLayer(layer);
        layer = null;
      }
    };

    const addLayer = (data: GeoJsonObject) => {
      layer = L.geoJSON(data, props.options);
      map.addLayer(layer);
    };

    watch(visible, (val) => {
      val ? geojson.value && addLayer(geojson.value) : removeLayer();
    });

    watch(
      geojson,
      (data) => {
        data && visible.value && addLayer(data);
      },
      { immediate: true }
    );
  }
});
</script>

<template></template>
