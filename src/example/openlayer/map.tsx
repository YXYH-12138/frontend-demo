import Feature from "ol/Feature";
import { Fill, Icon, Stroke, Style, Text } from "ol/style";
import { LineString, Point } from "ol/geom";
import { Tile, Vector } from "ol/layer";
import { Translate } from "ol/interaction";
import { onMounted } from "vue";
import { XYZ, Vector as VectorSource } from "ol/source";
import { transform3857 } from "@/utils";
import secitonJson from "@/assets/gis/section.json";
import { OlMapVue } from "@/utils/ol/map";
import rrImg from "@/assets/img/水库.png";
import ImageLayer from "ol/layer/Image";
import { getTifSource } from "./tif";
import { TIAN_VEW_W } from "@/constants";

export class HomeMap extends OlMapVue {
	sectionLayer?: Vector<Feature<LineString>>;

	constructor() {
		super({
			layers: [new Tile({ source: new XYZ({ url: TIAN_VEW_W }) })]
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
