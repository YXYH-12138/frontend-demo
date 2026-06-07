<template>
	<VInput v-model="value" @input="handleChange" type="password" show-password>
		<template #password-icon="{ visible }">
			<!-- <el-icon><Search /></el-icon> -->
			<el-icon><Search v-if="visible" /><View v-else /></el-icon>
		</template>
	</VInput>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { Search, View } from "@element-plus/icons-vue";
import VInput from "./VInput.vue";

const value = ref("");

function handleChange(val: string) {
	console.log(val);
}
</script>

<style lang="scss" scoped></style>
