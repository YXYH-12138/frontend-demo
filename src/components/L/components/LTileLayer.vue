<script lang="tsx">
import { defineComponent, PropType } from "vue-demi";
import { TileLayerOptions } from "leaflet";
import * as L from "leaflet";
import { layerProps, layerEmits, layerSetup } from "../functions/layer";

interface Options extends TileLayerOptions {
	key: string;
}

export default defineComponent({
	props: {
		url: {
			type: String,
			default: null
		},
		options: {
			type: Object as PropType<Options>
		},
		...layerProps
	},
	emits: {
		...layerEmits
	},
	setup(props, context) {
		const tileLayer = L.tileLayer(props.url, { zIndex: props.zIndex, ...props.options });
		layerSetup(props, context, tileLayer);
	}
});
</script>

<template>
	<slot></slot>
</template>
