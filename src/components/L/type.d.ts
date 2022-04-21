import type { Emitter } from "mitt";

export type MapEvents = {
	// 地图初始化完成
	ready: L.Map;
	// 图层切换
	layerVisible: { layer: L.Layer; visible: boolean };
	"*": void;
};

export type MapContext = {
	map?: L.Map;
	events: Emitter<MapEvents>;
};

export type IconDefaultUrl = Partial<
	Record<"iconRetinaUrl" | "iconUrl" | "shadowUrl", string | Promise<any>>
>;
