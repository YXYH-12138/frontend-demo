<template>
	<div ref="refWord" v-if="visible" />
</template>

<script lang="ts" setup>
import { nextTick, shallowRef, watch } from "vue";
import { renderAsync, type Options } from "docx-preview";

// https://www.npmjs.com/package/docx-preview

interface Props {
	data?: Blob | ArrayBuffer | Uint8Array;
	options?: Partial<Options>;
	visible?: boolean;
}
const props = defineProps<Props>();

const refWord = shallowRef<HTMLElement>();

const defaultOptions: Partial<Options> = {
	className: "docx", // 默认和文档样式类的类名/前缀
	inWrapper: true, //  启用围绕文档内容渲染包装器
	ignoreWidth: false, //  禁止页面渲染宽度
	ignoreHeight: false, //  禁止页面渲染高度
	ignoreFonts: false, //  禁止字体渲染
	breakPages: true, //  在分页符上启用分页
	ignoreLastRenderedPageBreak: true, //  禁用lastRenderedPageBreak元素的分页
	experimental: false, //  启用实验性功能（制表符停止计算）
	trimXmlDeclaration: true, //   如果为真，xml声明将在解析之前从xml文档中删除
	debug: false, //  启用额外的日志记录
	useBase64URL: true // 如果为true，图片、字体等将被转换为base 64 URL，否则使用URL.createObjectURL
};

function loadWord(data?: Blob | ArrayBuffer | Uint8Array, options?: Partial<Options>) {
	renderAsync(data, refWord.value!, undefined, Object.assign(defaultOptions, options));
}

watch(
	() => props.visible,
	(visible) => {
		if (visible) {
			nextTick(() => loadWord(props.data, props.options));
		}
	},
	{ immediate: true }
);

watch(
	() => props.data,
	() => props.visible && loadWord(props.data, props.options)
);

defineExpose({ loadWord });
</script>
