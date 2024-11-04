<script lang="tsx">
import {
	onBeforeUnmount,
	reactive,
	shallowRef,
	watch,
	ref,
	toRef,
	type PropType,
	nextTick
} from "vue";
import TextScrollItem from "./TextScrollItem.vue";
import type { RectData, Direction } from "./props";

export default {
	props: {
		// 滚动方向
		direction: {
			type: String as PropType<Direction>,
			default: "vertical"
		},
		// 每多少毫秒滚动一次
		speed: {
			type: Number,
			default: 10
		},
		// 每一次滚动的距离 px
		offset: {
			type: Number,
			default: 1
		},
		// 是否无缝循环滚动
		loop: {
			type: Boolean,
			default: false
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

		const stack = shallowRef<any[]>([]);

		const rectData = reactive<Array<RectData>>([]);

		const scrollEl = ref<HTMLElement>();
		const wrapEl = ref<HTMLElement>();

		const translate = reactive({ x: 0, y: 0 });

		const isHorizontal = () => props.direction === "horizontal";

		const currentTranslate = toRef(translate, isHorizontal() ? "x" : "y");

		const field = isHorizontal() ? "width" : "height";
		const getWidthOrHeight = (el?: HTMLElement) =>
			el ? el.getBoundingClientRect()?.[field] ?? 0 : 0;

		let animationFrameNum: number;
		let timeOut: number;

		const getRectSum = (maxLen?: number) =>
			rectData.slice(0, maxLen).reduce((acc, cur) => acc + cur[field] + cur.space, 0);

		/** 判断是否需要滚动，当数组超过容器宽度时，需要滚动 */
		function shouldScroll() {
			if (!stack.value.length) return false;
			const wh = getWidthOrHeight(wrapEl.value);
			return getRectSum() > wh;
		}

		/** 动画执行函数 */
		function animationFrame() {
			const { data, offset } = props;

			const len = data.length;

			let translate = currentTranslate.value;

			const distance = getRectSum(len);

			translate -= offset;

			if (Math.abs(translate) - rectData[len - 1].space >= distance) {
				translate = 0;
			}

			currentTranslate.value = translate;

			runner();
		}

		/** 开始执行 */
		function runner() {
			timeOut = window.setTimeout(
				() => (animationFrameNum = window.requestAnimationFrame(animationFrame)),
				props.speed
			);
		}

		function start() {
			const { startDelay } = props;
			startDelay && setTimeout(runner, startDelay);
		}

		function stop() {
			window.clearTimeout(timeOut);
			window.cancelAnimationFrame(animationFrameNum);
		}

		function dataChange(data: any[]) {
			stack.value = [...data];

			nextTick(() => {
				if (shouldScroll()) {
					if (props.loop) {
						stack.value = [...data, ...data];
					}
					start();
				} else {
					currentTranslate.value = 0;
					stop();
				}
			});
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
					{stack.value.length
						? stack.value.map((row, i) => (
								<TextScrollItem
									index={i}
									key={i}
									reacData={rectData}
									space={props.space}
									direction={props.direction}
								>
									{slots.default?.(row)}
								</TextScrollItem>
						  ))
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
