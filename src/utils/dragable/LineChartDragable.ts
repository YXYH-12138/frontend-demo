import { ChartDragable, type ChartDragableOptions } from "./ChartDragable";

export interface LineChartDragableOptions extends ChartDragableOptions {
	/** 数据中修改的字段，不然则使用seriesId */
	keyField?: string;
	/** 用于判断是否可以拖动的条件，true表示可以拖动 */
	startIntercept?: (params: any, key: string) => boolean;
	/** 拖动模式 垂直拖动单点或无限制 暂不支持x轴为value类型的图形 */
	mode?: "vertical" | "all";
}

/** 线条拖拽类 */
export class LineChartDragable extends ChartDragable<LineChartDragableOptions> {
	/** 鼠标按下开始监听鼠标移动 */
	private handleMousedown = (params: any) => {
		// 只允许鼠标左键
		if (params.event.which !== 1) return;
		const { opts, _chart } = this;
		this.mouseDownParams = params;
		const key = (this._seriesId = opts.keyField || params.seriesId);
		const isListener = opts.startIntercept ? opts.startIntercept(params, key) : true;
		if (isListener && _chart) {
			this._isDataset = !Array.isArray(this.mouseDownParams.value);
			this.emit("dragstart", { params, seriesId: key });
			const zr = _chart.getZr();
			zr.on("mousemove", this.handleMove);
			zr.on("mouseup", this.handleMouseup);
		}
	};

	/** 鼠标移动事件 */
	protected handleMove = (params: any) => {
		const chart = this._chart;
		if (!chart) return;

		const { setOption, mode } = this.opts;

		// 转换像素坐标到图形上的坐标
		const data = this.convertFromPixel(params);

		const startIndex = this.mouseDownParams.dataIndex;
		// 如果拖动模式为垂直则重置x轴的值
		if (mode === "vertical" && startIndex !== data[0]) {
			data[0] = startIndex;
		}

		const eventData = {
			chart,
			data,
			seriesId: this._seriesId!,
			params: this.mouseDownParams,
			isDataset: this._isDataset
		};
		setOption && setOption(eventData);
		this.emit("draging", eventData);
	};

	public startDrag() {
		const chart = this.getChart();
		chart && chart.on("mousedown", "series.line", this.handleMousedown);
	}

	public stopDrag() {
		const chart = this.getChart();
		chart && chart.off("mousedown", this.handleMousedown);
	}
}
