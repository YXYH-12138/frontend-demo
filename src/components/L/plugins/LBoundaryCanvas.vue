<script lang="tsx">
import { defineComponent, onMounted, inject } from "vue-demi";
import * as L from "leaflet";
import { layerProps, layerEmits, layerSetup } from "../functions/layer";
import { layerKey } from "../context";

export default defineComponent({
  props: {
    boundary: Object,
    ...layerProps
  },
  emits: { ...layerEmits },
  setup(props, context) {
    const layer = inject(layerKey);

    onMounted(() => {
      if (!L.TileLayer.BoundaryCanvas) return;
      const { boundary } = props;
      const tileLayer = L.TileLayer.BoundaryCanvas.createFromLayer(layer, {
        boundary
      });
      layerSetup(props, context, { layer: tileLayer });
    });

    return () => null;
  }
});
</script>
