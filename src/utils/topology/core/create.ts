import { h, onActivated, onDeactivated, onBeforeUnmount, onMounted, shallowRef } from "vue";
// import { useResizeObserver } from "@vueuse/core";
import { LockState, PenType, Meta2d, type Options } from "@meta2d/core";
import { withResolvers } from "@/utils";
import type { Pen } from "../type";

type Event = { pen?: Pen };

export const TOPOLOGY_CALSS_NAME = "meta2d-box";

export function createTopology(opts?: Options) {
	const el = shallowRef<HTMLElement>();

	const { promise, resolve } = withResolvers<Meta2d>();

	const meta2d = shallowRef<Meta2d>();
	const pen = shallowRef<Pen>();

	// 概化图展示组件
	const TopologyComponent = () =>
		h("div", { style: { width: "100%", height: "100%" }, class: [TOPOLOGY_CALSS_NAME], ref: el });

	/** 节点点击 */
	function nodeClick(e?: Event) {
		pen.value = e!.pen;
	}

	/** 设置线条锁定状态 */
	async function lockLine(pens: Pen[], lock: LockState) {
		const topology = await promise;
		const data = pens.filter((item) => item.type === PenType.Line);
		for (const pen of data) {
			topology.setValue({ id: pen.id, locked: lock });
		}
	}

	let isActive = true;
	onActivated(() => {
		isActive = true;
	});
	onDeactivated(() => {
		isActive = false;
	});

	/** 监听原生变化自动缩放图形 */
	// function handleResize() {
	// 	useResizeObserver(el.value, (entries) => {
	// 		const entry = entries[0];
	// 		const { width, height } = entry.contentRect;
	// 		isActive && width && height && meta2d.value && meta2d.value.resize();
	// 	});
	// }

	/** 初始化方法 */
	function init() {
		if (!el.value) return;
		const _meta2d = (meta2d.value = new Meta2d(el.value, {
			drawingLineName: "line",
			hoverColor: "",
			autoPolyline: true,
			autoAnchor: true,
			toArrow: "triangleSolid",
			textAlign: "center",
			...(opts || {})
		}));
		// handleResize();
		// HACK:路由缓存之后，切换页面也会调用resize方法导致错误，这里重写resize方法进行判断
		rewrite(_meta2d);
		_meta2d.on("mousedown", nodeClick);
		resolve(meta2d.value);
	}

	/**
	 * 重写meta2d部分方法
	 * @param meta2d
	 */
	function rewrite(meta2d: Meta2d) {
		const resize = meta2d.canvas.resize;
		meta2d.canvas.resize = function (w?: number, h?: number) {
			isActive && resize.call(meta2d.canvas, w, h);
		};
		const copy = meta2d.canvas.copy;
		meta2d.canvas.copy = function (pens?: Pen[] | undefined) {
			meta2d.emit("copy", pens || meta2d.store.active);
			return copy.call(meta2d.canvas, pens);
		};
		const paste = meta2d.canvas.paste;
		meta2d.canvas.paste = function () {
			meta2d.emit("paste");
			return paste.call(meta2d.canvas);
		};
	}

	onMounted(init);

	onBeforeUnmount(() => {
		// 将onlyData设为true，不要清除全部的数据，否则路由缓存切回来之后缩放会找不到缓存数据报错
		meta2d.value && meta2d.value.destroy(true);
	});

	return { TopologyComponent, lockLine, promise, meta2d, pen };
}

export type CreateTopologyReturnValue = ReturnType<typeof createTopology>;
