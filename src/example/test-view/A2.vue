<template>
	<img :src="dataURL" class="w200 h200" />
</template>

<script lang="ts" setup>
import geojson2svg from "geojson-to-svg";
import geojsonData from "./sy.json";
import { ref } from "vue";

const styleMap = { 沈阳市: { fill: "#e5f2c8" } };

const svgString = geojson2svg()
	.styles((feature) => {
		return styleMap[feature.properties.name];
	})
	.data(geojsonData)
	.render();

// 将SVG字符串编码为Base64
const base64String = window.btoa(svgString);

const dataURL = ref("");
// 如果你需要在URL中使用这个Base64编码的SVG，你需要进行一些额外的处理：
// 将Base64字符串转换为Data URL
dataURL.value = `data:image/svg+xml;base64,${base64String}`;
</script>
