<template>
  <div w-800 h400>
    <v-echarts :option="lineOption" ref="lineChartRef" />
  </div>
  <div w-800 h400>
    <v-echarts :option="barOption" ref="barChartRef" />
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from "vue";
import {
  LineChartDragable,
  NormalChartDragable,
  SetOptionParam,
} from "@/utils/dragable";
import VEcharts from "@/components/VEcharts/index.vue";
import type { ECOption } from "@/plugins";

const chartData = [
  { type: "mon", value: 150 },
  { type: "tue", value: 230 },
  { type: "wed", value: 224 },
  { type: "thu", value: 218 },
  { type: "fri", value: 135 },
  { type: "sat", value: 147 },
  { type: "sun", value: 260 },
];
const lineOption: ECOption = {
  xAxis: {
    type: "category",
  },
  yAxis: {
    type: "value",
  },
  series: [
    {
      id: "a",
      name: "a",
      data: chartData.map((item) => [item.type, item.value]),
      type: "line",
    },
  ],
};

const barOption: ECOption = {
  xAxis: {
    type: "category",
  },
  yAxis: {
    type: "value",
  },
  series: [
    {
      id: "a",
      animation: false,
      data: chartData.map((item) => [item.type, item.value]),
      type: "bar",
    },
  ],
};

const lineChartRef = ref<InstanceType<typeof VEcharts>>(null);

const chartDragable = new LineChartDragable(() => lineChartRef.value!.chart, {
  finder: { xAxisIndex: 0, yAxisIndex: 0 },
  setOption,
});

function setOption({ chart, data }: SetOptionParam) {
  const [index, newVal] = data;
  // 边界判断
  if (index < 0 || index >= chartData.length) {
    return;
  }
  chartData[index].value = newVal;
  chart.setOption({
    series: {
      id: "a",
      data: chartData.map((item) => [item.type, item.value]),
    },
  });
}

const barChartRef = ref<InstanceType<typeof VEcharts>>(null);

const barChartDragable = new NormalChartDragable(
  () => barChartRef.value!.chart,
  {
    finder: { xAxisIndex: 0, yAxisIndex: 0 },
    setOption,
  },
);

onMounted(() => {
  chartDragable.startDrag();
  barChartDragable.startDrag();
});
</script>

<style lang="scss" scoped></style>
