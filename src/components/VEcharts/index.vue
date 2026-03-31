<template>
  <div class="chart-box" style="width: 100%" ref="chartEl"></div>
</template>

<script lang="ts" setup>
import {
  onBeforeUnmount,
  onMounted,
  shallowRef,
  watch,
  watchEffect,
} from "vue";
// import { type AxisOptions, commonCalcInterval, download, LineChartDragable } from "@/utils";
// import { throttle, has, isBoolean, isFunction } from "lodash-es";
import * as echarts from "echarts/core";
import { toRefs, useResizeObserver } from "@vueuse/core";
import type { ECOption } from "@/plugins";

// interface SmartYAxisOption extends AxisOptions {
// 	// 图例切换是否触发y轴更新
// 	legend?: boolean;
// }

interface Props {
  option: ECOption;
  // 分组
  group?: string;
  // 图表在组件根元素尺寸变化时是否需要自动进行重绘。
  autoresize?: boolean;
  // 禁用右键
  disabledContextmenu?: boolean;
  // 主题
  theme?: string | Record<string, unknown>;
  // 图表更新的配置项
  updateOptions?: echarts.SetOptionOpts;
  // 是否手动执行setOption
  manual?: boolean;
  // loading
  loading?: boolean;
  // loading配置
  loadingOptions?: Record<string, any>;
  // 是否自动设置图表的Y轴 TODO:这里两个类型只会识别成boolean，先用any代替
  // smartYAxis?: SmartYAxisOption | boolean | any;
  // style
  height?: string | number;
  // 需要额外渲染的组件
  renderComponents?: any[];
}

const props = withDefaults(defineProps<Props>(), {
  smartYAxis: false,
  autoresize: true,
  disabledContextmenu: false,
  loading: false,
  height: "100%",
  loadingOptions: () => ({ text: "图表正在加载，请稍等~" }),
  renderComponents: () => [],
});

// const attrs = useAttrs();

const { autoresize, loading } = toRefs(props);

const chart = shallowRef<echarts.ECharts>();
const chartEl = shallowRef<HTMLElement | null>();

// const legendSelected = ref({} as any);
// const timelineCurrentIndex = ref(0);

const emits = defineEmits<{
  timelinechanged: [event: any];
  timelineplaychanged: [event: any];
}>();

// const getOption = (
//   smartYAxis: boolean | SmartYAxisOption,
// ): SmartYAxisOption => {
//   if (isBoolean(smartYAxis)) return { legend: true };
//   return smartYAxis;
// };
// const updateInterval = () => {
// 	const { smartYAxis } = props;
// 	if (smartYAxis) {
// 		commonCalcInterval({
// 			chartRef: { chart: chart.value! },
// 			useTheMax: true,
// 			axisOptions: isBoolean(smartYAxis) ? undefined : smartYAxis
// 		});
// 	}
// };

const setOption = (
  option = props.option,
  updateOptions = props.updateOptions,
) => {
  if (chart.value) {
    chart.value.setOption(option, updateOptions);
    // updateInterval();
  }
};

// const lineChartDrgable = new LineChartDragable(chart);

const mount = () => {
  const _chart = (chart.value = echarts.init(chartEl.value!, props.theme));
  // lineChartDrgable.startDrag();
  // lineChartDrgable.on("draging", throttle(updateInterval, 150));

  // _chart.on("legendselectchanged", (event: any) => {
  // 	getOption(props.smartYAxis).legend && updateInterval();
  // 	// 记录图例选中
  // 	legendSelected.value = { ...(event.selected || {}) };
  // });
  // _chart.on("datazoom", updateInterval);
  // _chart.on("timelinechanged", (event: any) => {
  // 	// 记录时间轴播放索引
  // 	timelineCurrentIndex.value = event.currentIndex || 0;
  // 	// 联动触发相应事件
  // 	emits("timelinechanged", event);
  // });
  _chart.on("timelineplaychanged", (event: any) => {
    // 联动触发相应事件
    emits("timelineplaychanged", event);
  });
  // 禁用默认图表的右键点击
  // oxlint-disable-next-line no-unused-expressions
  props.disabledContextmenu && (_chart.getDom().oncontextmenu = () => false);
  // oxlint-disable-next-line no-unused-expressions
  props.manual || watchEffect(() => setOption());
  watchEffect(() => {
    if (chart.value) {
      chart.value.group = props.group;
    }
  });
};

// 渲染额外的组件
function onRenderComponents() {
  const { renderComponents } = props;
  if (!renderComponents?.length) return;
  echarts.use(renderComponents);
}

// 自动监听元素变化改变图形
// oxlint-disable-next-line no-unused-expressions
autoresize.value &&
  useResizeObserver(chartEl, (entries) => {
    const entry = entries[0];
    const { width, height } = entry.contentRect;
    width && height && chart.value && chart.value.resize();
  });

onMounted(() => {
  onRenderComponents();
  mount();

  watch(
    loading,
    (val) => {
      const $chart = chart.value;
      if ($chart) {
        val ? $chart.showLoading(props.loadingOptions) : $chart.hideLoading();
      }
    },
    { immediate: true },
  );
});

onBeforeUnmount(() => {
  // lineChartDrgable.clear();
  chart.value && chart.value.dispose();
});

// 清空echarts
const clear = () => {
  chart.value && chart.value.clear();
};

// 暴露出去
defineExpose({
  chart,
  clear,
  setOption,
});
</script>

<style scoped>
.chart-box {
  width: 100%;
  height: v-bind(height);
  text-align: left;
}
</style>
