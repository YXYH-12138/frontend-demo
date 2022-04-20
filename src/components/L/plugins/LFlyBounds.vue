<script lang="tsx">
import { defineComponent, inject, PropType } from "vue-demi";
import * as L from "leaflet";
import { useVModel } from "@vueuse/core";
import { layerEmits } from "../functions/layer";
import { mapContextKey } from "../context";
import LGeoJson from "../components/LGeoJson.vue";
import type { Feature, MultiPolygon, MultiLineString, Polygon } from "geojson";

export default defineComponent({
	components: { LGeoJson },
	props: {
		highlighOption: Object as PropType<L.PathOptions>,
		bounds: Object as PropType<Feature<MultiPolygon | MultiLineString | Polygon, any>>,
		fitBoundsOptions: Object as PropType<L.FitBoundsOptions>,
		visible: {
			type: Boolean,
			default: false
		},
		outerClose: {
			type: Boolean,
			default: true
		}
	},
	emits: { ...layerEmits },
	setup(props, { emit }) {
		const { map } = inject(mapContextKey)!;
		if (!map) return;

		const visible = useVModel(props, "visible", emit);
		const style = Object.assign<L.PathOptions, L.PathOptions>(
			{
				stroke: true,
				color: "#dc1212",
				weight: 3,
				fillOpacity: 0.1,
				fillColor: "#1560d9"
			},
			props.highlighOption || {}
		);

		const geoJSONOptions: L.GeoJSONOptions = {
			onEachFeature: (_, layer) => {
				const bounds = (layer as L.Polyline).getBounds();
				map.flyToBounds(bounds, props.fitBoundsOptions);
				visible.value = true;
			},
			style
		};

		props.outerClose &&
			map.on("click", () => {
				visible.value = false;
			});

		return () => {
			const { bounds } = props;
			return <LGeoJson geojson={bounds} visible={visible.value} options={geoJSONOptions} />;
		};
	}
});
</script>
