<template>
	<map.MapComponent />
	<div class="position-absolute top-10 right-40"></div>
</template>

<script lang="ts" setup>
import { HomeMap, useMarker } from "./map";
// import Projection from "ol/proj/Projection";

const map = new HomeMap();

// useSection(map);
useMarker(map);
</script>

<style lang="scss" scoped>
.map {
	width: 100%;
	height: 100%;
}
</style>
