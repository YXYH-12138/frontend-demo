import { isFunction } from "lodash-es";
import { ChartDragable, ChartDragableOptions } from "./ChartDragable";
import type { LineSeriesOption } from "echarts";

interface AreaDragableOptions {
	// convertFromPixel函数的参数
	finder?: ChartDragableOptions["finder"];
	// 最大长度
	maxLength: number | (() => number);
	// markArea
	markAreaSeries: (downIndex: number, moveIndex: number) => LineSeriesOption;
}

type Events = {
	dragend: { startIndex: number; endIndex: number };
};

/**
 * 区域拖拽
 *  可用于拖拽选中图表上的一段区域进行高亮
 */
export class AreaDragable extends ChartDragable<AreaDragableOptions, Events> {
	public _downData: number[] | undefined;
	public _moveData: number[] | undefined;

	private _isMove = false;

	private handleMousedown = (params: any) => {
		const chart = this.getChart()!;
		// 转换像素坐标到图形上的坐标
		this._downData = this.convertFromPixel(params);
		const zr = chart.getZr();
		zr.on("mousemove", this.handleMove);
		zr.on("mouseup", this.handleMouseup);
	};

	private getMaxLength() {
		const maxLength = this.opts.maxLength;
		if (isFunction(maxLength)) return maxLength();
		return maxLength;
	}

	protected override handleMouseup = () => {
		const zr = this.getChart()!.getZr();
		// 取消监听
		zr.off("mousemove", this!.handleMove);
		zr.off("mouseup", this.handleMouseup);

		if (this._isMove) {
			const startIndex = Math.max(Math.min(this._moveData![0], this._downData![0]), 0);
			const endIndex = Math.min(
				Math.max(this._moveData![0], this._downData![0]),
				this.getMaxLength()
			);

			this.emit("dragend", { startIndex, endIndex });

			this._downData = undefined;
			this._moveData = undefined;
		}

		this._isMove = false;
	};

	protected handleMove = (params: any) => {
		const chart = this.getChart()!;

		const [moveIndex] = (this._moveData = this.convertFromPixel(params));
		const downIndex = this._downData![0];

		this._isMove = true;

		// 不能超过最大最小边界
		if (
			Math.max(downIndex, moveIndex) < this.getMaxLength() &&
			Math.min(downIndex, moveIndex) >= 0
		) {
			chart.setOption({
				series: [
					Object.assign(
						{
							id: "markArea",
							type: "line",
							data: []
						},
						this.opts.markAreaSeries(downIndex, moveIndex)
					)
				]
			});
		}
	};

	public clearArea() {
		const chart = this.getChart();
		chart &&
			chart.setOption({
				series: [{ id: "markArea", type: "line", data: [], markArea: { data: [] } }]
			});
	}

	public startDrag() {
		const chart = this.getChart();
		const zr = chart!.getZr();
		zr.on("mousedown", this.handleMousedown);
	}

	public stopDrag() {
		const chart = this.getChart();
		if (chart) {
			const zr = chart.getZr();
			zr.off("mousedown", this.handleMousedown);
		}
	}
}
