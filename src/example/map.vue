<template>
  <div class="evaluate-page">
    <!-- 外层组件，会向子组件注入map对象 -->
    <Layer :config="mapConfig">
      <!-- 底图 -->
      <BaseMap
        type="wms"
        url="http://121.40.117.96:9090/geoserver/hunan/wms"
        :config="{
          layers: 'hunangroup',
          format: 'image/png',
          transparent: true,
        }"
      />
      <!-- 标注 -->
      <LayerMarker
        @popupopen="popupopen"
        :marker="[28.23, 112.93]"
        :icon="getIcon"
        content="<video width='280px' height='140px' class='player' controls></video>"
        :popupOptions="{ offset: [0, -8] }"
      />
      <!-- 标注 -->
      <LayerMarker :marker="[28.03, 113.22]" :icon="getIcon" />
    </Layer>
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
      mapConfig: {
        zoom: 8,
        minZoom: 6,
        maxZoom: 16,
        center: [27.658, 112.19],
        zoomControl: false,
        attributionControl: false,
      },
      markerData: [28.23, 112.93],
    };
  },
  methods: {
    getIcon(icon) {
      return icon({
        iconUrl: require("@/assets/img/map-marker-main.png"),
        iconSize: [28, 32],
      });
    },
    popupopen() {
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
    },
    createMarker() {
      // const coordinates = data.map((item) => [item.latitude, item.longitude]);
      // if (!coordinates.length) return;
      // const group = {};
      // coordinates.forEach((item, index) => {
      //   const text = data[index].text;
      //   if (!text) return;
      //   const marker = this.$L.marker([item[0], item[1]], {
      //     icon: this.getIcon(text),
      //   });
      //   (group[text] || (group[text] = [])).push(marker);
      // });
      // this.addLayerGroup(group);
    },
    addLayerGroup() {
      // const obj = {};
      // for (const key in group) {
      //   const layerGroup = this.$L.layerGroup(group[key]).addTo(this.map);
      //   obj[key] = layerGroup;
      // }
      // this.group = obj;
    },
  },
  beforeDestroy() {
    this.player && this.player.destory();
  },
};
</script>

<style lang="less" scoped>
.player {
  width: 100%;
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