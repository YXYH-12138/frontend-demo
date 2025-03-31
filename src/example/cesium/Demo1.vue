<template>
	<div class="w100% h100%" ref="elRef"></div>
	<el-button class="position-absolute top-10 left-10" type="primary" @click="getCesiumInfo">
		获取信息
	</el-button>
	<el-button class="position-absolute top-10 left-100" type="primary" @click="changeStyle">
		changeStyle
	</el-button>
</template>

<script lang="ts" setup>
import { ref, onMounted, shallowRef } from "vue";
import * as Cesium from "cesium";
import { JS_MAP_URL, MAP_WMS_URL, TIAN_IMG_W, TIAN_TK } from "@/constants";
import { bbox } from "@turf/turf";
import tyPng from "@/assets/img/ty.png";

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
	const destination = Cesium.Cartesian3.fromDegrees(122.4341, 37.5233, 680000);
	// 设置home button的默认位置
	viewer.homeButton.viewModel.command.beforeExecute.addEventListener(function (e) {
		e.cancel = true;
		viewer.camera.flyTo({ destination, orientation, duration: 0.5 });
	});
	// 最小缩放高度（米）
	viewer.scene.screenSpaceCameraController.minimumZoomDistance = 200;
	// 最大缩放高度（米）
	viewer.scene.screenSpaceCameraController.maximumZoomDistance = 780000;
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

/** 加载基础图层 */
function loadBaseLayer() {
	// 创建 WMS 图层
	const wmsLayer = new Cesium.WebMapServiceImageryProvider({
		url: MAP_WMS_URL,
		layers: "liaoning:辽宁省界wgs",
		parameters: {
			transparent: true,
			format: "image/png"
		}
	});
	viewer.imageryLayers.addImageryProvider(wmsLayer);
	// xyz	瓦片服务
	const imageryProvider = new Cesium.UrlTemplateImageryProvider({
		url: `${JS_MAP_URL}/iserver/services/map-HeLiuErWei/rest/maps/3W_HL/zxyTileImage.png?z={z}&x={x}&y={y}&transparent=true`
	});
	viewer.imageryLayers.addImageryProvider(imageryProvider);
}

async function addMask() {
	const response = await fetch("/geojson/浑河边界.json");
	const data = await response.json();
	const feature = data.features[0];
	// 中国边界
	const extent = { xmin: 73.0, xmax: 136.0, ymin: 3.0, ymax: 59.0 };
	const geojson = {
		type: "Feature",
		geometry: {
			type: "MultiPolygon",
			coordinates: [
				[
					[
						[extent.xmin, extent.ymin],
						[extent.xmax, extent.ymin],
						[extent.xmax, extent.ymax],
						[extent.xmin, extent.ymax],
						[extent.xmin, extent.ymin]
					],
					feature.geometry.coordinates[0]
				]
			]
		}
	};
	const mask = await Cesium.GeoJsonDataSource.load(geojson, {
		stroke: Cesium.Color.fromCssColorString("white").withAlpha(0.4),
		fill: Cesium.Color.fromCssColorString("white").withAlpha(0.4),
		strokeWidth: 10,
		clampToGround: true
	});
	// viewer.dataSources.add(mask);

	const bounary = await Cesium.GeoJsonDataSource.load(data, {
		stroke: Cesium.Color.fromCssColorString("#f0c435"),
		fill: Cesium.Color.fromCssColorString("#f0c435").withAlpha(0),
		strokeWidth: 4,
		clampToGround: true
	});
	viewer.dataSources.add(bounary);
	flyTo(bounary);
}

function flyTo(data: Cesium.GeoJsonDataSource) {
	// const box = bbox(data);
	// // 定义区域坐标
	// const southwest = Cesium.Cartographic.fromDegrees(box[0], box[1]);
	// const northeast = Cesium.Cartographic.fromDegrees(box[2], box[3]);
	// // 将区域坐标转换为矩形
	// const rectangle = Cesium.Rectangle.fromCartographicArray([southwest, northeast]);

	// const loactionTectEntity = new Cesium.Entity({
	// 	rectangle: {
	// 		coordinates: rectangle,
	// 		material: Cesium.Color.GREEN.withAlpha(1.0),
	// 		height: 10.0,
	// 		outline: false
	// 	}
	// });

	viewer.flyTo(data, {
		duration: 0.5,
		offset: new Cesium.HeadingPitchRange(orientation.heading, orientation.pitch)
	});
}

let geoJsonDataSource: Cesium.GeoJsonDataSource;
let count = 0;
// 加载GeoJSON数据
async function loadGeoJson(url: string) {
	const response = await fetch(url);
	const geoJsonData = await response.json();

	// 创建GeoJsonDataSource实例
	geoJsonDataSource = new Cesium.GeoJsonDataSource();
	// 将GeoJSON数据加载到地图上
	await geoJsonDataSource.load(geoJsonData, { stroke: Cesium.Color.BLUE });
	// 添加数据源到Viewer
	viewer.dataSources.add(geoJsonDataSource);

	// for (const item of geoJsonData.features) {
	// 	// 创建GeoJsonDataSource实例
	// 	const geoJsonDataSource = new Cesium.GeoJsonDataSource();
	// 	// 将GeoJSON数据加载到地图上
	// 	await geoJsonDataSource.load(item, { stroke: Cesium.Color.BLUE });
	// 	// 添加数据源到Viewer
	// 	viewer.dataSources.add(geoJsonDataSource);
	// }
}
function changeStyle() {
	count++;
	// 获取GeoJSON数据中的所有实体
	const entities = geoJsonDataSource.entities.values;
	for (const entity of entities) {
		// 获取属性
		// console.log(entity.properties!.getValue());
		(entity.polyline as any).material! = count % 2 == 0 ? Cesium.Color.BLUE : Cesium.Color.RED;
	}
}

function addClickEvent(viewer: Cesium.Viewer) {
	// 添加点击事件
	const handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);

	handler.setInputAction(function (movement) {
		// 获取点击位置的鼠标屏幕坐标
		const mousePosition = movement.position;

		// 将屏幕坐标转换为世界坐标
		const pickedRay = viewer.camera.getPickRay(mousePosition);
		const pickedPosition = viewer.scene.pick(pickedRay as any);

		// 检查是否点击到了地球表面
		if (Cesium.defined(pickedPosition)) {
			const pickedCartographic = Cesium.Cartographic.fromCartesian(pickedPosition);
			const longitude = Cesium.Math.toDegrees(pickedCartographic.longitude);
			const latitude = Cesium.Math.toDegrees(pickedCartographic.latitude);

			// 获取相机当前的方位信息
			const heading = viewer.camera.heading; // 方位角，单位为弧度
			const pitch = viewer.camera.pitch; // 俯仰角，单位为弧度
			const roll = viewer.camera.roll; // 滚转角，单位为弧度

			// 输出点击的经纬度和方位信息
			console.log("Clicked position: Longitude: " + longitude + ", Latitude: " + latitude);
			console.log("Camera heading: " + Cesium.Math.toDegrees(heading) + " degrees");
			console.log("Camera pitch: " + Cesium.Math.toDegrees(pitch) + " degrees");
			console.log("Camera roll: " + Cesium.Math.toDegrees(roll) + " degrees");
		} else {
			console.log("No ground picked");
		}
	}, Cesium.ScreenSpaceEventType.LEFT_CLICK);
}

function getCesiumInfo() {
	// 获取当前相机的当前位置
	const position = viewer.camera.positionCartographic;
	// 获取相机当前的方位信息
	const heading = viewer.camera.heading; // 方位角，单位为弧度
	const pitch = viewer.camera.pitch; // 俯仰角，单位为弧度
	const roll = viewer.camera.roll; // 滚转角，单位为弧度

	// 输出点击的经纬度和方位信息
	// 提取经度、纬度和高度
	const longitude = Cesium.Math.toDegrees(position.longitude);
	const latitude = Cesium.Math.toDegrees(position.latitude);
	const altitude = position.height;
	// 输出当前的 destination
	console.log(
		"Current destination: Longitude: " +
			longitude +
			", Latitude: " +
			latitude +
			", Altitude: " +
			altitude
	);
	console.log("Camera heading: " + Cesium.Math.toDegrees(heading) + " degrees");
	console.log("Camera pitch: " + Cesium.Math.toDegrees(pitch) + " degrees");
	console.log("Camera roll: " + Cesium.Math.toDegrees(roll) + " degrees");
}

onMounted(() => {
	viewer = initCesium();
	// addMask();
	// loadBaseLayer();
	// 调用加载函数，传入GeoJSON文件的URL
	loadGeoJson("/geojson/浑河河流.json");
	// addClickEvent(viewer);
});
</script>

<style lang="scss" scoped></style>
