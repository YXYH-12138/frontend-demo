<template>
  <div class="evaluate-page">
    <div id="evaluate-map"></div>
  </div>
</template>

<script>
import flvjs from "flv.js";
export default {
  name: "Map-地图",
  data() {
    return {
      map: null,
      marker: null,
      load: false,
      headerList: [
        { title: "水源地", icon: "icon-shuiyuandi" },
        { title: "水资源", icon: "icon-huabanfuben" },
      ],
      player: null,
      markerInfo: [
        {
          img: require("@/assets/img/map-marker-main.png"),
          text: "重要饮水水源地",
          count: 0,
        },
        {
          img: require("@/assets/img/map-marker-water.png"),
          text: "农饮水水源地",
          count: 0,
        },
        {
          img: require("@/assets/img/map-marker-other.png"),
          text: "其他饮用水水源地",
          count: 0,
        },
      ],
      group: {},
    };
  },
  methods: {
    initMap() {
      const detail = this.$L.tileLayer.wms(
        "http://121.40.117.96:9090/geoserver/hunan/wms",
        {
          layers: "hunangroup",
          format: "image/png",
          transparent: true,
        }
      );
      const map = this.$L.map("evaluate-map", {
        zoom: 8,
        minZoom: 6,
        maxZoom: 16,
        center: [27.658, 112.19],
        zoomControl: false,
        attributionControl: false,
        layers: [detail],
      });
      this.map = map;
    },
    getIcon(text) {
      let cur = this.markerInfo.find((item) => item.text === text);
      cur.count++;
      return this.$L.icon({
        iconUrl: cur.img,
        iconSize: [28, 32],
        iconAnchor: [12, 36],
        popupAnchor: [-3, -76],
      });
    },
    createMarker(data) {
      const coordinates = data.map((item) => [item.latitude, item.longitude]);
      if (!coordinates.length) return;
      const group = {};
      coordinates.forEach((item, index) => {
        const text = data[index].text;
        if (!text) return;
        const marker = this.$L.marker([item[0], item[1]], {
          icon: this.getIcon(text),
        });
        (group[text] || (group[text] = [])).push(marker);
        const content =
          '<video width="280px" height="140px" class="player"  controls></video>';
        marker.bindPopup(content, {
          offset: this.$L.point(5, 50),
        });
        marker.on("popupopen", () => {
          if (flvjs.isSupported()) {
            let video = document.querySelector(".player");
            if (video) {
              this.player = flvjs.createPlayer({
                type: "flv",
                isLive: true,
                url: `ws://121.40.117.96:6100/rtsp`,
              });
              this.player.attachMediaElement(video);
              this.player.load();
              this.player.play();
            }
          }
        });
      });
      this.addLayerGroup(group);
    },
    addLayerGroup(group) {
      const obj = {};
      for (const key in group) {
        const layerGroup = this.$L.layerGroup(group[key]).addTo(this.map);
        obj[key] = layerGroup;
      }
      this.group = obj;
    },
  },
  mounted() {
    this.initMap();
    this.createMarker([
      {
        latitude: 28.23,
        longitude: 112.93,
        text: "重要饮水水源地",
      },
    ]);
  },
  beforeDestroy() {
    this.player.destory();
  },
};
</script>

<style lang="less" scoped>
.player {
  width: 100%;
}
#evaluate-map {
  flex: 1;
  z-index: 1;
}
.evaluate-page {
  height: 100%;
  display: flex;
  .wrap {
    height: 100%;
    display: flex;
    flex-direction: column;
  }
  .center {
    padding: 20px 10px 10px;
    background-color: rgb(248, 249, 251);
    & > *:nth-child(n + 2) {
      margin-top: 10px !important;
    }
    .statistical-result {
      font-size: 16px;
      padding: 0 10px;
      ul > li {
        margin-top: 5px;
      }
      .city {
        color: red;
      }
    }
    border-bottom: 10px solid rgb(232, 239, 245);
  }
}
</style>