<template>
  <div class="home-page">
    <!-- <BaseMapControl v-model="baseActive" /> -->
    <LMap :options="defaultMapOption">
      <LTileLayer :url="tileLayerUrl" />
      <!-- <LTileLayer :url="BASE_NORMAL">
        <LBoundaryCanvas :boundary="require('@/assets/gis/east_watershed.json')" />
      </LTileLayer> -->
      <LWmsTileLayer
        url="http://121.40.117.96:9090/geoserver/gwc/service/wms"
        layers="dtx:east_watershed"
      />
      <LMarker :lat-lng="[30.34161, 119.84]" :visible="layerVisible.DD">
        <LIcon :icon-url="rrImg" :icon-size="[20, 20]" />
        <LToolTip>
          <div class="tooltip-demo">8888</div>
        </LToolTip>
      </LMarker>
    </LMap>
    <el-card class="checkbox">
      <el-checkbox v-model="layerVisible.DD" label="Option 1"></el-checkbox>
      <el-checkbox v-model="layerVisible.RR" label="Option 2"></el-checkbox>
    </el-card>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref } from "vue";
import * as L from "leaflet";
import rrImg from "@/assets/img/雨量站.png";
import {
  LMap,
  LTileLayer,
  LBoundaryCanvas,
  LWmsTileLayer,
  LToolTip,
  LPopup,
  LFly,
  LIcon,
  LMarker,
  LLayerGroup
} from "@/components/L";

// 矢量底图
const BASE_NORMAL =
  "https://sldtptgis.zjwater.com/arcgis/rest/services/basemap/ZLSLVectorMap/MapServer/tile/{z}/{y}/{x}";
// 地形图
const BASE_TERRAIN =
  "https://sldtptgis.zjwater.com/arcgis/rest/services/basemap/ZJRasterMap/MapServer/tile/{z}/{y}/{x}";

const crs = new L.Proj.CRS("EPSG:4490", "+proj=longlat +ellps=GRS80 +no_defs", {
  resolutions: [
    1.40625, 0.703125, 0.3515625, 0.17578125, 0.087890625, 0.0439453125, 0.02197265625,
    0.010986328125, 0.0054931640625, 0.00274658203125, 0.001373291015625, 6.866455078125e-4,
    3.4332275390625e-4, 1.71661376953125e-4, 8.58306884765625e-5, 4.291534423828125e-5,
    2.1457672119140625e-5, 1.0728836059570312e-5, 5.364418029785156e-6, 2.682209064925356e-6,
    1.3411045324626732e-6
  ],
  origin: [-179.9999, 90.00016],
  bounds: L.bounds([118.6, 31.3], [120.85, 29.8])
  //这里可以有origin、transformation、scales、resulutions、bounds几个参数提供
  //选择，其中scales与resolutions不能同时配置
});
const defaultMapOption: L.MapOptions = {
  zoom: 11.2,
  zoomSnap: 0,
  zoomDelta: 0.2,
  crs,
  minZoom: 10,
  maxZoom: 15,
  center: [30.34161, 119.84],
  maxBounds: L.latLngBounds(L.latLng(31.3, 118.6), L.latLng(29.8, 120.85)),
  worldCopyJump: false,
  wheelPxPerZoomLevel: 50,
  zoomControl: true,
  attributionControl: false
};
const tileLayerUrl = ref(BASE_NORMAL);

// 激活的底图
const baseActive = ref("Terrain");
// 图层
const layerVisible = reactive({
  RR: true,
  DD: true,
  dp: true
});
</script>

<style scoped lang="scss">
.home-page {
  height: 100%;
  display: flex;
  .tooltip-demo {
    font-size: 18px;
    color: blue;
  }
  .checkbox {
    position: fixed;
    right: 50px;
    top: 50px;
    z-index: 999;
    background-color: #fff;
  }
}
</style>
