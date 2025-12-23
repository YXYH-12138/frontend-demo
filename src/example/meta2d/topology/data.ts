// import { EventAction } from "@meta2d/core";
import { TopologyNodeType } from "@/constants";

// const textTop = 10;

interface IMenuData {
	type: string;
	text: string;
	children: IMenuDataChildrenItem[];
}
interface IMenuDataChildrenItem {
	type?: string;
	text: string;
	icon?: string;
	image?: string;
	data: any;
	[key: string]: any;
}

export const menuList: IMenuData[] = [
	{
		type: "station",
		text: "站点选择",
		children: [
			{
				text: "墙",
				data: {
					name: "svgPath",
					path: "M 1460 969 L 1460 869 L 1560 869 L 1560 879 L 1470 879 L 1470 969 Z",
					text: "",
					background: "black",
					width: 100,
					height: 100,
					textTop: 10,
					textBaseline: "bottom",
					nodeType: "a"
				}
			},
			{
				text: "b",
				data: {
					name: "svgPath",
					path: "M 0 0 H 100 V 100 H 0 Z M 50 0 V 50 100",
					width: 20,
					height: 160,
					nodeType: "b"
				}
			}
		]
	},
	{
		type: "custom",
		text: "自定义选择",
		children: [
			{
				type: "sk_fic",
				text: "虚拟水库",
				icon: "icon-xunishuiku",
				data: {
					name: "rectangle",
					text: "虚拟水库",
					width: 80,
					height: 30,
					textColor: "#00c0ff",
					color: "#00c0ff",
					background: "#fff",
					borderRadius: 0.3,
					dash: 1,
					lineDash: [5, 5],
					nodeType: TopologyNodeType.虚拟水库
				}
			},
			{
				type: "text",
				text: "文本",
				icon: "icon-wenben",
				data: {
					name: "text",
					text: "文本",
					width: 160,
					height: 30,
					textColor: "#000",
					nodeType: TopologyNodeType.文本
				}
			}
		]
	}
];

export const options = [
	{
		value: "1",
		label: "水模拟"
	},
	{
		value: "2",
		label: "洪水演进"
	},
	{
		value: "3",
		label: "水量调度"
	},
	{
		value: "4",
		label: "航运调度"
	},
	{
		value: "5",
		label: "水量预测"
	},
	{
		value: "6",
		label: "还原还现"
	},
	{
		value: "7",
		label: "传播时间"
	},
	{
		value: "8",
		label: "水量预测(topology)"
	},
	{
		value: "11",
		label: "水模拟(topology)"
	},
	{
		value: "12",
		label: "水量预测(新版)"
	},
	{
		value: "13",
		label: "水量调度(新版)"
	}
];
