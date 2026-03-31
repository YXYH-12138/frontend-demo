import Feature from "ol/Feature";
import { Icon, Style, Text } from "ol/style";
import { Point } from "ol/geom";
import { Vector } from "ol/layer";
import { onBeforeUnmount, onMounted, ref } from "vue";
import { XYZ, Vector as VectorSource } from "ol/source";
import { transform3857 } from "@/utils";
import { createView, OlMapVue } from "@/utils/ol/map";
import rrImg from "@/assets/img/水库.png";
import { TIAN_VEW_W } from "@/constants";
import { fromLonLat } from "ol/proj";
import proj4 from "proj4";
import { register } from "ol/proj/proj4";
import TileLayer from "ol/layer/Tile";
import { useTooltip } from "./tooltip";

proj4.defs("EPSG:4490", "+proj=longlat +datum=CGCS2000 +no_defs");
register(proj4);

export class HomeMap extends OlMapVue {
  constructor() {
    super({
      baseLayers: {
        vew_w: new TileLayer({
          source: new XYZ({ url: TIAN_VEW_W }),
          zIndex: -1,
        }),
      },
      view: createView({ zoom: 8.4, center: fromLonLat([125.24, 41.8]) }),

      layers: [],
    });

    this.changeBaseLayer("vew_w");
  }
}

export function useMarker(map: HomeMap) {
  const markerFeatures: Feature[] = [];
  const { initPopup, initPopupTitle, dispose } = useTooltip(
    map,
    markerFeatures,
  );

  const data = [
    {
      lgtd: 125.132499,
      lttd: 41.952222,
      time: "2026-01-26 08:00",
      h: 163,
      q: 100,
      stcd: "21103200",
      stnm: "后楼水库",
    },
    {
      lgtd: 125.22,
      lttd: 42,
      time: "2026-01-26 08:00",
      h: 163,
      q: 100,
      stcd: "21103201",
      stnm: "红河水库",
    },
  ];

  const refData = ref(data);

  function initMarker(map: HomeMap) {
    markerFeatures.length = 0;

    refData.value.forEach((row) => {
      // 创建一个样式来定义marker的外观
      const iconStyle = new Style({
        image: new Icon({
          size: [22, 22],
          scale: 0.8,
          // anchor: [0.5, 1],
          src: rrImg,
        }),
        text: new Text({ text: row.stnm }),
      });
      // 创建一个feature，并将marker添加到这个feature中
      const markerFeature = new Feature({
        geometry: new Point(transform3857([+row.lgtd, +row.lttd])),
        station: row,
      });
      markerFeature.setStyle(iconStyle);
      markerFeatures.push(markerFeature);

      initPopup(markerFeature);
    });

    // 创建一个VectorLayer来存放marker
    const markerLayer = new Vector({
      source: new VectorSource({ features: markerFeatures }),
    });

    // 将feature添加到图层中
    // markerLayer.getSource().addFeature(markerFeature);

    // 创建一个地图并将marker图层添加到地图中
    map.addLayer(markerLayer);

    initPopupTitle();
  }

  function changeData() {
    refData.value[0].q = 8888;
  }

  onBeforeUnmount(() => {
    dispose();
  });

  onMounted(() => {
    initMarker(map);
  });

  return { changeData };
}
