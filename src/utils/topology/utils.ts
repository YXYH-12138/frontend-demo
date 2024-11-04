import { type Meta2dData, type Pen, PenType, Meta2d } from "@meta2d/core";
import { TopologyNodeType } from "@/constants";
import type { IStationNodeConfig } from "./type";

/** 在画笔中筛选节点对象 */
export function filterNodeByPens(meta2d: Meta2d | Meta2dData, excludeInfoNode = false) {
	const pens = meta2d instanceof Meta2d ? meta2d.data().pens : meta2d.pens;
	const allData = filterMeta2dNode(pens);
	return excludeInfoNode
		? allData.filter((item) => item.nodeType !== TopologyNodeType.CalcInfo)
		: allData;
}
export function filterMeta2dNode(pens: Pen[]) {
	return pens.filter((item) => item.type !== PenType.Line) as IStationNodeConfig[];
}

const createNodeTypeFn = (type: TopologyNodeType) => (nodeType: TopologyNodeType) =>
	nodeType === type;

export const isFloodStorageAreaNode = (nodeType: any) =>
	nodeType === TopologyNodeType.蓄滞洪区 ||
	nodeType === TopologyNodeType.蓄滞洪区简 ||
	nodeType === TopologyNodeType.闸堰;

/** 是否是调洪控制节点 */
export const isFlood = createNodeTypeFn(TopologyNodeType.FloodType);
