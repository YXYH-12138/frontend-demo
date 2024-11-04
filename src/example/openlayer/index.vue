<template>
	<div ref="mapElRef" class="map"></div>
</template>

<script lang="ts" setup>
import { onMounted, shallowRef } from "vue";
import { Map, View, Feature, Collection } from "ol";
import { Translate } from "ol/interaction";
import { defaults } from "ol/control";
import { Image, Tile, Vector } from "ol/layer";
import { Point } from "ol/geom";
import { TileArcGISRest, ImageArcGISRest, XYZ, Vector as VectorSource } from "ol/source";
import { Style, Icon } from "ol/style";
import { fromLonLat } from "ol/proj";
import rrImg from "@/assets/img/水库.png";
// import Projection from "ol/proj/Projection";

import "ol/ol.css";

const mapElRef = shallowRef<HTMLElement>();

const MAP_CENTER = [118.041628, 36.192841];

const ARCGIS_URL = "http://10.37.1.46:6080";
// 地形图
const TERRAIN_URL = ARCGIS_URL + "/arcgis/rest/services/shandongTerrainSLB230910/MapServer/";
// 河流
const RIVER_URL = ARCGIS_URL + "/arcgis/rest/services/shandongRiver230313/MapServer/";

// new PointerInteraction();

function initMarker(map: Map) {
	const data = [
		{
			stcd: "20090003",
			stnm: "穿卫枢纽",
			rvnm: "清临干渠",
			hnnm: "漳卫南运河",
			bsnm: "海河",
			lgtd: "115.700000",
			lttd: "36.800000",
			stlc: "山东省临清市刘庄",
			addvcd: "",
			addvnm: "",
			dtmnm: "黄海",
			dtmel: "0.000",
			sttp: "RR",
			frgrd: "1",
			admauth: "海委漳卫南局",
			locality: "海委水文",
			stazt: "",
			phcd: "cwsn",
			level: 0
		},
		{
			stcd: "30940560",
			stnm: "杨固",
			rvnm: "沙东排干渠",
			hnnm: "南运河",
			bsnm: "海河",
			lgtd: "115.020675",
			lttd: "36.434058",
			stlc: "河北省邯郸市大名县王桥乡杨固村",
			addvcd: "130425",
			addvnm: "邯郸市大名县",
			dtmnm: "",
			dtmel: "",
			sttp: "PP",
			frgrd: "3",
			admauth: "邯郸水文",
			locality: "河北水文",
			stazt: "0",
			phcd: "",
			level: 0
		}
	];

	const markerFeatures: Feature[] = [];

	data.forEach((row) => {
		// 创建一个样式来定义marker的外观
		const iconStyle = new Style({
			image: new Icon({
				size: [22, 22],
				scale: 0.8,
				// anchor: [0.5, 1],
				src: rrImg
			})
		});
		// 创建一个feature，并将marker添加到这个feature中
		const markerFeature = new Feature({
			geometry: new Point([+row.lgtd, +row.lttd]),
			station: row
		});
		markerFeature.setStyle(iconStyle);
		markerFeatures.push(markerFeature);
	});

	// 创建一个VectorLayer来存放marker
	const markerLayer = new Vector({
		source: new VectorSource({ features: markerFeatures })
	});

	// 将feature添加到图层中
	// markerLayer.getSource().addFeature(markerFeature);

	// 创建一个地图并将marker图层添加到地图中
	map.addLayer(markerLayer);

	// 这是拖动整个markerFeatures
	// const translate = new Translate({ features: new Collection(markerFeatures) });
	// map.addInteraction(translate);

	const translate = new Translate({
		//拖拽移动interaction
		// features: selFeature //拖拽的为选择的要素
	});
	map.addInteraction(translate);

	translate.on("translateend", (e) => {
		console.log(markerFeatures);
	});

	// 添加点击事件
	map.on("singleclick", function (e) {
		let feature = map.forEachFeatureAtPixel(e.pixel, (feature) => feature);
		if (feature) {
			console.log(feature.getProperties());
		}
		console.log("singleclick");
	});

	// 改变鼠标移到到点位上的光标样式。
	// map.on("pointermove", (e) => {
	// 	if (map.hasFeatureAtPixel(e.pixel)) {
	// 		map.getViewport().style.cursor = "pointer";
	// 	} else {
	// 		map.getViewport().style.cursor = "inherit";
	// 	}
	// });
}

function initMap() {
	// 天地图
	const t1 = new XYZ({
		// url: "http://t1.tianditu.com/DataServer?T=vec_w&tk=4e663361fafe62c28e0c3dc115047428&x={x}&y={y}&l={z}",
		url: "https://api.mapbox.com/styles/v1/qhstill/ckryqjnwo0at718q2y536wfej/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoicWhzdGlsbCIsImEiOiJja3J5cWUzZm8xMm56Mm5rM2IzYWw3aDI4In0.noaJXH7UflaJGWsxolcjFg"
	});
	const layers = [
		// 天地图
		new Tile({ source: t1 })
		// new Image({
		// 	source: new ImageArcGISRest({
		// 		url: TERRAIN_URL,
		// 		params: { SIZE: "256,256", DPI: 96 }
		// 	})
		// }),
		// new Image({
		// 	source: new ImageArcGISRest({
		// 		url: RIVER_URL,
		// 		params: { SIZE: "256,256", DPI: 96 }
		// 	})
		// })
	];

	// const epsg3857 = new Projection({ code: "EPSG:3857" });

	return new Map({
		target: mapElRef.value,
		layers: layers,
		view: new View({
			center: MAP_CENTER,
			projection: "EPSG:4326",
			// projection: epsg3857,
			// zoomSnap: 0,
			// zoomDelta: 0.2,
			zoom: 7,
			// minZoom: 7.2,
			maxZoom: 16
			// dragging: true, //是否允许拖拽
			// worldCopyJump: false,
			// wheelPxPerZoomLevel: 120,
			// attributionControl: false, //去除右下角标志
			// zoomControl: false, //是否显示地图缩放图例
			// crs: CRS_4546,
			// zoomAnimation: true
		}),
		controls: defaults({ zoom: false, rotate: false, attribution: false })
	});
}

onMounted(() => {
	const map = initMap();
	initMarker(map);
});
</script>

<style lang="scss" scoped>
.map {
	width: 100%;
	height: 100%;
}
</style>
