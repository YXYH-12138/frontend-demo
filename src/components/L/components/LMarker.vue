<script lang="ts">
import { defineComponent, PropType } from " vue";
import * as L from "leaflet";
import { layerProps, layerEmits, layerSetup } from "../functions/layer";
import { markeMap } from "../context";

export default defineComponent({
	props: {
		latLng: {
			type: Object as PropType<L.LatLng | number[]>,
			required: true
		},
		id: [Number, String],
		options: {
			type: Object as PropType<L.MarkerOptions>
		},
		...layerProps
	},
	emits: { ...layerEmits },
	setup(props, context) {
		const marker = L.marker(props.latLng as L.LatLng, {
			zIndexOffset: props.zIndex || 0,
			...props.options
		});

		if (props.id) {
			const id = props.id!;
			markeMap.set(id, marker);
		}

		layerSetup(props, context, { layer: marker });
	}
});
</script>

<template>
	<div style="display: none">
		<slot></slot>
	</div>
</template>
