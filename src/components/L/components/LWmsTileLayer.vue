<script lang="tsx">
import { defineComponent, PropType } from "vue";
import * as L from "leaflet";
import { layerProps, layerEmits, layerSetup } from "../functions/layer";
import type { WMSOptions } from "leaflet";

export default defineComponent({
	props: {
		layers: { type: String, required: true },
		crs: { type: Object as PropType<L.CRS>, default: L.CRS.EPSG4326 },
		url: {
			type: String,
			default: null
		},
		options: {
			type: Object as PropType<WMSOptions>
		},
		...layerProps
	},
	emits: { ...layerEmits },
	setup(props, context) {
		const wmsTileLayer = L.tileLayer.wms(props.url, {
			format: "image/png",
			transparent: true,
			crs: props.crs,
			zIndex: props.zIndex,
			layers: props.layers,
			...props.options
		});
		layerSetup(props, context, { layer: wmsTileLayer });

		return () => null;
	}
});
</script>
