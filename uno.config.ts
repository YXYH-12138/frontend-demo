// uno.config.ts
import { defineConfig, presetAttributify, presetUno } from "unocss";
import { presetRemToPx } from "@unocss/preset-rem-to-px";

export default defineConfig({
	shortcuts: [
		// ...
	],
	theme: {
		colors: {
			// ...
		}
	},
	presets: [
		presetUno(),
		presetAttributify(),
		// 让默认单位为px
		presetRemToPx({ baseFontSize: 4 })
	]
});
