import { omit, isFunction, has, isString } from "lodash-es";
import Feature, { FeatureLike } from "ol/Feature";
import { HITTOLERANCE, isPointMarker } from "./map";
import Popup, { Options as PopupOptions } from "ol-ext/overlay/Popup";
import { isEmptyValue } from "../common";
import * as d3 from "d3-force";
import type { Map, MapBrowserEvent } from "ol";
import type { Options as _OverlayOptions } from "ol/Overlay";

type OverlayOptions = Omit<_OverlayOptions, "element"> & { element?: HTMLElement | string };

type GetElFn = (feature: Feature, features: Feature[]) => HTMLElement | string | undefined | void;

export const IS_TOOLTIP_POPUP = "__is_tooltip_popup";
const isTPMarker = (feature: FeatureLike) => has(feature.getProperties(), IS_TOOLTIP_POPUP);
const getFeatures = (e: MapBrowserEvent<any>) => {
	const map = e.map;
	if (!map || !e.pixel) return [];
	// 判断点击的点是否在marker上
	const features = map.getFeaturesAtPixel(e.pixel, { hitTolerance: HITTOLERANCE });
	return features.filter((item) => isTPMarker(item) || isPointMarker(item));
};

type NewPopupOptions = Omit<PopupOptions, "element"> & { custom?: any };

interface Rect {
	minX: number;
	maxX: number;
	minY: number;
	maxY: number;
}

/**
 * Overlay管理器
 *  - tooltip
 *  - popup
 */
export class OverlayManager {
	private popup: Popup | undefined;
	private _map: Map | undefined;
	private _type: "tooltip" | "popup";
	private popupMap: WeakMap<Feature, Popup>;
	private showEl: boolean;

	// 状态管理
	private activeFeatures: Set<Feature> = new Set();
	private declutterTimer: any = null;

	constructor(map: Map, type: "tooltip" | "popup" = "tooltip") {
		this.showEl = true;
		this._type = type;
		this.setMap(map);
		this.popupMap = new WeakMap();

		if (this._map) {
			this._map.on("moveend", () => this.triggerDeclutter());
		}
	}

	hasPopup(overlay: Feature) {
		return !!this.popupMap.has(overlay);
	}
	resume() {
		this.showEl = true;
	}
	pause() {
		this.showEl = false;
	}
	setMap(map: Map) {
		this._map = map;
	}
	setProperties(popup: Popup, properties: OverlayOptions) {
		popup.setProperties(omit(properties, "element"));
	}
	setElement(overlay: Feature, element: HTMLElement | string) {
		const popup = this.popupMap.get(overlay);
		if (popup) {
			if (isString(element)) {
				const div = document.createElement("div");
				div.innerHTML = element;
				element = div.firstChild as HTMLElement;
			}
			popup.setElement(element);
		}
	}

	bindPopup(featureOrFn: Feature | GetElFn, options?: NewPopupOptions) {
		const { popupMap, _map, _type } = this;
		let popup: Popup | undefined;
		const { custom, ...other } = options ?? {};

		if (isFunction(featureOrFn)) {
			popup = this.popup = this.createPopup(other);
			_type === "popup" ? this.initClickEvent(featureOrFn) : this.initMoveEvent(featureOrFn);
			_map && popup && _map.addOverlay(popup);
		} else {
			popup = popupMap.get(featureOrFn);
			if (!popup) {
				popup = this.createPopup(other);
				this.popupMap.set(featureOrFn, popup);
				_map && popup && _map.addOverlay(popup);
			}
		}
		if (!isEmptyValue(custom)) popup.set("custom", custom);
		return this;
	}

	open(overlay: Feature, element?: HTMLElement | string, options?: Omit<PopupOptions, "element">) {
		if (!this.showEl) return;
		const popup = this.popupMap.get(overlay) ?? this.popup;
		const position = (overlay.getGeometry() as any)?.getCoordinates?.();

		if (position && popup && element != null) {
			if (options) this.setProperties(popup, options);

			// 每次打开先归零，等待计算
			popup.setOffset([0, 0]);
			popup.show(position, element);

			if (this._type === "tooltip") {
				this.activeFeatures.add(overlay);
				this.triggerDeclutter();
			}
		}
	}

	close(overlay: Feature) {
		const popup = this.popupMap.get(overlay);
		popup && popup.hide();
		this.popup && this.popup.hide();

		this.activeFeatures.delete(overlay);
		if (this._type === "tooltip") {
			this.triggerDeclutter();
		}
	}

	dispose(overlay?: Feature) {
		if (overlay) {
			this.activeFeatures.delete(overlay);
			const popup = this.popupMap.get(overlay);
			if (popup && this._map) this._map.removeOverlay(popup);
			this.popupMap.delete(overlay);
		}
		if (this.popup) {
			this._map && this._map.removeOverlay(this.popup);
			this.popup.dispose();
			this.popup = undefined;
		}
	}

	// --- 全新的“车位”避让算法 ---

	private triggerDeclutter() {
		if (this.declutterTimer) clearTimeout(this.declutterTimer);
		// 50ms 延迟足够了
		this.declutterTimer = setTimeout(() => this.declutter(), 50);
	}

	public declutter() {
		if (!this._map || this.activeFeatures.size === 0) return;

		const mapSize = this._map.getSize();
		if (!mapSize) return;

		// 配置：图标半径 (保留区域)
		const MARKER_RADIUS = 15;
		const GAP = 5; // 弹窗之间的最小间距

		// 已占用的矩形区域列表 (初始化为空)
		const occupiedRects: Rect[] = [];

		// 1. 准备数据
		const items: any[] = [];
		this.activeFeatures.forEach((feature) => {
			const popup = this.popupMap.get(feature);
			if (!popup || !popup.getVisible()) return;
			const el = popup.getElement();
			if (!el) return;
			const geoCoord = (feature.getGeometry() as any).getCoordinates();
			const pixel = this._map!.getPixelFromCoordinate(geoCoord);
			if (!pixel) return;

			items.push({
				feature,
				popup,
				anchorX: pixel[0], // 图标屏幕坐标 X
				anchorY: pixel[1], // 图标屏幕坐标 Y
				w: el.offsetWidth,
				h: el.offsetHeight,
				positioning: popup.getPositioning() || "top-left"
			});
		});

		// 2. 将所有图标(Anchor)本身视为障碍物，先添加到占用列表
		// 这样弹窗就不会覆盖任何一个图标
		items.forEach((item) => {
			occupiedRects.push({
				minX: item.anchorX - MARKER_RADIUS,
				maxX: item.anchorX + MARKER_RADIUS,
				minY: item.anchorY - MARKER_RADIUS,
				maxY: item.anchorY + MARKER_RADIUS
			});
		});

		// 3. 排序：这一步很关键
		// 按 Y 轴从上到下排序，或者按 X 轴从左到右。这保证了视觉稳定性。
		// 上面的元素优先占位，下面的元素负责避让。
		items.sort((a, b) => a.anchorY - b.anchorY);

		// 4. 贪心算法分配位置
		items.forEach((item) => {
			const { w, h, anchorX, anchorY, positioning } = item;

			// 计算该弹窗在“默认位置”下的中心点偏移
			// 我们以这个中心点为基准来计算最终 Offset
			const defaultCenterOffset = this.getCenterOffset(positioning, w, h);
			const defaultCenterX = anchorX + defaultCenterOffset[0];
			const defaultCenterY = anchorY + defaultCenterOffset[1];

			// 定义 4 个候选位置 (相对于 Anchor 的中心点)
			// 候选 1: 默认 (通常是上方)
			// 候选 2: 右侧
			// 候选 3: 左侧
			// 候选 4: 下方

			const candidates = [
				// [X, Y] 屏幕坐标中心点
				{ id: "top", x: defaultCenterX, y: defaultCenterY }, // 优先保持原位
				{ id: "right", x: anchorX + MARKER_RADIUS + w / 2 + GAP, y: anchorY },
				{ id: "left", x: anchorX - MARKER_RADIUS - w / 2 - GAP, y: anchorY },
				{ id: "bottom", x: anchorX, y: anchorY + MARKER_RADIUS + h / 2 + GAP }
			];

			let bestPos = candidates[0]; // 默认选第一个
			let found = false;

			// 遍历候选位置，找到第一个不重叠的
			for (const pos of candidates) {
				const rect: Rect = {
					minX: pos.x - w / 2,
					maxX: pos.x + w / 2,
					minY: pos.y - h / 2,
					maxY: pos.y + h / 2
				};

				if (!this.isOverlapping(rect, occupiedRects)) {
					bestPos = pos;
					found = true;
					// 将该位置标记为占用
					occupiedRects.push(rect);
					break;
				}
			}

			// 如果 4 个位置都满了 (极少情况)，就只能重叠了，默认选第一个或者稍微偏移一点
			if (!found) {
				// 强制添加进去，避免逻辑中断
				const rect: Rect = {
					minX: bestPos.x - w / 2,
					maxX: bestPos.x + w / 2,
					minY: bestPos.y - h / 2,
					maxY: bestPos.y + h / 2
				};
				occupiedRects.push(rect);
			}

			// 5. 应用位置
			// 计算 OpenLayers 需要的 offset
			// 公式：最终中心 - 默认中心 = 需要的位移
			// 解释：如果 bestPos 是 defaultCenter，结果就是 [0,0]，即不动
			const offsetX = bestPos.x - defaultCenterX;
			const offsetY = bestPos.y - defaultCenterY;

			item.popup.setOffset([offsetX, offsetY]);
		});
	}

	/** 检测矩形是否与列表中的任意矩形重叠 */
	private isOverlapping(rect: Rect, others: Rect[]): boolean {
		for (const other of others) {
			if (
				!(
					rect.maxX < other.minX ||
					rect.minX > other.maxX ||
					rect.maxY < other.minY ||
					rect.minY > other.maxY
				)
			) {
				return true;
			}
		}
		return false;
	}

	/** 辅助：根据 positioning 计算几何中心相对于 Anchor 的偏移 */
	private getCenterOffset(positioning: string, w: number, h: number): [number, number] {
		const parts = positioning.split("-");
		const vert = parts[0];
		const hori = parts[1];

		let dx = 0;
		let dy = 0;

		if (hori === "left") dx = w / 2;
		else if (hori === "right") dx = -w / 2;

		if (vert === "bottom") dy = -h / 2;
		else if (vert === "top") dy = h / 2;

		return [dx, dy];
	}

	private createPopup(options?: PopupOptions) {
		// 保持你原有的配置，不做强制修改
		const popupClass = `${options?.popupClass ?? ""} ol-tooltip-parent`;
		return new Popup(Object.assign({ positioning: "bottom-center" }, options, { popupClass }));
	}

	private initClickEvent(getEl: GetElFn) {
		/*...*/
	}
	private initMoveEvent(getEl: GetElFn) {
		/*...*/
	}
}
