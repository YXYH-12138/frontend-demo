<template>
	<div class="home-page">
		<LMap :options="MAP_OPTIONS" ref="mapRef" @ready="init">
			<!-- <LTileLayer :url="TianDiTu_Normal" :options="TIANDITU_OPTIONS" /> -->
			<!-- <LWmsTileLayer :url="tileLayerUrl" layers="m_sx" :options="opts" /> -->
			<!-- <LTileLayer :url="BASE_NORMAL">
        <LBoundaryCanvas :boundary="eastData" />
      </LTileLayer> -->
			<!-- <LWmsTileLayer :url="Wms_Url" layers="dtx:dtxgroup" :crs="L.CRS.EPSG4326" /> -->
			<!-- <LFlyBounds :bounds="bounds" v-model:visible="layerVisible.geo" /> -->
			<LGeoJson
				v-model:visible="layerVisible.geo"
				:geojson="bounds"
				:options="{ style: { color: 'red' } }"
			/>
			<LFlyLatLng :active="activeFly" highlight :fly-zoom="12" />
			<LMarker :lat-lng="[30.34161, 119.82]" :visible="layerVisible.DD" id="pp">
				<LIcon :icon-url="ppImg" :icon-size="[20, 20]">
					<div class="rain-station"></div>
				</LIcon>
				<LToolTip content="123" />
			</LMarker>
			<LLayerGroup :visible="layerVisible.RR">
				<LMarker
					:lat-lng="[item.lttd, item.lgtd]"
					v-for="item in mockData"
					:key="item.stnm"
					:id="item.stnm"
				>
					<LIcon :icon-url="rrImg" :icon-size="[20, 20]" />
					<LPopup>{{ item.stnm }}</LPopup>
					<LToolTip permanent :offset="[0, -8]">
						<!-- {{ item.stnm }} -->
						{{ row }}
						<!-- <div class="tooltip-rr-demo">
							{{ item.stnm }}
							{{ row }}
						</div> -->
					</LToolTip>
				</LMarker>
			</LLayerGroup>
		</LMap>
		<el-card class="checkbox">
			<el-checkbox v-model="layerVisible.DD" label="雨量"></el-checkbox>
			<el-checkbox v-model="layerVisible.RR" label="水库"></el-checkbox>
			<el-checkbox v-model="layerVisible.geo" label="geojson"></el-checkbox>
			<ul class="station-list">
				<li v-for="item in mockData" :key="item.stnm" @click="flyTo(item)">
					{{ item.stnm }}
				</li>
				<li @click="activeFly = 'pp'">rain</li>
			</ul>
		</el-card>
	</div>
</template>

<script lang="ts" setup>
import { reactive, ref, shallowRef } from "vue";
import * as L from "leaflet";
import {
	MAP_OPTIONS,
	TianDiTu_Normal,
	TianDiTu_Satellite,
	Wms_Url,
	TIANDITU_OPTIONS
} from "./constant";
import {
	LMap,
	LTileLayer,
	LBoundaryCanvas,
	LWmsTileLayer,
	LFlyBounds,
	LToolTip,
	LPopup,
	LFlyLatLng,
	LIcon,
	LMarker,
	LLayerGroup,
	LGeoJson
} from "@/components/L";
import type { Feature, MultiPolygon } from "geojson";
// mock
import ppImg from "@/assets/img/雨量站.png";
import rrImg from "@/assets/img/水库.png";
import eastData from "@/assets/gis/east_watershed.json";
import staions from "@/assets/gis/staion.json";
import { tiledMapLayer, type TiledMapLayerOptions } from "esri-leaflet";

const mockData = staions.slice(0, 10);
const bounds = shallowRef<Feature<MultiPolygon, any>>();
const tileLayerUrl = ref(
	"http://gxpt.jxsl.gov.cn/arcgis/rest/services/basemap/JXVectorBasemap/MapServer/tile/{z}/{y}/{x}"
);

const opts = {
	key: "U2lWYNEdoOSRUf wPqcR7w==",
	format: "image/png",
	minZoom: 0,
	maxZoom: 17, //天地图经纬度投影的最大缩放级别为17,继续放大则没有瓦片可以拉取
	tileSize: 256, //使用L.CRS.EPSG4326时需要放开这两个参数
	zoomOffset: 1 //使用L.CRS.EPSG4326时需要放开这两个参数
};

const mapRef = shallowRef<{ map: L.Map }>();

const activeFly = ref("");
// 图层
const layerVisible = reactive({
	RR: true,
	DD: true,
	geo: false
});

const row = ref("qawedadasdasd");

const flyTo = (data: Record<string, any>) => {
	activeFly.value = data.stnm;
	// tileLayerUrl.value = TianDiTu_Satellite;
	row.value = "63d6e02a1601f2ffa4e5979ce5613371";
};

function init() {
	const { map } = mapRef.value!;
	const subdomains: string[] = [];
	for (let i = 0; i <= 15; i++) {
		subdomains.push(i + "");
	}

	const tileLayerUrl =
		"http://gxpt.jxsl.gov.cn/arcgis/rest/services/basemap/JXVectorBasemap/MapServer/tile/{z}/{y}/{x}?code=5597d0bd91b3b4519afdb316efd57dbce";

	L.tileLayer(tileLayerUrl).addTo(map!);

	// tiledMapLayer({
	// 	// tileSize: 256,
	// 	// zoomOffset: 1,
	// 	subdomains,
	// 	url: "http://gxpt.jxsl.gov.cn/arcgis/rest/services/basemap/JXVectorBasemap/MapServer/tile/{z}/{y}/{x}?code=5597d0bd91b3b4519afdb316efd57dbce"
	// }).addTo(map);
	// L.tileLayer
	// 	.wmts("https://gatewayproxy-jcpt.mwr.cn/mdem30m/wmts100?k=I2U1Xc6hX+ka1ieW5jo1BA==", {
	// 		layer: "m_dem30m",
	// 		tilematrixset: "GoogleMapsCompatible_m_dem30m",
	// 		Format: "image/png",
	// 		crs: L.CRS.EPSG4326,
	// 		// matrixIds: "",
	// 		// TileMatrix: "6",
	// 		tileSize: 256, //使用L.CRS.EPSG4326时需要放开这两个参数
	// 		zoomOffset: 1 //使用L.CRS.EPSG4326时需要放开这两个参数
	// 		// TileMatrix: "EPSG:900913:8"
	// 	})
	// 	.addTo(map);
}

import("@/mock/multi_polygon.json").then((data) => {
	bounds.value = data.default as any;
});
</script>

<style scoped lang="scss">
.home-page {
	position: relative;
	height: 100%;
	.station-list {
		li {
			cursor: pointer;
			height: 26px;
			line-height: 26px;
			&:hover {
				background-color: rgb(236, 159, 159);
			}
		}
	}
	.rain-station {
		width: 18px;
		height: 18px;
		display: inline-block;
		border-radius: 50%;
		border: 2px solid #fff;
		background-color: blue;
	}
	.tooltip-demo {
		font-size: 18px;
		color: red;
	}
	.tooltip-rr-demo {
		font-size: 18px;
		color: blue;
	}
	.checkbox {
		position: absolute;
		right: 50px;
		top: 50px;
		z-index: 999;
	}
}
</style>
