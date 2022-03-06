<template>
  <div class="home-page">
    <LMap :options="MAP_OPTIONS">
      <LTileLayer :url="tileLayerUrl" :options="options" />
      <!-- <LTileLayer :url="BASE_NORMAL">
        <LBoundaryCanvas :boundary="eastData" />
      </LTileLayer> -->
      <!-- <LWmsTileLayer
        url="http://121.40.117.96:9090/geoserver/gwc/service/wms"
        layers="dtx:east_watershed"
      /> -->
      <LMarker :lat-lng="[30.34161, 119.82]" :visible="layerVisible.DD">
        <LIcon :icon-url="ppImg" :icon-size="[20, 20]">
          <div class="rain-station"></div>
        </LIcon>
        <LToolTip content="123" />
      </LMarker>
      <LFly :lat-lng="active" :highlight="{ color: 'red' }" :fly-zoom="12">
        <LFlyItem name="dd"> </LFlyItem>
        <LFlyItem name="rr">
          <LLayerGroup :visible="layerVisible.RR">
            <LMarker :lat-lng="[item.lttd, item.lgtd]" v-for="item in mockData" :key="item.stnm">
              <LIcon :icon-url="rrImg" :icon-size="[20, 20]" />
              <LPopup>{{ item.stnm }}</LPopup>
              <LToolTip permanent :offset="[0, -8]">
                <div class="tooltip-rr-demo">{{ item.stnm }}</div>
              </LToolTip>
            </LMarker>
          </LLayerGroup>
        </LFlyItem>
      </LFly>
    </LMap>
    <el-card class="checkbox">
      <el-checkbox v-model="layerVisible.DD" label="雨量"></el-checkbox>
      <el-checkbox v-model="layerVisible.RR" label="水库"></el-checkbox>
      <ul class="station-list">
        <li v-for="item in mockData" :key="item.stnm" @click="flyTo(item)">
          {{ item.stnm }}
        </li>
        <li @click="active = [30.34161, 119.82]">rain</li>
      </ul>
    </el-card>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref } from "vue";
import { MAP_OPTIONS, TIANDITU_URL } from "./constant";
import {
  LMap,
  LTileLayer,
  LBoundaryCanvas,
  LWmsTileLayer,
  LToolTip,
  LPopup,
  LFly,
  LIcon,
  LMarker,
  LLayerGroup,
  LFlyItem
} from "@/components/L";
// mock
import ppImg from "@/assets/img/雨量站.png";
import rrImg from "@/assets/img/水库.png";
import eastData from "@/assets/gis/east_watershed.json";
import staions from "@/assets/gis/staion.json";

const mockData = staions.slice(0, 10);

const tileLayerUrl = ref(TIANDITU_URL);
const options = {
  subdomains: ["0", "1", "2", "3", "4", "5", "6", "7"],
  key: "63d6e02a1601f2ffa4e5979ce5613371"
};

const active = ref();
// 激活的底图
const baseActive = ref("Terrain");
// 图层
const layerVisible = reactive({
  RR: true,
  DD: true
});

const flyTo = (data: Record<string, any>) => {
  active.value = [data.lttd, data.lgtd];
};
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
