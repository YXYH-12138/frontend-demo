import { InjectionKey } from "vue";
import type { Emitter } from "mitt";
import type { Events } from "../type";

export type MapContext = {
  map?: L.Map;
  events: Emitter<Events>;
};

export type LayerMethods = {
  addLayer: <T extends L.Layer>(layer: T) => void;
  removeLayer: <T extends L.Layer>(layer: T) => void;
  setVisible: <T extends L.Layer>(layer: T, visible: boolean) => void;
};

export const mapContextKey: InjectionKey<MapContext> = Symbol();
export const layerMethodsKey: InjectionKey<LayerMethods> = Symbol();
export const layerGroupMethodsKey: InjectionKey<LayerMethods> = Symbol();

export const layerKey: InjectionKey<L.Layer> = Symbol();
