<template>
  <div class="layer-container">
    <div id="sw-tile-layer"></div>
    <slot></slot>
  </div>
</template>

<script>
import mixins from "./mixins";
import * as L from "leaflet";

export default {
  name: "Layer",
  mixins: [mixins],
  props: {
    config: Object,
  },
  data() {
    return {
      layer: {
        map: null,
        $L: L,
      },
    };
  },
  provide() {
    return {
      layer: this.layer,
    };
  },
  mounted() {
    this.layer.map = L.map("sw-tile-layer", this.config);
    this.mixBindingEvent(this.layer.map);
  },
};
</script>

<style scoped>
.layer-container {
  width: 100%;
  height: 100%;
}
#sw-tile-layer {
  width: 100%;
  height: 100%;
}
</style>