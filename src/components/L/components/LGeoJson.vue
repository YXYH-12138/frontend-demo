<script lang="ts">
import { defineComponent, inject, PropType, watch, toRefs } from " vue";
import * as L from "leaflet";
import { layerProps, layerSetup, layerEmits } from "../functions/layer";
import { mapContextKey } from "../context";
import type { GeoJsonObject } from "geojson";

export default defineComponent({
	props: {
		geojson: Object as PropType<GeoJsonObject>,
		options: Object as PropType<L.GeoJSONOptions>,
		...layerProps
	},
	emits: { ...layerEmits },
	setup(props, context) {
		const { map } = inject(mapContextKey)!;
		if (!map) return;

		const { geojson } = toRefs(props);

		const layer = L.geoJSON(geojson.value, props.options);

		watch(geojson, (data) => {
			layer.clearLayers();
			data && layer.addData(data);
		});

		layerSetup(props, context, { layer });

		return () => null;
	}
});
</script>
