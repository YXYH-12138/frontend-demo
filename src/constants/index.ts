// 站点类型
export const enum StationType {
	"超警戒" = "cjj",
	"超保证" = "cbz",
	"超历史" = "cls",
	"超汛限" = "cxx",
	"低旱警" = "dhj",
	"低历史" = "dls",
	"水位站" = "ZZ",
	"水文站" = "ZQ",
	"水库" = "RR",
	"气象站" = "MM",
	"蒸发站" = "BB",
	"潮位站" = "TT",
	"墒情站" = "SS",
	"闸坝" = "DD",
	"雨量站" = "PP",
	"泵站" = "DP",

	"洪水蓝色预警" = "B",
	"洪水黄色预警" = "Y",
	"洪水橙色预警" = "O",
	"洪水红色预警" = "R"
}

// 概化图节点类型
export const enum TopologyNodeType {
	水库A,
	水库B,
	圆形站点,
	城市A,
	水文站,
	标注,
	湖区,
	水库_纵,
	水库_横,
	水库_在建,
	水库_已建,
	城市B,
	控制断面,
	文本,
	虚拟水库,
	蓄滞洪区,
	水库群,
	风险点,
	虚拟站点,
	区间代表站,
	FloodType,
	CalcInfo,
	闸门,
	蓄滞洪区简,
	闸堰
}

/**
 * 模型类型
 * 模型类型是定死的，不是随便取的名字
 * 添加新模型时需要注意
 */
export const enum ModelType {
	XAJMK = "XAJMK", // 新安江模型
	APIUH = "APIUH", // API模型
	XGT = "XGT", // 相关图
	CC = "CC", // 汇流曲线
	MUSKF = "MUSKF", //分段马法
	SQMUSKF = "SQMUSKF", // 合成马法
	SQ = "SQ", //合成流量
	LQ = "LQ", //实况流量合成
	DELTAH = "DeltaH", //落差模型
	WLC = "WLC", //CW-水力学
	CJHH = "CJHH", //CW-水力学
	YWSLX = "YWSLX", //一维水力学
	SLX = "SLX", //水力学
	RQH = "RQH", //调洪演算
	DH = "DH", //改进大湖
	GRIDXAJWATER = "GRIDXAJWATER", // Grid-XAJ本站
	GRIDXAJRAIN = "GRIDXAJRAIN", // Grid-XAJ区间;
	NYNL = "NYNL", // 纳雨能力
	DARXAJ = "DARXAJ", // 分布式双拦蓄新安江
	DARXAJWATER = "DARXAJWATER", // 分布式双拦蓄新安江来水站
	MR = "MR", // 多元回归
	APIPEAK = "APIPEAK", // api峰
	FLB = "FLB", // 分流比
	DHF = "DHF", // 大伙房
	XAJVMR = "XAJ_VMR", // 混合产流新安江模型
	SBM = "SBM" // 陕北模型(SBM)
}

/** 概化图类型 */
export const enum TopologyType {
	水模拟 = "11",
	峰值预报 = "15",
	水量预测 = "12",
	分布式新安江 = "13"
}

export const enum StationPositionType {
	开始站 = "1",
	结束站 = "2",
	普通站 = "0"
}

// 预报类别
export const enum ForeType {
	QQ = "QQ",
	PQQ = "PQQ",
	PQ = "PQ"
}

//#region 相关图
// 坐标
export const enum CoordType {
	X = "X",
	XX = "XX",
	Y = "Y",
	YY = "YY",
	Z = "Z",
	ZZ = "ZZ"
}
// 预报类型
export const enum ForecastType {
	H = "H",
	Q = "Q",
	P = "P",
	A = "A",
	OTQ = "O"
}
//#endregion

export const enum HQType {
	混合 = 0,
	单一线 = 1,
	连时序 = 2
}

export const enum OpenType {
	自溃,
	闸门
}

// 调洪方式
export const enum FloodType {
	来多少放多少 = "0",
	维持当前出库 = "1",
	按单一出库维持 = "2",
	规程调度 = "3",
	按设置出库调洪 = "4",
	按昨日日均出库维持 = "5",
	按昨日出库过程控制 = "6",
	按泄流能力控制 = "7"
}

// 入流方式
export const enum InflowType {
	自定义入流 = "0",
	侧堰公式 = "1",
	规则调度 = "2"
}

export const enum RiverRoutingModel {
	滞后演算 = 1,
	分段马法
}

export const enum FeatureValue {
	警戒水位 = "wrZ",
	保证水位 = "grZ",
	设计洪水位 = "dsflZ",
	讯限水位 = "fsldtz",
	校核洪水位 = "ckflZ"
}

export const enum FeatureColor {
	超警戒 = "yellow",
	// eslint-disable-next-line @typescript-eslint/no-duplicate-enum-values
	超汛限 = "yellow",
	// eslint-disable-next-line @typescript-eslint/no-duplicate-enum-values
	超保证 = "#a90c0c",
	// eslint-disable-next-line @typescript-eslint/no-duplicate-enum-values
	超设计 = "#a90c0c",
	// eslint-disable-next-line @typescript-eslint/no-duplicate-enum-values
	超历史 = "#620a0a",
	// 超防洪高水位 = "red",
	// eslint-disable-next-line @typescript-eslint/no-duplicate-enum-values
	超校核 = "orange"
}

export const JS_MAP_URL = "https://120.201.227.180:8190";
// wms
export const MAP_WMS_URL = import.meta.env.VITE_MAP_API + "/geoserver/liaoning/wms";
// 天地图token
export const TIAN_TK = "4e663361fafe62c28e0c3dc115047428";

// 天地图矢量服务地址
export const TIAN_VEW_W = `http://t1.tianditu.com/DataServer?T=vec_w&tk=${TIAN_TK}&x={x}&y={y}&l={z}`;
// 天地图地形图
export const TIAN_TER_W = `http://t1.tianditu.com/DataServer?T=ter_w&tk=${TIAN_TK}&x={x}&y={y}&l={z}`;
// 天地图影像底图
export const TIAN_IMG_W = `http://t1.tianditu.com/DataServer?T=img_w&tk=${TIAN_TK}&x={x}&y={y}&l={z}`;
// 影像注记
export const TIAN_CIA_W = `http://t1.tianditu.com/DataServer?T=cva_w&tk=${TIAN_TK}&x={x}&y={y}&l={z}`;
