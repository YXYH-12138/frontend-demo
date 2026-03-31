<template>
  <HView />
  <JsxView />
  <el-button type="primary" @click="changeData">改变数据</el-button>
  <div w-full h-800>
    <map.MapComponent />
  </div>
</template>

<script lang="ts" setup>
import { HView, JsxView } from "./test";
import { HomeMap, useMarker } from "./map";

const map = new HomeMap();
const { changeData } = useMarker(map);
</script>

<style lang="scss" scoped></style>
