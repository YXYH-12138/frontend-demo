import { onMounted, shallowRef, onBeforeUnmount } from "vue";
import { Map as OlMap, type MapBrowserEvent, View } from "ol";
import { defaults } from "ol/control";
import { has } from "lodash-es";
import { fromLonLat } from "ol/proj";
import { defaults as interactionDefaults } from "ol/interaction";
import "ol/ol.css";
import "ol-ext/dist/ol-ext.css";
import type { FeatureLike } from "ol/Feature";
import type { MapOptions } from "ol/Map";
import type BaseLayer from "ol/layer/Base";
import type { ViewOptions } from "ol/View";
import { fromExtent } from "ol/geom/Polygon";
import { getCenter } from "ol/extent";
import proj4 from "proj4";
import { register } from "ol/proj/proj4";

export const MAP_CENTER = [122.24, 41.32];

proj4.defs("EPSG:4490", "+proj=longlat +datum=CGCS2000 +no_defs");
register(proj4);

export const IS_MARKER = "__is_marker";
export const isPointMarker = (feature: FeatureLike) => has(feature.getProperties(), IS_MARKER);

export const HITTOLERANCE = 3;

export const getFeatures = (e: MapBrowserEvent<any>) => {
	const map = e.map;
	if (!map || !e.pixel) return [];
	// 判断点击的点是否在marker上
	const features = map.getFeaturesAtPixel(e.pixel, { hitTolerance: HITTOLERANCE });
	return features.filter(isPointMarker);
};

type BaseLayersItem = Record<string, BaseLayer>;
type OlMapOptions = MapOptions & {
	// 底图切换配置
	baseLayers?: BaseLayersItem;
};

let BASE_ZOOM = 7.5;
export function setBaseZoom(zoom: number) {
	BASE_ZOOM = zoom;
}
let BASE_CENTER = fromLonLat(MAP_CENTER);
export function setCenter(lnglat: number[]) {
	BASE_CENTER = lnglat;
}

export function restoreCenter() {
	BASE_CENTER = fromLonLat(MAP_CENTER);
	BASE_ZOOM = 7.5;
}

export function createView(options?: ViewOptions) {
	return new View({
		center: BASE_CENTER,
		projection: "EPSG:3857",
		zoom: BASE_ZOOM,
		minZoom: 7.2,
		...(options || {})
		// constrainResolution: true
		// maxZoom: 12
	});
}

export class OlMapVue extends OlMap {
	private mapElRef = shallowRef<HTMLElement>();

	private _baseLayers: BaseLayersItem | undefined;
	private _layerMap: Map<any, BaseLayer[]> | undefined;

	constructor(options?: OlMapOptions) {
		const newOptions = {
			view: createView(),
			interactions: interactionDefaults({ doubleClickZoom: false }),
			controls: defaults({
				zoom: false,
				rotate: false,
				attribution: false
			}),
			...options
		} as MapOptions;
		super(newOptions);

		this._baseLayers = options?.baseLayers;
		this.initBaseLayers();

		onMounted(() => {
			this.setTarget(this.mapElRef.value);
		});
		onBeforeUnmount(() => {
			this.setTarget(undefined);
			this.mapElRef.value = undefined;
		});
	}

	private initBaseLayers() {
		if (this._baseLayers) {
			for (const key in this._baseLayers) {
				const layer = this._baseLayers[key];
				layer.setVisible(false);
				this.addLayer(layer);
			}
		}
	}

	getLayerByKey(key: any) {
		if (this._layerMap) {
			return this._layerMap.get(key);
		}
		return undefined;
	}

	layerforEach(fn: (value: BaseLayer, key: any) => void) {
		if (this._layerMap) {
			this._layerMap.forEach((layers, key) => {
				layers.forEach((layer) => fn(layer, key));
			});
		}
	}

	saveLayer(key: any, layer: BaseLayer | BaseLayer[]) {
		if (!this._layerMap) {
			this._layerMap = new Map();
		}
		if (this._layerMap.has(key)) {
			this.removeLayerByKey(key);
		}
		const layers = this._layerMap.get(key);
		const layerArray = Array.isArray(layer) ? layer : [layer];
		if (!layers) {
			this._layerMap.set(key, layerArray);
		} else {
			layers.push(...layerArray);
		}
	}

	setVisible(key: any, visible: boolean) {
		if (this._layerMap) {
			const layers = this._layerMap.get(key);

			if (layers) {
				layers.forEach((layer) => layer.setVisible(visible));
			}
		}
	}

	removeLayerByKey(key: any) {
		if (this._layerMap) {
			const layers = this._layerMap.get(key);
			if (layers) {
				layers.forEach((layer) => this.removeLayer(layer));
				this._layerMap.delete(key);
			}
		}
	}

	removeAllLayerByMapData() {
		if (this._layerMap) {
			this._layerMap.forEach((layers) => {
				layers.forEach((layer) => {
					this.removeLayer(layer);
				});
			});
			this._layerMap.clear();
		}
	}

	/**
	 * 定位站点
	 * @param lgtd
	 * @param lttd
	 */
	flyTo(lgtd: number, lttd: number, zoom = 10) {
		if (!lgtd || !lttd) return;
		const view = this.getView();
		view.setCenter(fromLonLat([lgtd, lttd]));
		view.setZoom(zoom);
	}

	/**
	 * 恢复默认视图
	 */
	restore(zoom = BASE_ZOOM) {
		const view = this.getView();
		view.setCenter(BASE_CENTER);
		view.setZoom(zoom);
	}

	/**
	 * 切换底图
	 * @param key
	 */
	changeBaseLayer(key: string) {
		if (this._baseLayers) {
			for (const k in this._baseLayers) {
				const layer = this._baseLayers[k];
				layer.setVisible(k === key);
			}
		}
	}

	calculateCenter(extent: number[], padding?: number | number[]) {
		const view = this.getView();
		const geometry = fromExtent(extent);
		const _padding = padding !== undefined ? padding : [0, 0, 0, 0];
		const rotatedExtent = view.rotatedExtentForGeometry(geometry);

		const minResolution = 0,
			nearest = false;
		let resolution = view.getResolutionForExtentInternal(rotatedExtent, [
			_padding[1] - _padding[3],
			_padding[0] - _padding[2]
		]);
		resolution = isNaN(resolution) ? minResolution : Math.max(resolution, minResolution);
		resolution = view.getConstrainedResolution(resolution, nearest ? 0 : 1) as number;

		// calculate center
		const rotation = view.getRotation();
		const sinAngle = Math.sin(rotation);
		const cosAngle = Math.cos(rotation);
		const centerRot = getCenter(rotatedExtent);
		centerRot[0] += ((_padding[1] - _padding[3]) / 2) * resolution;
		centerRot[1] += ((_padding[0] - _padding[2]) / 2) * resolution;
		const centerX = centerRot[0] * cosAngle - centerRot[1] * sinAngle;
		const centerY = centerRot[1] * cosAngle + centerRot[0] * sinAngle;
		const center = view.getConstrainedCenter([centerX, centerY], resolution);

		return center;
	}

	/**
	 * 设置鼠标移动到点上的样式
	 * @param style
	 */
	setMoveMarkerStyle(style = "pointer") {
		const handlePointermove = (e: MapBrowserEvent<any>) => {
			const view = e.map.getViewport();
			view.style.cursor = getFeatures(e).length ? style : "inherit";
		};
		this.on("pointermove", handlePointermove);
		return this;
	}

	onClickMarker(callback: (feature: FeatureLike[]) => void) {
		this.on("click", (e) => {
			const features = getFeatures(e);
			features.length && callback(features);
		});
		return this;
	}

	onMoveMarker(callback: (features: FeatureLike[], e: MapBrowserEvent<any>) => void) {
		this.on("pointermove", (e) => {
			const features = getFeatures(e);
			if (features) {
				callback(features, e);
			}
		});
		return this;
	}

	MapComponent = () => <div style="width: 100%; height: 100%" ref={this.mapElRef}></div>;
}
