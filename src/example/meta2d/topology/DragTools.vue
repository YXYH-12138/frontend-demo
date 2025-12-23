<template>
	<el-collapse v-model="activeName" class="tool-collapse">
		<el-collapse-item v-for="menu of menuList" :name="menu.type" :key="menu.type">
			<template #title>
				<span class="header-title">{{ menu.text }}</span>
			</template>
			<ul class="tools">
				<li
					v-for="item of menu.children"
					:key="item.type"
					draggable="true"
					@dragstart="onDragStart($event, item.data)"
					:title="item.text"
				>
					<i class="iconfont" :class="item.icon" v-if="item.icon"></i>
					<div class="flex-1 w100% flex justify-center items-center" v-else-if="item.svg">
						<SvgIcon style="width: 80%" :icon-name="item.svg" size="18px" />
					</div>
					<div v-else-if="item.image" class="flex-1 flex justify-center items-center">
						<img :src="item.image" width="20" height="20" />
					</div>
					<span>{{ item.text }}</span>
				</li>
			</ul>
		</el-collapse-item>
	</el-collapse>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { menuList } from "./data";

const activeName = ref(["station", "custom"]);

const onDragStart = (e: DragEvent, data: any) => {
	e.dataTransfer && e.dataTransfer.setData("meta2d", JSON.stringify(data));
};
</script>

<style lang="scss" scoped>
.header-title {
	padding-left: 20px;
	font-size: 16px;
}
.tool-collapse {
	width: 300px;
	border-right: 1px solid #ccc;
	overflow-y: auto;
}
.tools {
	width: 100%;
	display: grid;
	grid-template-columns: 1fr 1fr 1fr;
	grid-template-rows: 1fr 1fr 1fr;
	gap: 8px 8px;
	height: 100%;
	padding: 0 20px;
	box-sizing: border-box;
	&:last-child {
		grid-template-rows: 1fr 1fr;
	}
	& > li {
		display: flex;
		height: 52px;
		flex-direction: column;
		text-align: center;
		border: 1px solid #ccc;
	}
}
</style>
