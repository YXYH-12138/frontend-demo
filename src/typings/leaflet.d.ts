// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as L from "leaflet";

declare module "leaflet" {
	interface RiverOptions {
		color: string;
		minWidth: number;
		maxWidth: number;
		ratio: number | null;
	}
	interface MarkerOptions {
		params?: any;
	}
	namespace TileLayer {
		namespace BoundaryCanvas {
			function createFromLayer(layer: any, options?: any): TileLayer;
		}
		function wmts(...arg: any[]): L.Layer;
	}
	namespace tileLayer {
		function chinaProvider(type: string, info: any): GridLayer;
		function wmts(...arg: any[]): L.Layer;
		// export * from "leaflet-tilelayer-wmts";
	}
	class River extends FeatureGroup {}
	function river(latLngs: Array<LatLng>, options: RiverOptions): River;
}
