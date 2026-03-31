import { ChartDragable, type ChartDragableOptions } from "./ChartDragable";

export interface NormalChartDragableOptions extends ChartDragableOptions {
	/** 数据中修改的字段，不然则使用seriesId */
	keyField?: string;
	/** 用于判断是否可以拖动的条件，true表示可以拖动 */
	startIntercept?: (params: any, key: string) => boolean;
}

/**
 * 基础拖拽类
 *  可用于柱状图
 */
export class NormalChartDragable extends ChartDragable<NormalChartDragableOptions> {
	/** 鼠标移动事件 */
	protected handleMove = (params: any) => {
		const { setOption } = this.opts;
		const chart = this._chart!;

		// 转换像素坐标到图形上的坐标
		const data = this.convertFromPixel(params);

		const eventData = {
			chart,
			data,
			seriesId: this._seriesId!,
			params: this.mouseDownParams,
			isDataset: this._isDataset
		};
		setOption(eventData);
		this.emit("draging", eventData);
	};

	/** 鼠标按下开始监听鼠标移动 */
	private handleMousedown = (params: any) => {
		// 只允许鼠标左键
		if (params.event.which !== 1) return;
		const { opts, _chart } = this;
		this.mouseDownParams = params;
		const key = (this._seriesId = opts.keyField || params.seriesId);
		const isListener = opts.startIntercept ? opts.startIntercept(params, key) : true;
		if (isListener && _chart) {
			this.emit("dragstart", { params, seriesId: key });
			const zr = _chart.getZr();
			zr.on("mousemove", this.handleMove);
			zr.on("mouseup", this.handleMouseup);
		}
	};

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
