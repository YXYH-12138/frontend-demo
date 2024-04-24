<template>
	<div class="home-page">
		<LMap :options="MAP_OPTIONS" ref="mapRef" @ready="init">
			<LTileLayer :url="tileLayerUrl" />
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
	</div>
</template>

<script lang="ts" setup>
import { shallowRef } from "vue";
import L from "leaflet";
import FreeDraw from "leaflet-freedraw";
import { MAP_OPTIONS } from "../leaflet/constant";
import { LMap, LTileLayer } from "@/components/L";
import data from "./bound";

interface DrawData {
	polygon?: L.Polygon;
}

const tileLayerUrl =
	"http://gxpt.jxsl.gov.cn/arcgis/rest/services/basemap/JXVectorBasemap/MapServer/tile/{z}/{y}/{x}?code=5597d0bd91b3b4519afdb316efd57dbce";

const mapRef = shallowRef<{ map: L.Map }>();

// 保存一些绘制的信息
const drawData: DrawData = {};

// 初始化圈画实例
const freeDraw = new FreeDraw();

function init() {
	const { map } = mapRef.value!;
	const latLngs = [
		[
			...data.BOUNDY.map((item, index) => ({
				lat: Number(item),
				lng: Number(data.BOUNDX[index])
			}))
		]
	];
	drawData.polygon && drawData.polygon.remove();

	const polygon = L.polygon(latLngs, {
		color: "blue",
		fill: true,
		fillColor: "blue",
		fillOpacity: 0.1
	});
	polygon.addTo(map);

	initPm(map);
	// L.tileLayer(tileLayerUrl).addTo(map!);
}

function initPm(map: L.Map) {
	map.pm.addControls({
		position: "topright",
		drawMarker: false,
		drawCircleMarker: false,
		drawPolyline: false,
		drawRectangle: false,
		drawCircle: false,
		drawText: false,
		dragMode: false,
		cutPolygon: false,
		rotateMode: false,
		optionsControls: false,
		removalMode: false,
		drawControls: true,
		drawPolygon: false,
		editControls: true,
		customControls: true,
		oneBlock: true
	});

	map.pm.Toolbar.createCustomControl({
		name: "freeDraw",
		block: "custom",
		className: "icon-freedraw xyz-class",
		title: "手动圈画",
		onClick: () => {
			// if (that.saveDraws.length) {
			// 	that.clearDraw();
			// }
			// that.toggleFreeDraw();
		},
		toggle: false
	});

	map.pm.Toolbar.changeControlOrder(["autoCircle", "freeDraw"]);
	map.pm.setGlobalOptions({
		limitMarkersToCount: 1,
		snappable: false,
		finishOn: "dblclick",
		templineStyle: {
			stroke: true,
			fill: true,
			fillColor: "#ff0080",
			color: "red"
		},
		hintlineStyle: {
			stroke: true,
			fill: true,
			color: "red",
			fillColor: "#ff0080",
			dashArray: [0, 0]
		},
		pathOptions: {
			stroke: true,
			fill: true,
			color: "#ff0080",
			fillColor: "#ff0080",
			fillOpacity: 0.1
		}
	});
}

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
