import { InjectionKey } from "vue";
import type { Marker } from "leaflet";
import type { MapContext, IconDefaultUrl } from "./type";

export type LayerMethods = {
	addLayer: <T extends L.Layer>(layer: T) => void;
	removeLayer: <T extends L.Layer>(layer: T) => void;
	setVisible: <T extends L.Layer>(layer: T, visible: boolean) => void;
};

export const mapContextKey: InjectionKey<MapContext> = Symbol();

export const iconUrlKey: InjectionKey<IconDefaultUrl> = Symbol();

export const layerMethodsKey: InjectionKey<LayerMethods> = Symbol();

export const layerKey: InjectionKey<L.Layer> = Symbol();

export const markeMap = new Map<string | number, Marker>();
