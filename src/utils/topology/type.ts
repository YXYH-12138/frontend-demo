import { TopologyNodeType } from "@/constants";
import type { Ref } from "vue";
import type { Meta2d, Pen as _Pen, IValue } from "@meta2d/core";

export type LineName = "curve" | "polyline" | "line" | "mind";

export interface Pen extends _Pen {
	nodeType: TopologyNodeType;
}

export interface ILineConfig extends Pen {
	// 线条粗细
	lineWidth: number;
	// 线条颜色
	color: string;
	// 线条形状
	lineName: LineName;
	// 线条样式 实线/虚线
	lineStyle: "solid" | "dash";
	// 端点样式
	toArrow: string;
}

export interface IStationNodeConfig extends Pen {
	// 测站数据
	sttpObj?: any;
	// 测站名称
	text: string;
	// 测站类型
	sttp: string;
	// 测站编号
	stcdt: string;
	// 类别编号
	stcd: string;
	// 测站数据
	data: any;
	// 经度
	lgtd?: number;
	// 纬度
	lttd?: number;
	// 峰值预报
	apiPeak?: boolean;
}

export interface IContext {
	pen: Ref<Pen>;
	topology: Meta2d;
	setValue: (value: IValue) => void;
}
