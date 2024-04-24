// leaflet相关
// import "proj4leaflet";

// import "@geoman-io/leaflet-geoman-free";
// import "@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css";
// import "leaflet/dist/leaflet.css";
// import "./leaflet/L.Path.DashFlow";
// import "./leaflet/LTileWmts.js";
// import "./leaflet/leaflet.ChineseTmsProviders";
// import "leaflet-river";
// import "esri-leaflet";

// (L.esri as any) = esri;

import VxeTable from "./vxe";
import type { App } from "vue";

/**
 * 加载所有的plugin
 * @param app 整个应用的实例
 */
export default function (app: App): void {
	app.use(VxeTable);
}
