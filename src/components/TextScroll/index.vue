<script lang="tsx">
// @ts-check

import {
	cloneVNode,
	onBeforeUnmount,
	onMounted,
	provide,
	reactive,
	shallowRef,
	watch,
	ref,
	shallowReactive,
	toRef,
	Comment,
	Fragment,
	type PropType,
	type VNode,
	nextTick
} from "vue";
import TextScrollItem from "./TextScrollItem.vue";
import { useElementSize } from "@vueuse/core";
import { Context } from "./token";

export default {
	props: {
		// 滚动反向
		direction: {
			type: String as PropType<"horizontal" | "vertical">,
			default: "vertical"
		},
		// 每多少毫秒滚动一次
		speed: {
			type: Number,
			default: 15
		},
		// 每一次滚动的距离 px
		offset: {
			type: Number,
			default: 1
		},
		// 是否无缝循环滚动
		loop: {
			type: Boolean,
			default: true
		},
		// 多少延迟之后开始滚动
		startDelay: {
			type: Number,
			default: 500
		},
		// 每一个item之间的间距
		space: {
			type: Number,
			default: 20
		},
		data: {
			type: Object as PropType<any[]>,
			required: true
		}
	},
	setup(props, context) {
		const { slots } = context;

		provide(Context, { space: props.space, isHorizontal: props.direction === "horizontal" });

		const limt = 2;
		let itemWH = 0;

		const stack = shallowReactive<any[]>([]);

		const scrollEl = ref<HTMLElement>();
		const wrapEl = ref<HTMLElement>();

		const translate = reactive({ x: 0, y: 0 });

		const currentTranslate = toRef(translate, props.direction === "horizontal" ? "x" : "y");

		// const elList = shallowReactive<VNode[]>([]);

		const field = props.direction === "horizontal" ? "width" : "height";
		const getWidthOrHeight = (el?: HTMLElement) =>
			el ? el.getBoundingClientRect()?.[field] ?? 0 : 0;

		let animationFrameNum: number;
		let timeOut: number;

		/** 动画执行函数 */
		function animationFrame() {
			if (
				Math.abs(currentTranslate.value) >=
				(props.loop ? Infinity : getWidthOrHeight(scrollEl.value))
			) {
				currentTranslate.value = 0;
				nextTick(runner);
			} else {
				// const isReset = ;
				if (props.loop && Math.abs(currentTranslate.value + props.space) > itemWH) {
					stack.splice(0, props.data.length, ...props.data);
					currentTranslate.value = 0;
				} else {
					currentTranslate.value -= props.offset;
				}
				nextTick(runner);
			}
		}

		/** 开始执行 */
		function runner() {
			timeOut = window.setTimeout(
				() => (animationFrameNum = window.requestAnimationFrame(animationFrame)),
				props.speed
			);
		}

		/** 补全元素 */
		// function pushEl() {
		// 	const length = elList.length;
		// 	let index = 0;
		// 	let wh = 0;
		// 	let currentSlot: any;
		// 	// 默认所有元素宽或高的和
		// 	let start = elList.reduce((acc, cur) => acc + getWidthOrHeight(cur.el as HTMLElement), 0);
		// 	// 包裹元素的宽高
		// 	const wrapWh = getWidthOrHeight(wrapEl.value!);
		// 	// 补齐末尾的元素，让元素宽或高超过包裹元素
		// 	while (start <= wrapWh && start !== 0) {
		// 		if (index >= length) {
		// 			index = 0;
		// 		}
		// 		currentSlot = cloneVNode(elList[index++], { key: "__" + elList.length });
		// 		wh = getWidthOrHeight(currentSlot.el);
		// 		elList.push(currentSlot);
		// 		start += wh;
		// 	}
		// 	// 补全末尾的元素
		// 	while (index < length) {
		// 		elList.push(cloneVNode(elList[index++], { key: "__" + elList.length }));
		// 	}
		// }

		function start() {
			const { startDelay } = props;
			startDelay && setTimeout(runner, startDelay);
		}

		function stop() {
			window.clearTimeout(timeOut);
			window.cancelAnimationFrame(animationFrameNum);
		}

		function dataChange(data: any[]) {
			stack.length = 0;
			for (let index = 0; index < limt; index++) {
				stack.push(...data);
			}

			nextTick(() => {
				const wh = getWidthOrHeight(scrollEl.value);
				itemWH = (wh - props.space * limt) / limt;
				console.log(itemWH);
			});

			if (data.length) {
				start();
			} else {
				currentTranslate.value = 0;
				stop();
			}
		}

		watch(() => props.data, dataChange, { immediate: true });

		onBeforeUnmount(stop);

		return () => (
			<div class="text-scroll-wrap" ref={wrapEl}>
				<div
					ref={scrollEl}
					class={{ flex: props.direction === "horizontal", "scroll-box": true }}
					style={{ transform: `translate(${translate.x}px,${translate.y}px)` }}
				>
					{stack.length
						? stack.map((row) => <TextScrollItem>{slots.default?.(row)}</TextScrollItem>)
						: slots.empty?.()}
				</div>
			</div>
		);
	}
};
</script>

<style lang="scss" scoped>
.flex {
	display: inline-flex;
}
.text-scroll-wrap {
	width: 100%;
	height: 100%;
	overflow: hidden;
	.scroll-box {
		width: auto;
		height: auto;
	}
}
</style>
