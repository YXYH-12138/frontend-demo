import { onMounted, shallowRef, onBeforeUnmount } from "vue";
import { Map as OlMap, View } from "ol";
import { defaults } from "ol/control";
import { defaults as interactionDefaults } from "ol/interaction";
import "ol/ol.css";
import "ol-ext/dist/ol-ext.css";
import { transform3857 } from "@/utils/internal";
import type { MapOptions } from "ol/Map";
import type BaseLayer from "ol/layer/Base";

const MAP_CENTER = [118.041628, 36.192841];

type BaseLayersItem = Record<string, BaseLayer>;
type OlMapOptions = MapOptions & {
	// 底图切换配置
	baseLayers?: BaseLayersItem;
};

export class OlMapVue extends OlMap {
	private mapElRef = shallowRef<HTMLElement>();

	private _baseLayers: BaseLayersItem | undefined;
	private _layerMap: Map<any, BaseLayer> | undefined;

	constructor(options?: OlMapOptions) {
		const projection = "EPSG:3857";
		const newOptions = {
			view: new View({
				center: transform3857(MAP_CENTER),
				projection,
				zoom: 7.6
				// minZoom: 7.2
				// constrainResolution: true
				// maxZoom: 12
			}),
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

	saveLayer(key: any, layer: BaseLayer) {
		if (!this._layerMap) {
			this._layerMap = new Map();
		}
		if (this._layerMap.has(key)) {
			this.removeLayerByKey(key);
		}
		this._layerMap.set(key, layer);
	}

	setVisible(key: any, visible: boolean) {
		if (this._layerMap) {
			const layer = this._layerMap.get(key);
			if (layer) {
				layer.setVisible(visible);
			}
		}
	}

	removeLayerByKey(key: any) {
		if (this._layerMap) {
			const layer = this._layerMap.get(key);
			if (layer) {
				this.removeLayer(layer);
				this._layerMap.delete(key);
			}
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
		view.setCenter(transform3857([lgtd, lttd]));
		view.setZoom(zoom);
	}

	/**
	 * 恢复默认视图
	 */
	restore() {
		const view = this.getView();
		view.setCenter(transform3857(MAP_CENTER));
		view.setZoom(7.6);
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

	MapComponent = () => <div style="width: 100%; height: 100%" ref={this.mapElRef}></div>;
}
