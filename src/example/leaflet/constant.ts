import * as L from "leaflet";

// 天地图矢量底图
export const TianDiTu_Normal =
	"//t{s}.tianditu.gov.cn/vec_w/wmts?layer=vec&style=default&tilematrixset=w&Service=WMTS&Request=GetTile&Version=1.0.0&Format=tiles&tileMatrix={z}&TileCol={x}&TileRow={y}&tk={key}";

// 天地图影像底图
export const TianDiTu_Satellite =
	"//t{s}.tianditu.gov.cn/img_c/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=img&STYLE=default&TILEMATRIXSET=c&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk={key}";

// 天地图配置
export const TIANDITU_OPTIONS = {
	zIndex: 1,
	subdomains: ["0", "1", "2", "3", "4", "5", "6", "7"],
	key: "4e663361fafe62c28e0c3dc115047428",
	minZoom: 0,
	maxZoom: 17 //天地图经纬度投影的最大缩放级别为17,继续放大则没有瓦片可以拉取
	// tileSize: 256, //使用L.CRS.EPSG4326时需要放开这两个参数
	// zoomOffset: 1 //使用L.CRS.EPSG4326时需要放开这两个参数
};

// wms geoserve地址
export const Wms_Url = "http://121.40.117.96:9090/geoserver/gwc/service/wms";

const config = [
	{
		level: 0,
		resolution: 0.703125,
		scale: 295497593.05875
	},
	{
		level: 1,
		resolution: 0.3515625,
		scale: 147748796.529375
	},
	{
		level: 2,
		resolution: 0.17578125,
		scale: 73874398.2646875
	},
	{
		level: 3,
		resolution: 0.087890625,
		scale: 36937199.1323438
	},
	{
		level: 4,
		resolution: 0.0439453125,
		scale: 18468599.5661719
	},
	{
		level: 5,
		resolution: 0.02197265625,
		scale: 9234299.78308594
	},
	{
		level: 6,
		resolution: 0.010986328125,
		scale: 4617149.89154297
	},
	{
		level: 7,
		resolution: 0.0054931640625,
		scale: 2308574.94577148
	},
	{
		level: 8,
		resolution: 0.00274658203125,
		scale: 1154287.47288574
	},
	{
		level: 9,
		resolution: 0.001373291015625,
		scale: 577143.736442871
	},
	{
		level: 10,
		resolution: 0.0006866455078125,
		scale: 288571.868221436
	},
	{
		level: 11,
		resolution: 0.00034332275390625,
		scale: 144285.934110718
	},
	{
		level: 12,
		resolution: 0.000171661376953125,
		scale: 72142.9670553589
	},
	{
		level: 13,
		resolution: 0.000085830688476562,
		scale: 36071.4835276795
	},
	{
		level: 14,
		resolution: 0.000042915344238281,
		scale: 18035.7417638397
	},
	{
		level: 15,
		resolution: 0.00002145767211914,
		scale: 9017.87088191986
	},
	{
		level: 16,
		resolution: 0.00001072883605957,
		scale: 4508.93544095993
	},
	{
		level: 17,
		resolution: 0.000005364418029785,
		scale: 2254.46772047997
	},
	{
		level: 18,
		resolution: 0.000002682209014892,
		scale: 1127.23386023998
	},
	{
		level: 19,
		resolution: 0.000001341104507446,
		scale: 563.616930119991
	}
];

const CRS_4490 = new L.Proj.CRS(
	"EPSG:4490",
	"+proj=longlat +ellps=GRS80 +no_defs", // 中国2000坐标系定义
	{
		// resolutions: config.map((item) => item.resolution),
		resolutions: [
			1.4078260157100582, 0.703125, 0.3515625, 0.17578125, 0.087890625, 0.0439453125, 0.02197265625,
			0.010986328125, 0.0054931640625, 0.00274658203125, 0.001373291015625, 6.866455078125e-4,
			3.4332275390625e-4, 1.71661376953125e-4, 8.58306884765625e-5, 4.291534423828125e-5,
			2.1457672119140625e-5, 1.0728836059570312e-5, 5.364418029785156e-6, 2.6822090143215496e-6
		],
		origin: [-180, 90] // 必须与服务一致
		// bounds: L.bounds(
		// 	[38.48296746130006, 117.99921713378512],
		// 	[43.728451522700084, 126.62598136221504]
		// )
	}
);

export const MAP_OPTIONS: L.MapOptions = {
	zoom: 7,
	// zoomSnap: 0,
	// zoomDelta: 0.2,
	center: [41.3, 122.8],
	// crs: L.CRS.EPSG4326,
	// center: [30.39, 119.84],
	// maxBounds: L.latLngBounds(L.latLng(31.3, 118.2), L.latLng(29.8, 121.85)),
	// worldCopyJump: false,
	// wheelPxPerZoomLevel: 50,
	zoomControl: false,
	// crs: CRS_4490,
	attributionControl: false
	// new L.Proj.CRS("EPSG:4490", "+proj=longlat +ellps=GRS80 +datum=WGS84 +units=degrees", {
	//   origin: [-400.0, 399.9999999999998],
	//    resolutions: [
	//      0.04399456361617579, 0.021997281808087896, 0.010998639714313444, 0.005499319857156722,
	//      0.002749659928578361, 0.0013748311540196835, 6.874143872793388e-4, 3.4370838337017233e-4,
	//      1.7185419168508616e-4, 8.592709584254308e-5, 4.296354792127154e-5, 2.148177396063577e-5,
	//      1.0740886980317885e-5, 5.370443490158943e-6, 2.684032014576556e-6, 1.342016007288278e-6
	//     ],
	//     bounds: L.bounds(
	//     L.point(73.44696044900002, 3.408477306000009),
	//     L.point(135.08583068800004, 53.557926178)
	//     )
	//    })
	// crs: L.CRS.EPSG4326
	// crs: new L.Proj.CRS("EPSG:4490", "+proj=longlat +ellps=GRS80 +datum=WGS84 +units=degrees", {
	// 	origin: [-400.0, 399.9999999999998],
	// 	resolutions: [
	// 		0.04399456361617579, 0.021997281808087896, 0.010998639714313444, 0.005499319857156722,
	// 		0.002749659928578361, 0.0013748311540196835, 6.874143872793388e-4, 3.4370838337017233e-4,
	// 		1.7185419168508616e-4, 8.592709584254308e-5, 4.296354792127154e-5, 2.148177396063577e-5,
	// 		1.0740886980317885e-5, 5.370443490158943e-6, 2.684032014576556e-6, 1.342016007288278e-6
	// 	],
	// 	bounds: L.bounds(
	// 		L.point(73.44696044900002, 3.408477306000009),
	// 		L.point(135.08583068800004, 53.557926178)
	// 	)
	// })
	// crs: new L.Proj.CRS("EPSG:4490", "+proj=longlat +ellps=GRS80 +no_defs", {
	// 	resolutions: [
	// 		1.40625, 0.703125, 0.3515625, 0.17578125, 0.087890625, 0.0439453125, 0.02197265625,
	// 		0.010986328125, 0.0054931640625, 0.00274658203125, 0.001373291015625, 6.866455078125e-4,
	// 		3.4332275390625e-4, 1.71661376953125e-4, 8.58306884765625e-5, 4.291534423828125e-5,
	// 		// eslint-disable-next-line @typescript-eslint/no-loss-of-precision
	// 		2.1457672119140625e-5, 1.0728836059570312e-5, 5.364418029785156e-6, 2.682209064925356e-6,
	// 		1.3411045324626732e-6
	// 	],
	// 	origin: [-400.0, 399.9999999999998],
	// 	bounds: L.bounds([118.6, 31.3], [120.85, 29.8])
	// })
	// minZoom: 10,
	// maxZoom: 15,
	// maxBounds: L.latLngBounds(L.latLng(31.3, 118.6), L.latLng(29.8, 120.85)),
	// worldCopyJump: false,
	// wheelPxPerZoomLevel: 50,
	// zoomControl: true,
};
