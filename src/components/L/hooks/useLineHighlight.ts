import type { PathOptions, StyleFunction, LeafletEvent, GeoJSON } from "leaflet";

/**
 * 线条高亮
 * @param style
 * @returns
 */
export const useLineHighlight = (
	style: PathOptions | StyleFunction<any>,
	cb?: (event: LeafletEvent, layer: GeoJSON) => any
) => {
	let prevLayer: L.GeoJSON;
	let prevStyle: Record<string, any>;

	return {
		click(arg: any) {
			prevLayer && prevLayer.setStyle(prevStyle);
			prevLayer = (arg as LeafletEvent).propagatedFrom as GeoJSON;
			prevStyle = { ...prevLayer.options };
			prevLayer.setStyle(style);
			cb && cb(arg, prevLayer);
		}
	};
};
