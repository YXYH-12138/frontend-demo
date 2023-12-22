import * as L from "leaflet";

// 天地图矢量底图
export const TianDiTu_Normal =
	"//t{s}.tianditu.gov.cn/vec_c/wmts?layer=vec&style=default&tilematrixset=c&Service=WMTS&Request=GetTile&Version=1.0.0&Format=tiles&tileMatrix={z}&TileCol={x}&TileRow={y}&tk={key}";

// 天地图影像底图
export const TianDiTu_Satellite =
	"//t{s}.tianditu.gov.cn/img_c/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=img&STYLE=default&TILEMATRIXSET=c&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk={key}";

// 天地图配置
export const TIANDITU_OPTIONS = {
	format: "image/png",
	// subdomains: ["0", "1", "2", "3", "4", "5", "6", "7"],
	// key: "63d6e02a1601f2ffa4e5979ce5613371",
	minZoom: 0,
	maxZoom: 17, //天地图经纬度投影的最大缩放级别为17,继续放大则没有瓦片可以拉取
	tileSize: 256, //使用L.CRS.EPSG4326时需要放开这两个参数
	zoomOffset: 1 //使用L.CRS.EPSG4326时需要放开这两个参数
};

// wms geoserve地址
export const Wms_Url = "http://121.40.117.96:9090/geoserver/gwc/service/wms";

export const MAP_OPTIONS: L.MapOptions = {
	zoom: 11.2,
	// zoomSnap: 0,
	// zoomDelta: 0.2,
	center: [30.39, 119.84],
	// maxBounds: L.latLngBounds(L.latLng(31.3, 118.2), L.latLng(29.8, 121.85)),
	// worldCopyJump: false,
	// wheelPxPerZoomLevel: 50,
	zoomControl: false,
	attributionControl: false,
	crs: L.CRS.EPSG4326
	// crs: new L.Proj.CRS("EPSG:4490", "+proj=longlat +ellps=GRS80 +no_defs", {
	// 	resolutions: [
	// 		1.40625, 0.703125, 0.3515625, 0.17578125, 0.087890625, 0.0439453125, 0.02197265625,
	// 		0.010986328125, 0.0054931640625, 0.00274658203125, 0.001373291015625, 6.866455078125e-4,
	// 		3.4332275390625e-4, 1.71661376953125e-4, 8.58306884765625e-5, 4.291534423828125e-5,
	// 		// eslint-disable-next-line @typescript-eslint/no-loss-of-precision
	// 		2.1457672119140625e-5, 1.0728836059570312e-5, 5.364418029785156e-6, 2.682209064925356e-6,
	// 		1.3411045324626732e-6
	// 	],
	// 	origin: [-179.9999, 90.00016],
	// 	bounds: L.bounds([118.6, 31.3], [120.85, 29.8])
	// })
	// minZoom: 10,
	// maxZoom: 15,
	// maxBounds: L.latLngBounds(L.latLng(31.3, 118.6), L.latLng(29.8, 120.85)),
	// worldCopyJump: false,
	// wheelPxPerZoomLevel: 50,
	// zoomControl: true,
};
