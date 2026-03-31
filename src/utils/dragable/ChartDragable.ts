import { isFunction, has } from "lodash-es";
import { type MaybeRefOrGetter, toValue } from "vue";
import { Evented } from "../Evented";
import type { EChartsType } from "echarts/core";
import type { OverrideProperties } from "type-fest";

type Events = {
  "*": any;
  dragstart: { params: any; seriesId: string };
  draging: SetOptionParam;
  dragend: void;
};

export type SetOptionParam = {
  chart: EChartsType;
  data: number[];
  seriesId: string;
  isDataset: boolean;
  params: any;
};

export interface ChartDragableOptions {
  // convertFromPixel函数的参数
  finder?: Record<string, any> | (() => Record<string, any>);
  /** 设置option的方法 */
  setOption?: (arg: SetOptionParam) => void;
}

type ChartRefObject = { chart: EChartsType };
export type ChartRef = ChartRefObject | EChartsType;

function resolveUnrefChart(chartRef: MaybeRefOrGetter<ChartRef | null>) {
  try {
    if (!chartRef) return null;
    const chart = toValue(chartRef);
    if (has(chart, "chart")) {
      return (chart as ChartRefObject).chart;
    }
    return chart as EChartsType;
  } catch {
    return null;
  }
}

/** 拖拽抽象类 */
export abstract class ChartDragable<
  Option = ChartDragableOptions,
  NewEvent extends Record<string, any> = Events,
> extends Evented<OverrideProperties<Events, NewEvent>> {
  // AHEcharts组件实例
  public chartRef: MaybeRefOrGetter<ChartRef | null>;

  // 鼠标按下的时的配置
  protected mouseDownParams: any;

  protected _chart: EChartsType | null;
  protected _seriesId?: string;
  protected _finder: () => Record<string, any>;
  protected _isDataset: boolean;

  public opts: Option;

  constructor(
    chartRef: MaybeRefOrGetter<ChartRef | null>,
    option: Option = {} as Option,
  ) {
    super();
    this._chart = null;
    this.chartRef = chartRef;
    const { finder } = option as ChartDragableOptions;
    const _finder = finder || (() => ({ xAxisIndex: 1, yAxisIndex: 1 }));
    this._finder = isFunction(_finder)
      ? (_finder as () => Record<string, any>)
      : () => _finder;
    this.opts = Object.assign({ mode: "all" }, option);
    this._isDataset = false;
  }

  protected convertFromPixel(params: any) {
    const position = [params.offsetX, params.offsetY];
    // 转换像素坐标到图形上的坐标
    return this.getChart()!.convertFromPixel(this._finder(), position);
  }

  public getChart() {
    if (this._chart) return this._chart;
    const chart = resolveUnrefChart(this.chartRef);
    return (this._chart = chart);
  }

  /** 鼠标抬起拖拽结束 */
  protected handleMouseup = () => {
    const zr = this.getChart()!.getZr();
    // 取消监听
    zr.off("mousemove", this!.handleMove);
    zr.off("mouseup", this.handleMouseup);
    this.emit("dragend");
  };

  public abstract startDrag(): void;

  public abstract stopDrag(): void;

  protected abstract handleMove(params: any): void;

  public clear() {
    this.stopDrag();
    this.off("*");
  }
}
