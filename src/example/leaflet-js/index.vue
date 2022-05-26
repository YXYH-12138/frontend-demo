<template>
	<div class="box">
		<div id="map"></div>
		<!-- <el-card class="card-box">
			<el-checkbox v-model="layerVisible.ZZ" label="水文"></el-checkbox>
			<el-checkbox v-model="layerVisible.RR" label="水库"></el-checkbox>
			<ul class="station-list">
				<li v-for="item in staions" :key="item.stnm">
					{{ item.stnm }}
				</li>
			</ul>
		</el-card> -->
	</div>
</template>

<script lang="ts" setup>
import * as L from "leaflet";
import { onMounted } from "vue-demi";
import { MAP_OPTIONS, TianDiTu_Normal, TIANDITU_OPTIONS } from "./constant";

onMounted(() => {
	const map = L.map("map", MAP_OPTIONS);
	L.tileLayer(TianDiTu_Normal, TIANDITU_OPTIONS).addTo(map);
});
</script>

<style lang="scss" scoped>
.box {
	position: relative;
	height: 100%;
	#map {
		height: 100%;
	}
	.card-box {
		position: absolute;
		right: 50px;
		top: 50px;
		z-index: 999;
		.station-list {
			height: 400px;
			overflow-y: auto;
			li {
				cursor: pointer;
				height: 26px;
				line-height: 26px;
				&:hover {
					background-color: rgb(236, 159, 159);
				}
			}
		}
	}
}
</style>
