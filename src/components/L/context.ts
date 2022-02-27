import { InjectionKey } from "vue";
import type { Emitter } from "mitt";
import type { MapEvents, FlyEvents } from "./type";

export type MapContext = {
  map?: L.Map;
  events: Emitter<MapEvents>;
};

export type LayerMethods = {
  addLayer: <T extends L.Layer>(layer: T) => void;
  removeLayer: <T extends L.Layer>(layer: T) => void;
  setVisible: <T extends L.Layer>(layer: T, visible: boolean) => void;
};

export const mapContextKey: InjectionKey<MapContext> = Symbol();
export const layerMethodsKey: InjectionKey<LayerMethods> = Symbol();
export const layerGroupMethodsKey: InjectionKey<LayerMethods> = Symbol();

export const flyContextKey: InjectionKey<{
  events: Emitter<FlyEvents>;
  markerMap: Map<string, L.Marker[]>;
}> = Symbol();

export const flyKey: InjectionKey<string> = Symbol();

export const layerKey: InjectionKey<L.Layer> = Symbol();
