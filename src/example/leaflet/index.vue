<template>
	<div class="home-page">
		<LMap :options="MAP_OPTIONS" ref="mapRef" @ready="init">
			<LTileLayer :url="TianDiTu_Normal" :options="TIANDITU_OPTIONS" />
			<!-- <LWmsTileLayer :url="tileLayerUrl" layers="m_sx" :options="opts" /> -->
			<!-- <LTileLayer :url="BASE_NORMAL">
        <LBoundaryCanvas :boundary="eastData" />
      </LTileLayer> -->
			<!-- <LWmsTileLayer :url="Wms_Url" layers="dtx:dtxgroup" :crs="L.CRS.EPSG4326" /> -->
			<!-- <LFlyBounds :bounds="bounds" v-model:visible="layerVisible.geo" /> -->
			<!-- <LGeoJson
				v-model:visible="layerVisible.geo"
				:geojson="bounds"
				:options="{ style: { color: 'red' } }"
			/> -->
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
import { onMounted, reactive, ref, shallowRef } from "vue";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MAP_OPTIONS, TianDiTu_Normal, TIANDITU_OPTIONS } from "./constant";
import { LMap, LTileLayer, LGeoJson } from "@/components/L";
import type { Feature, MultiPolygon } from "geojson";
// mock
import staions from "@/assets/gis/staion.json";

const mockData = staions.slice(0, 10);
const bounds = shallowRef<Feature<MultiPolygon, any>>();
// const tileLayerUrl = ref(
// 	"http://gxpt.jxsl.gov.cn/arcgis/rest/services/basemap/JXVectorBasemap/MapServer/tile/{z}/{y}/{x}"
// );

// const opts = {
// 	key: "U2lWYNEdoOSRUf wPqcR7w==",
// 	format: "image/png",
// 	minZoom: 0,
// 	maxZoom: 17, //天地图经纬度投影的最大缩放级别为17,继续放大则没有瓦片可以拉取
// 	tileSize: 256, //使用L.CRS.EPSG4326时需要放开这两个参数
// 	zoomOffset: 1 //使用L.CRS.EPSG4326时需要放开这两个参数
// };

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
	L.tileLayer
		.wms("http://localhost:9010/geoserver/base/wms", {
			layers: "base:hunan_dike",
			zIndex: 99,
			transparent: true,
			format: "image/png"
			// srs: "EPSG:4326"
		})
		.addTo(map);
	// const tileLayerUrl =
	// 	"http://gxpt.jxsl.gov.cn/arcgis/rest/services/basemap/JXVectorBasemap/MapServer/tile/{z}/{y}/{x}?code=5597d0bd91b3b4519afdb316efd57dbce";
	// L.tileLayer(tileLayerUrl).addTo(map!);
	// tiledMapLayer({
	// 	// tileSize: 256,
	// 	// zoomOffset: 1,
	// 	subdomains,
	// 	url: "http://gxpt.jxsl.gov.cn/arcgis/rest/services/basemap/JXVectorBasemap/MapServer/tile/{z}/{y}/{x}?code=5597d0bd91b3b4519afdb316efd57dbce"
	// }).addTo(map);
}

onMounted(init);

// import("@/mock/multi_polygon.json").then((data) => {
// 	bounds.value = data.default as any;
// });
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
