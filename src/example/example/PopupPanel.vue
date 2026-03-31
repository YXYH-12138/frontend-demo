<template>
  <div class="popup-pane">
    <div class="font-600">{{ row.stnm }}</div>
    <div
      pt8
      flex
      flex-col
      gap-2
      :style="{ color: row.q > 6000 ? 'green' : 'inherit' }"
    >
      <span>时间：{{ row.time }}</span>
      <span>水位：{{ row.h }}m</span>
      <span>流量：{{ row.q }}m³/s</span>
    </div>
    <!-- <el-button type="primary" @click="handleClick">详情</el-button> -->
  </div>
</template>

<script lang="ts" setup>
import { ElMessage } from "element-plus";

defineProps<{ row: any }>();

function handleClick() {
  ElMessage.success("详情");
}
</script>

<style lang="scss" scoped></style>
