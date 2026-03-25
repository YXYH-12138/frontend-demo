import Feature from "ol/Feature";
import { Vector as VectorLayer } from "ol/layer";
import { OverlayManager } from "@/utils";
import PopupPanel from "./PopupPanel.vue";
import { createVNode, render } from "vue";
import { HomeMap } from "./map";

export function useTooltip(map: HomeMap, markerFeatures: Feature[]) {
	const titleMap = new WeakMap<Feature, string>();

	const overlayManager = new OverlayManager(map);

	const popupManager = new OverlayManager(map);

	/** 显示隐藏切换tooltip */
	function changeTooltipVisible(visible: boolean) {
		markerFeatures.forEach((feature) => {
			visible ? overlayManager.open(feature, titleMap.get(feature)) : overlayManager.close(feature);
		});
	}

	// const isShowPopover = (row: any) => {
	// 	return row.izShowPopover != 0 && getLevel(map) >= row.level;
	// };

	let elements: HTMLElement[] = [];
	function unmouteAll() {
		elements.forEach((el) => render(null, el));
		elements = [];
	}
	/**
	 * 初始化popup的title
	 * @param stationQZData
	 * @param planWarnParams
	 */
	function initPopupTitle() {
		unmouteAll();
		markerFeatures.forEach((feature) => {
			const row = feature.get("station");
			if (row.izShowPopover == 0) return;
			// 通过vue组件来渲染
			const div = document.createElement("div");
			const vnode = createVNode(PopupPanel, { row });
			render(vnode, div);
			elements.push(div);
			popupManager.open(feature, div.firstElementChild as HTMLElement);
		});
	}

	/**
	 * 绑定水位流量的tooltip和默认显示的popup
	 * @param feature
	 * @param row
	 */
	function initPopup(feature: Feature) {
		popupManager.bindPopup(feature, {
			custom: true,
			popupClass: "ol-transparent-tooltip-parent",
			offset: [0, -10]
		});
	}

	/** 销毁全部 */
	function dispose() {
		for (const markerFeature of markerFeatures) {
			overlayManager.dispose(markerFeature);
			popupManager.dispose(markerFeature);
		}
		unmouteAll();
	}

	return { initPopupTitle, changeTooltipVisible, initPopup, dispose };
}
