// leaflet相关
import "proj4leaflet";
import "./leaflet/L.Path.DashFlow";
import "./leaflet/LTileWmts.js";
import "./leaflet/leaflet.ChineseTmsProviders";
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
