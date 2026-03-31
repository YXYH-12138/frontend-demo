import * as echarts from "echarts/core";
import {
  BarChart,
  BarSeriesOption,
  PictorialBarSeriesOption,
  LineChart,
  LinesChart,
  LineSeriesOption,
  PieChart,
  PieSeriesOption,
  ScatterChart,
  ScatterSeriesOption,
  MapSeriesOption,
  RadarChart,
  RadarSeriesOption,
  ParallelSeriesOption,
  PictorialBarChart,
  BoxplotChart,
  BoxplotSeriesOption,
} from "echarts/charts";
import {
  TitleComponent,
  GridComponent,
  TooltipComponent,
  ToolboxComponent,
  DataZoomComponent,
  LegendComponent,
  DatasetComponent,
  MarkLineComponent,
  MarkAreaComponent,
  MarkPointComponent,
  BrushComponent,
  GeoComponent,

  // 组件类型的定义后缀都为 ComponentOption
  TitleComponentOption,
  MarkPointComponentOption,
  DataZoomComponentOption,
  MarkLineComponentOption,
  MarkAreaComponentOption,
  GridComponentOption,
  TooltipComponentOption,
  LegendComponentOption,
  DatasetComponentOption,
  RadarComponent,
  RadarComponentOption,
  TransformComponent,
} from "echarts/components";
import { CanvasRenderer } from "echarts/renderers";
// import "echarts-liquidfill";

// 通过 ComposeOption 来组合出一个只有必须组件和图表的 Option 类型
export type ECOption = echarts.ComposeOption<
  | BarSeriesOption
  | RadarSeriesOption
  | RadarComponentOption
  | MarkPointComponentOption
  | PictorialBarSeriesOption
  | LineSeriesOption
  | TitleComponentOption
  | GridComponentOption
  | TooltipComponentOption
  | DataZoomComponentOption
  | LegendComponentOption
  | PieSeriesOption
  | ScatterSeriesOption
  | DatasetComponentOption
  | MarkLineComponentOption
  | MarkAreaComponentOption
  | MapSeriesOption
  | ParallelSeriesOption
  | BoxplotSeriesOption
>;

// 注册必须的组件
echarts.use([
  PictorialBarChart,
  RadarChart,
  RadarComponent,
  ScatterChart,
  TitleComponent,
  MarkPointComponent,
  DataZoomComponent,
  LegendComponent,
  TooltipComponent,
  ToolboxComponent,
  DatasetComponent,
  GeoComponent,
  GridComponent,
  BrushComponent,
  LineChart,
  LinesChart,
  BarChart,
  PieChart,
  CanvasRenderer,
  MarkLineComponent,
  MarkAreaComponent,
  BoxplotChart,
  TransformComponent,
]);
