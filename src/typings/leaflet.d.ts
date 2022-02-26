// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as L from "leaflet";

declare module "leaflet" {
  namespace esri {
    namespace Vector {
      export * from "esri-leaflet-vector";
    }
  }
  interface MarkerOptions {
    params?: any;
  }
  interface RiverOptions {
    color: string;
    minWidth: number;
    maxWidth: number;
    ratio: number | null;
  }
  interface MarkerRippleOptions extends MarkerOptions {
    initialState?: boolean;
    color?: string;
    iconSize?: [number, number];
    bcSize?: number;
    html: string;
  }
  namespace TileLayer {
    namespace BoundaryCanvas {
      function createFromLayer(layer: any, options?: any): TileLayer;
    }
  }
  namespace tileLayer {
    function chinaProvider(type: string, info: any): GridLayer;
    // export * from "leaflet-tilelayer-wmts";
  }
  class River extends FeatureGroup {}
  function river(latLngs: Array<LatLng>, options: RiverOptions): River;
  class MarkerRipple extends Marker {
    trigger(only?: boolean): this;
    remove(): this;
  }
  function markerRipple(point: PointTuple, options: MarkerRippleOptions): MarkerRipple;
}
