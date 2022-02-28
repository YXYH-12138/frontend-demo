import type { Emitter } from "mitt";

export type MapEvents = {
  // 地图初始化完成
  ready: L.Map;
  // 图层切换
  layerVisible: { layer: L.Layer; visible: boolean; name?: string };
  "*": void;
};

export type FlyEvents = {
  layerHidden: { name: string };
  "*": void;
};

export type MapContext = {
  map?: L.Map;
  events: Emitter<MapEvents>;
};

// 底图
export type MapBaseType =
  | "Terrain" // 地形图
  | "Satellite" //卫星图
  | "Normal"; //矢量底图

// geojson图层服务
export interface WFSParams {
  service: string;
  version: string;
  request: string;
  typeName: string;
  outputFormat: string;
  CQL_FILTER: string;
  TYPE: number;
  url?: string;
}
