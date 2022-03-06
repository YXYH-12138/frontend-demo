import * as L from "leaflet";

export const TIANDITU_URL =
  "//t{s}.tianditu.gov.cn/vec_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=vec&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk={key}";

// 矢量底图
export const BASE_NORMAL =
  "https://sldtptgis.zjwater.com/arcgis/rest/services/basemap/ZLSLVectorMap/MapServer/tile/{z}/{y}/{x}";
// 地形图
export const BASE_TERRAIN =
  "https://sldtptgis.zjwater.com/arcgis/rest/services/basemap/ZJRasterMap/MapServer/tile/{z}/{y}/{x}";

export const MAP_OPTIONS: L.MapOptions = {
  zoom: 11.2,
  zoomSnap: 0,
  zoomDelta: 0.2,
  minZoom: 8,
  maxZoom: 15,
  center: [30.39, 119.84],
  maxBounds: L.latLngBounds(L.latLng(31.3, 118.2), L.latLng(29.8, 121.85)),
  worldCopyJump: false,
  wheelPxPerZoomLevel: 50,
  zoomControl: false,
  attributionControl: false,
  crs: L.CRS.EPSG3857
  // crs: new L.Proj.CRS("EPSG:4490", "+proj=longlat +ellps=GRS80 +no_defs", {
  //   resolutions: [
  //     1.40625, 0.703125, 0.3515625, 0.17578125, 0.087890625, 0.0439453125, 0.02197265625,
  //     0.010986328125, 0.0054931640625, 0.00274658203125, 0.001373291015625, 6.866455078125e-4,
  //     3.4332275390625e-4, 1.71661376953125e-4, 8.58306884765625e-5, 4.291534423828125e-5,
  //     2.1457672119140625e-5, 1.0728836059570312e-5, 5.364418029785156e-6, 2.682209064925356e-6,
  //     1.3411045324626732e-6
  //   ],
  //   origin: [-179.9999, 90.00016],
  //   bounds: L.bounds([118.6, 31.3], [120.85, 29.8])
  // }),
  // minZoom: 10,
  // maxZoom: 15,
  // maxBounds: L.latLngBounds(L.latLng(31.3, 118.6), L.latLng(29.8, 120.85)),
  // worldCopyJump: false,
  // wheelPxPerZoomLevel: 50,
  // zoomControl: true,
};
