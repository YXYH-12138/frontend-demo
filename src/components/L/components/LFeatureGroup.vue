<script lang="ts">
import { defineComponent, inject, PropType, provide } from " vue";
import * as L from "leaflet";
import { layerProps, layerEmits, layerSetup } from "../functions/layer";
import { layerMethodsKey } from "../context";

export default defineComponent({
	props: { ...layerProps, layers: Array as PropType<L.Layer[]> },
	emits: { ...layerEmits },
	inheritAttrs: false,
	setup(props, context) {
		const featureGroup = L.featureGroup(props.layers, {
			pane: props.pane,
			attribution: props.attribution
		});

		const layerMethods = inject(layerMethodsKey)!;

		const groupMethods = {
			addLayer<T extends L.Layer>(layer: T) {
				featureGroup.hasLayer(layer) || featureGroup.addLayer(layer);
			},
			removeLayer<T extends L.Layer>(layer: T) {
				featureGroup.hasLayer(layer) && featureGroup.removeLayer(layer);
			}
		};

		provide(layerMethodsKey, { ...layerMethods, ...groupMethods });

		layerSetup(props, context, { layer: featureGroup });
	}
});
</script>

<template>
	<slot></slot>
</template>
