import Feature from "ol/Feature";
import { Fill, Icon, Stroke, Style, Text } from "ol/style";
import { LineString, Point } from "ol/geom";
import { Tile, Vector } from "ol/layer";
import { Translate } from "ol/interaction";
import { onMounted } from "vue";
import { XYZ, Vector as VectorSource, ImageTile } from "ol/source";
import { transform3857 } from "@/utils";
import secitonJson from "@/assets/gis/section.json";
import { MAP_CENTER, OlMapVue } from "@/utils/ol/map";
import rrImg from "@/assets/img/水库.png";
import { getTifSource } from "./tif";
import { TIAN_VEW_W } from "@/constants";
import TileArcGISRest from "ol/source/TileArcGISRest";
import { TileGrid } from "ol/tilegrid";
import { get as getProjection } from "ol/proj";
import proj4 from "proj4";
import { register } from "ol/proj/proj4";
import { getTopLeft } from "ol/extent";
import { View } from "ol";

proj4.defs("EPSG:4490", "+proj=longlat +datum=CGCS2000 +no_defs");
register(proj4);

const resolutions = [
	1.4078260157100582, 0.703125, 0.3515625, 0.17578125, 0.087890625, 0.0439453125, 0.02197265625,
	0.010986328125, 0.0054931640625, 0.00274658203125, 0.001373291015625, 6.866455078125e-4,
	3.4332275390625e-4, 1.71661376953125e-4, 8.58306884765625e-5, 4.291534423828125e-5,
	2.1457672119140625e-5, 1.0728836059570312e-5, 5.364418029785156e-6, 2.6822090143215496e-6
];

export class HomeMap extends OlMapVue {
	constructor() {
		// const projection = getProjection("EPSG:4490")!;
		// projection.setExtent([
		// 	118.30665226055264, 38.357821600000065, 126.31854674044753, 43.73441040000007
		// ]);
		// const projectionExtent = projection.getExtent();

		// console.log(projection);

		super({
			// view: new View({
			// 	center: MAP_CENTER,
			// 	projection: "EPSG:4490",
			// 	zoom: 7.6
			// 	// minZoom: 7.2
			// 	// constrainResolution: true
			// 	// maxZoom: 12
			// }),
			layers: [
				// new Tile({
				// 	source: new TileArcGISRest({
				// 		params: {
				// 			// TRANSPARENT: false,
				// 			// layers: "sheng:0" // 显示sheng图层(索引0)
				// 		},
				// 		// projection: "EPSG:4490", // 使用服务指定的空间参考
				// 		wrapX: false,
				// 		url: "http://172.24.2.74:6080/arcgis/rest/services/LNMap_VEC_2023_BaseMap/MapServer",
				// 		tileGrid: new TileGrid({
				// 			extent: [
				// 				118.30665226055264, 38.357821600000065, 126.31854674044753, 43.73441040000007
				// 			],
				// 			origin: [-180, -90, 180, 90], // 与服务的Origin一致
				// 			resolutions: [
				// 				1.4078260157100582, // Level 0
				// 				0.7031250000000001, // Level 1
				// 				0.35156250000000006, // Level 2
				// 				0.17578125000000122, // Level 3
				// 				0.08789062500000061, // Level 4
				// 				0.043945312500000305, // Level 5
				// 				0.021972656250000153, // Level 6
				// 				0.010986328125000076, // Level 7
				// 				0.005493164062498848, // Level 8
				// 				0.002746582031250614, // Level 9
				// 				0.001373291015625307, // Level 10
				// 				6.866455078114638e-4, // Level 11
				// 				3.433227539069216e-4, // Level 12
				// 				1.7166137695227108e-4, // Level 13
				// 				8.583068847732526e-5, // Level 14
				// 				4.291534423866263e-5, // Level 15
				// 				2.1457672119331316e-5, // Level 16
				// 				1.0728836059665658e-5, // Level 17
				// 				5.364418028643099e-6, // Level 18
				// 				2.6822090143215496e-6 // Level 19
				// 			]
				// 			// tileSize: [256, 256] // 与服务的Tile Info一致
				// 		})
				// 	})
				// })
				new Tile({
					zIndex: 9,
					source: new XYZ({
						projection: "EPSG:4490",
						url: "http://172.24.2.74:6080/arcgis/rest/services/LNMap_DOM_2023_2/MapServer/tile/{z}/{y}/{x}",
						tileGrid: new TileGrid({
							resolutions,
							// matrixIds: resolutions.map((_, i) => i.toString()),
							origin: [-180, 90]
						})
					})
				})
			]
			// layers: [new Tile({ source: new XYZ({ url: TIAN_VEW_W }) })]
		});
	}

	/**
	 * 初始化断面图层
	 * @param sectionData
	 * @param visible 是否显示断面名称
	 */
	initSectionLayer(sectionData: number[][], visible = false) {
		const features: Array<Feature<LineString>> = [];
		for (let i = 0; i < sectionData.length; i++) {
			const item = sectionData[i];
			const id = i + "";
			const feature = new Feature({
				geometry: new LineString([
					[item[0], item[1]],
					[item[2], item[3]]
				]).transform("EPSG:4326", "EPSG:3857"),
				index: id
			});
			feature.setStyle(this.createStyle(visible, id));
			features.push(feature);
		}
		if (!this.sectionLayer) {
			const source = new VectorSource({ features });
			const vector = new Vector({ source, zIndex: 100 });
			this.sectionLayer = vector;
			this.addLayer(vector);
		} else {
			const source = this.sectionLayer.getSource()!;
			source.clear();
			source.addFeatures(features);
		}
		sectionData.length &&
			this.getView().fit(this.sectionLayer.getSource()!.getExtent(), { padding: [40, 40, 40, 40] });
	}

	/**
	 * 设置断面文字是否可见
	 * @param visible
	 */
	setTextVisible(visible: boolean) {
		if (this.sectionLayer) {
			const features = this.sectionLayer.getSource()!.getFeatures();
			for (const feature of features) {
				const index = feature.get("index");
				feature.setStyle(this.createStyle(visible, index));
			}
		}
	}

	loadTif() {
		fetch("/tt.tif")
			.then((res) => res.arrayBuffer())
			.then((data) => getTifSource(data))
			.then((source) => {
				// const layer = new ImageLayer({ source });
				// this.addLayer(layer);
				// this.getView().fit(source.getImageExtent());
			});
	}

	private createStyle(visible: boolean, text: string) {
		return new Style({
			fill: new Fill({ color: "red" }),
			stroke: new Stroke({ color: "red", width: 2 }),
			text: new Text({
				text: text,
				font: visible ? "10px sans-serif" : "0px sans-serif",
				fill: new Fill({ color: "white" }),
				stroke: new Stroke({ color: "black", width: 3 })
			})
		});
	}
}

export function useSection(map: HomeMap) {
	onMounted(() => {
		// map.initSectionLayer(secitonJson, false);
		map.loadTif();
	});
}

export function useMarker(map: HomeMap) {
	function initMarker(map: HomeMap) {
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
				geometry: new Point(transform3857([+row.lgtd, +row.lttd])),
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
			const feature = map.forEachFeatureAtPixel(e.pixel, (feature) => feature);
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

	onMounted(() => {
		initMarker(map);
	});
}
