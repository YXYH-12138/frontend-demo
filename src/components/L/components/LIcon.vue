<script lang="ts">
import {
	defineComponent,
	toRefs,
	render,
	inject,
	shallowReactive,
	Comment,
	VNode,
	PropType
} from "vue-demi";
import * as L from "leaflet";
import { propsBinder } from "../utils";
import { layerKey } from "../context";

export default defineComponent({
	props: {
		iconUrl: {
			type: String,
			default: null
		},
		iconSize: [Object, Array] as PropType<L.Point | number[]>,
		shadowUrl: String,
		shadowSize: Object as PropType<L.Point>,
		shadowAnchor: Object as PropType<L.Point>,
		options: Object as PropType<L.IconOptions>,
		className: {
			type: String,
			default: ""
		},
		bgPos: {
			type: [Object, Array],
			default: () => [0, 0]
		}
	},
	setup(props, { slots }) {
		const options = { ...props, ...(props.options || {}) } as L.IconOptions;

		const marker = inject(layerKey) as L.Marker;
		const { iconUrl, iconSize } = toRefs(props);

		let icon: L.Icon | L.DivIcon;
		let vNodes: VNode[];

		// 如果插槽有元素且都不是注释节点
		if (
			slots.default &&
			(vNodes = slots.default().filter((node) => node.type !== Comment)).length > 0
		) {
			const wrapperEl = document.createElement("div");
			if (vNodes.length > 1) {
				console.warn("LIcon插槽中有多个节点，请使用根元素包裹他们，否则只会渲染第一个插槽元素");
			}
			// 渲染插槽中的第一个元素
			render(vNodes[0], wrapperEl);
			// 获取第一个元素
			const firstEl = wrapperEl.firstChild as HTMLElement;
			const html = firstEl.nodeType !== Node.ELEMENT_NODE ? wrapperEl : firstEl;
			icon = L.divIcon({ ...options, html });
		} else {
			icon = L.icon(options);
		}

		marker && marker.setIcon(icon);
		propsBinder({}, marker, shallowReactive({ iconUrl, iconSize }));
	}
});
</script>

<template>
	<slot></slot>
</template>
