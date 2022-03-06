<script lang="ts">
import { defineComponent, inject, PropType, toRefs, watch } from "vue-demi";
import * as L from "leaflet";
import { layerEmits } from "../functions/layer";
import { mapContextKey } from "../context";
import type { Feature, MultiPolygon } from "geojson";

type HighlighOption = {
  stroke?: boolean;
  color?: string;
  weight?: number;
  fillOpacity?: number;
  fillColor?: string;
};

export default defineComponent({
  props: {
    highlighOption: Object as PropType<HighlighOption>,
    bounds: Object as PropType<Feature<MultiPolygon, any>>,
    fitBoundsOptions: Object as PropType<L.FitBoundsOptions>,
    visible: {
      type: Boolean,
      default: true
    },
    outerClose: {
      type: Boolean,
      default: true
    }
  },
  emits: { ...layerEmits },
  setup(props, context) {
    const { map } = inject(mapContextKey)!;
    if (!map) return;

    const highlighOption = Object.assign<HighlighOption, HighlighOption>(
      {
        stroke: true,
        color: "#dc1212",
        weight: 3,
        fillOpacity: 0.1,
        fillColor: "#1560d9"
      },
      props.highlighOption || {}
    );

    const { bounds, visible } = toRefs(props);
    let layer: any;

    const cancelHighlight = () => {
      if (layer) {
        map.removeLayer(layer);
        layer = null;
      }
    };

    const highlightArea = (data: Feature<MultiPolygon, any>) => {
      L.geoJSON(data, {
        onEachFeature: (feature) => {
          const _layer = L.GeoJSON.geometryToLayer(feature) as any;
          const bounds = _layer.getBounds();
          map.flyToBounds(bounds, props.fitBoundsOptions);
          cancelHighlight();
          _layer.setStyle(highlighOption);
          map.addLayer(_layer);
          layer = _layer;
        }
      });
    };

    watch(visible, (val) => {
      if (bounds.value) {
        val ? highlightArea(bounds.value) : cancelHighlight();
      }
      context.emit("update:visible", val);
    });

    watch(
      bounds,
      (data) => {
        data && visible.value && highlightArea(data);
      },
      { immediate: true }
    );

    props.outerClose && map.on("click", cancelHighlight);
  }
});
</script>

<template></template>
