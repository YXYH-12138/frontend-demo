<script lang="tsx">
import {
	cloneVNode,
	onBeforeUnmount,
	onMounted,
	provide,
	reactive,
	ref,
	shallowReactive,
	toRef,
	toRefs
} from "vue";
import { useElementSize } from "@vueuse/core";
import { Context } from "./token";

export default {
	props: {
		// 滚动反向
		direction: {
			type: String, // "horizontal" | "vertical"
			default: "horizontal"
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
		// 是否循环
		loop: {
			type: Boolean,
			default: true
		},
		// 多少延迟之后开始滚动
		startDelay: {
			type: Number,
			default: 500
		},
		space: {
			type: Number,
			default: 20
		}
	},
	setup(props: any, context: any) {
		const { slots } = context;

		provide(Context, { space: props.space, isHorizontal: props.direction === "horizontal" });

		const scrollEl = ref<HTMLElement>();
		const { width, height } = useElementSize(scrollEl);

		const wrapEl = ref<HTMLElement>();

		const translate = reactive({ x: 0, y: 0 });

		const wh = props.direction === "horizontal" ? width : height;
		const field = props.direction === "horizontal" ? "offsetWidth" : "offsetHeight";
		const currentTranslate =
			props.direction === "horizontal" ? toRef(translate, "x") : toRef(translate, "y");

		const elList = shallowReactive<any[]>([]);

		let animationFrameNum: number;

		const animationFrame = () => {
			if (Math.abs(currentTranslate.value) >= (props.loop ? Infinity : wh.value)) {
				currentTranslate.value = 0;
				mount();
			} else {
				if (
					props.loop &&
					Math.abs(currentTranslate.value - props.offset) > elList[0].el[field] + props.space
				) {
					elList.push(elList.shift());
					currentTranslate.value = 0;
				}
				currentTranslate.value -= props.offset;
				start();
			}
		};

		const start = () =>
			setTimeout(
				() => (animationFrameNum = window.requestAnimationFrame(animationFrame)),
				props.speed
			);

		const mount = () => {
			const { startDelay } = props;
			startDelay && setTimeout(start, startDelay);
		};

		const pushEl = () => {
			let index = 0,
				wh = 0,
				length = elList.length,
				currentSlot: any;
			// 默认所有元素宽或高的和
			let start = elList.reduce((acc, cur) => acc + cur.el[field], 0);
			// 包裹元素的宽高
			const wrapWh = wrapEl.value![field];
			// 补齐末尾的元素，让元素宽或高超过包裹元素
			while (start <= wrapWh && start !== 0) {
				if (index >= length) {
					index = 0;
				}
				currentSlot = cloneVNode(elList[index++], { key: "__" + elList.length });
				wh = currentSlot.el[field];
				elList.push(currentSlot);
				start += wh;
			}
			// 补全末尾的元素
			while (index < length) {
				elList.push(cloneVNode(elList[index++], { key: "__" + elList.length }));
			}
		};

		elList.push(...slots.default());

		onBeforeUnmount(() => window.cancelAnimationFrame(animationFrameNum));

		onMounted(() => {
			props.loop && pushEl();
			mount();
		});

		return { scrollEl, ...toRefs(translate), elList, wrapEl };
	},
	render() {
		const { direction, x, elList, y } = this as any;

		return (
			<div class="text-scroll-wrap" ref="wrapEl">
				<div
					ref="scrollEl"
					class={{ flex: direction === "horizontal", "scroll-box": true }}
					style={{ transform: `translate(${x}px,${y}px)` }}
				>
					{elList}
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
		height: 100%;
	}
}
</style>
