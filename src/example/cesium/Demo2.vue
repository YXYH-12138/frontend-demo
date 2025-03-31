<template>
	<div class="w100% h100%" ref="elRef"></div>
	<el-button class="position-absolute top-20 left-30" type="primary" @click="load">加载</el-button>
	<el-button class="position-absolute top-20 left-100" type="primary" @click="start">{{
		isPlaying ? "停止" : "播放"
	}}</el-button>
</template>

<script lang="ts" setup>
import { onMounted, ref, shallowRef } from "vue";
import * as Cesium from "cesium";
import { TIAN_TK } from "@/constants";
import proj4 from "proj4";
import tyPng from "@/assets/img/ty.png";
import { appendId, diffDataSources, diffEntities, FlowMaterial } from "./helper";
import CustomColorMaterialProperty from "./custom";
import chroma from "chroma-js";
import { requestHostCallback } from "./schedule";

const elRef = shallowRef<HTMLElement>();

let viewer: Cesium.Viewer;

const orientation = {
	heading: Cesium.Math.toRadians(4), // east, default value is 0.0 (north)
	pitch: Cesium.Math.toRadians(-52) // default value (looking down)
};

/** 初始化Cesium */
function initCesium() {
	//配置并创建天地图Web瓦片服务影像提供者
	const tianditu = new Cesium.WebMapTileServiceImageryProvider({
		url:
			"http://{s}.tianditu.gov.cn/img_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=img&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default&format=tiles&tk=" +
			TIAN_TK,
		layer: "img_w",
		style: "default",
		format: "tiles",
		tileMatrixSetID: "w",
		subdomains: ["t0", "t1", "t2", "t3", "t4", "t5", "t6", "t7"],
		maximumLevel: 18,
		credit: new Cesium.Credit("天地图")
	});

	//底图切换
	const img_tdt_yx = new Cesium.ProviderViewModel({
		name: "影像底图",
		tooltip: "影像底图",
		iconUrl: tyPng,
		creationFunction: () => tianditu
	});

	// Cesium.Ion.defaultAccessToken = "your cesium token";
	const viewer = new Cesium.Viewer(elRef.value!, {
		baseLayerPicker: false, //隐藏底图切换
		skyAtmosphere: false, //隐藏大气层,
		// terrainProvider: Cesium.createWorldTerrain(),
		// sunlight: false,
		// imageryProviderViewModels: [img_tdt_yx],
		// selectedImageryProviderViewModel: img_tdt_yx,
		infoBox: false, // 不显示底部描述信息
		geocoder: false, // 是否显示位置查找工具（true表示是，false表示否）
		homeButton: true, // 是否显示首页位置工具
		sceneModePicker: false, //是否显示视角模式切换工具
		navigationHelpButton: false, //是否显示导航帮助工具
		selectionIndicator: false, //是否显示选中指示器工具
		animation: false, //是杏显示动画工具
		timeline: false, //是否显示时间轴工具
		fullscreenButton: false //是否显示全屏按钮工具
	});
	viewer.terrainShadows = Cesium.ShadowMode.DISABLED;
	viewer.scene.globe.enableLighting = false;
	// 雾气开关
	viewer.scene.fog.enabled = false;
	// 光照开关
	viewer.shadows = false;
	//       center: { lat: 27.778, lng: 112.656, alt: 30404, heading: 0, pitch: -90 },
	const destination = Cesium.Cartesian3.fromDegrees(112.656, 27.188, 78000);
	// 设置home button的默认位置
	viewer.homeButton.viewModel.command.beforeExecute.addEventListener(function (e) {
		e.cancel = true;
		viewer.camera.flyTo({ destination, orientation, duration: 0.5 });
	});
	// 最小缩放高度（米）
	viewer.scene.screenSpaceCameraController.minimumZoomDistance = 200;
	// 最大缩放高度（米）
	// viewer.scene.screenSpaceCameraController.maximumZoomDistance = 780000;
	// 设置视角
	viewer.camera.setView({ destination, orientation });
	//隐藏cesium左下角logo
	(viewer as any)._cesiumWidget._creditContainer.style.display = "none";
	// 删除默认图层
	viewer.imageryLayers.remove(viewer.imageryLayers.get(0));
	// 将天地图层添加到观众实例的影像图层集合中
	viewer.imageryLayers.addImageryProvider(tianditu);

	return viewer;
}

const sourceProj = "EPSG:32649"; // 原始坐标系
const targetProj = "EPSG:4326"; // 目标坐标系
// 定义源坐标系和目标坐标系
// proj4.defs(sourceProj, "+proj=utm +zone=49 +ellps=WGS84 +datum=WGS84 +units=m +no_defs");
const colorScale = chroma
	.scale(["rgb(0, 27, 254)", "rgb(0, 254, 0)", "rgb(254, 14, 0)"])
	.domain([0, 3.4])
	.mode("lrgb");

let ymdataSource: Cesium.GeoJsonDataSource | null = null;
// 定义一个函数来加载GeoJSON数据
async function loadGeoJsonData(url: string) {
	console.time("load geojson");

	// 使用fetch获取GeoJSON数据
	const response = await fetch(url);
	const geojsonData = await response.json();

	// geojsonData.features = geojsonData.features.map((feature) => {
	// 	if (feature.geometry.type === "Polygon") {
	// 		feature.geometry.coordinates = feature.geometry.coordinates.map((ring) => {
	// 			return ring.map((coord) => {
	// 				const [x, y] = proj4(sourceProj, targetProj, coord);
	// 				return [x, y];
	// 			});
	// 		});
	// 	} else if (feature.geometry.type === "MultiPolygon") {
	// 		feature.geometry.coordinates = feature.geometry.coordinates.map((polygons) => {
	// 			return polygons.map((ring) => {
	// 				return ring.map((coord) => {
	// 					const [x, y] = proj4(sourceProj, targetProj, coord);
	// 					return [x, y];
	// 				});
	// 			});
	// 		});
	// 	}
	// 	return feature;
	// });

	// 添加id
	// appendId(geojsonData);

	// geojsonData.features = geojsonData.features.slice(0, 1000);
	// console.log(geojsonData);

	// 使用GeoJsonDataSource加载转换后的数据
	const dataSource = await Cesium.GeoJsonDataSource.load(geojsonData, {
		clampToGround: true // 如果需要网格贴地
	});

	if (ymdataSource) {
		console.time("change entity");
		const color = count % 2 == 0 ? Cesium.Color.RED : Cesium.Color.BLUE;
		// 比较差异
		const { addArray, removeArray, updateArray } = diffDataSources(ymdataSource, dataSource);
		// console.log({ addArray, removeArray, updateArray });

		// 移除removeArray中的实体
		removeArray.forEach((entity) => {
			viewer.entities.remove(entity);
		});
		// 增加addArray中的实体
		addArray.forEach((entity) => {
			(entity.polygon as any).material = color; // 使用随机颜色和半透明度以简化样式
			(entity.polygon as any).outline = false; // 关闭轮廓以减少绘制复杂性
			viewer.entities.add(entity);
		});
		// 更新updateArray中的实体
		updateArray.forEach((entity) => {
			(entity.polygon as any).material = color;
		});
		console.timeEnd("change entity");
	} else {
		// 获取所有实体
		let entities = dataSource.entities.values;

		// 为每个实体设置样式，简化样式以提高性能
		for (let i = 0; i < entities.length; i++) {
			let entity: any = entities[i];
			const waterDept = entity.properties!.getValue(Cesium.JulianDate.now())[
				"WATER_DEPT"
			] as number;
			entity.polygon.material = Cesium.Color.fromCssColorString(colorScale(waterDept).hex()); // 使用随机颜色和半透明度以简化样式
			entity.polygon.outline = false; // 关闭轮廓以减少绘制复杂性
			// if (Cesium.defined(entity.polygon)) {
			// }
		}

		// 将数据源添加到viewer
		await viewer.dataSources.add(dataSource);
	}

	console.timeEnd("load geojson");

	// ymdataSource = dataSource;
}

const entities: Cesium.Entity[] = [];
// 定义一个函数来加载GeoJSON数据
async function loadGeoJsonDataPlus(url: string) {
	// 使用fetch获取GeoJSON数据
	const response = await fetch(url);
	const geojsonData = await response.json();
	let { features } = geojsonData;

	appendId(geojsonData);

	const oldEntities = entities.slice();

	entities.length = 0;

	// 遍历GeoJSON数据中的每个feature
	features.forEach((feature) => {
		// 获取面的坐标
		const coordinates = feature.geometry.coordinates.map((ring) => {
			return ring.map((coord) => {
				const [x, y] = proj4(sourceProj, targetProj, coord);
				return Cesium.Cartesian3.fromDegrees(x, y);
			});
		});

		const waterDept = feature.properties["WATER DEPT"] as number;

		// 定义颜色
		const color = colorScale(waterDept).hex();
		// const cesiumColor = Cesium.Color.fromCssColorString(color);
		// const appearance = new MaterialAppearance({
		// 	material: new FlowMaterial({ color })
		// });
		const entity = new Cesium.Entity({
			polygon: {
				hierarchy: new Cesium.PolygonHierarchy(coordinates[0]), // 假设每个面只有一个外部环
				// material: cesiumColor,
				perPositionHeight: true, // 使用每个位置的高度
				outline: false // 关闭轮廓以减少绘制复杂性
			},
			properties: Object.assign(feature.properties, { color })
		});

		// 使用viewer.entities.add添加每个面

		// entity.polygon!.material = new FlowMaterial({ color: cesiumColor });
		entities.push(entity);
	});

	const { addArray, removeArray, updateArray } = diffEntities(oldEntities, entities);

	// 移除removeArray中的实体
	removeArray.forEach((entity) => {
		viewer.entities.remove(entity);
	});
	// 增加addArray中的实体
	addArray.forEach((entity) => {
		const color = Cesium.Color.fromCssColorString(entity.properties!.getValue().color);
		// (entity.polygon as any).material = new CustomColorMaterialProperty(color);
		(entity.polygon as any).material = new FlowMaterial({ color });
		// (entity.polygon as any).material = color;
		(entity.polygon as any).outline = false;
		viewer.entities.add(entity);
	});
	// 更新updateArray中的实体
	updateArray.forEach((entity) => {
		(entity.polygon as any).material == entity.properties!.getValue(Cesium.JulianDate.now()).color;
	});
}

// 定义一个函数来加载GeoJSON数据
async function loadGeoJsonDataScheduler(url: string) {
	// 使用fetch获取GeoJSON数据
	const response = await fetch(url);
	const geojsonData = await response.json();

	// 获取所有features
	const features = geojsonData.features;

	const len = features.length;
	let currentIndex = 0,
		currentTime = 0;

	function workLoop(initialTime: number) {
		while (currentIndex < len) {
			if (initialTime - currentTime < 1) {
				return true;
			}
			currentTime = initialTime;
			// 获取当前要处理的feature
			const feature = features[currentIndex++];
			// 获取面的坐标
			const coordinates = feature.geometry.coordinates.map((ring) => {
				return ring.map((coord) => Cesium.Cartesian3.fromDegrees(coord[0], coord[1]));
			});
			const waterDept = feature.properties["WATER_DEPT"] as number;

			// 定义颜色
			const color = colorScale(waterDept).hex();
			const cesiumColor = Cesium.Color.fromCssColorString(color);

			// 使用viewer.entities.add添加每个面
			viewer.entities.add({
				polygon: {
					hierarchy: new Cesium.PolygonHierarchy(coordinates[0]), // 假设每个面只有一个外部环
					material: cesiumColor
				}
			});
		}
		return false;
	}

	requestHostCallback(workLoop);
}

async function loadGeoJsonData3Dtiles(url: string) {
	const tileset = await Cesium.Cesium3DTileset.fromUrl("/geojson_tilesets/tileset.json");
	tileset.style = new Cesium.Cesium3DTileStyle({
		color: "color('blue')"
	});

	viewer.scene.primitives.add(tileset);
	// tileset.readyPromise.then(function (tileset) {
	// 	viewer.zoomTo(tileset);
	// });
}

async function loadRiverInner(url: string) {
	// 使用fetch获取GeoJSON数据
	const response = await fetch(url);
	const geojsonData = await response.json();

	// 使用GeoJsonDataSource加载转换后的数据
	const dataSource = await Cesium.GeoJsonDataSource.load(geojsonData, {
		clampToGround: true // 如果需要网格贴地
	});

	// 获取所有实体
	const entities = dataSource.entities.values;

	// 为每个实体设置样式，简化样式以提高性能
	for (let i = 0; i < entities.length; i++) {
		let entity: any = entities[i];
		entity.polygon.material = Cesium.Color.BLUE; // 使用随机颜色和半透明度以简化样式
		entity.polygon.outline = false; // 关闭轮廓以减少绘制复杂性
	}

	// 将数据源添加到viewer
	await viewer.dataSources.add(dataSource);
}

function load() {
	loadGeoJsonDataPlus("/geojson/e0_noms.json");
}

let count = 0;
let INTERVAL = 1000;
let timer: number | null = null;
const isPlaying = ref(false);

function run() {
	if (count > 10) count = 0;
	// loadGeoJsonDataPlus(`/geojson/e1_noms.json`);
	loadGeoJsonDataPlus(`/geojson/e${count++}_noms.json`).then(() => {
		// 删除oldDataSource
		// viewer.dataSources.remove(oldDataSource);
		timer = window.setTimeout(run, INTERVAL);
	});
}

function start() {
	if (isPlaying.value) {
		timer && clearTimeout(timer);
	} else {
		run();
	}
	isPlaying.value = !isPlaying.value;
}

onMounted(async () => {
	viewer = initCesium();
});
</script>

<style lang="scss" scoped></style>
