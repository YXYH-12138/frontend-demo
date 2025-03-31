import { defineConfig, loadEnv } from "vite";
import { join, resolve } from "node:path";
import vue from "@vitejs/plugin-vue";
import VueJsx from "@vitejs/plugin-vue-jsx";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";
import { createStyleImportPlugin, VxeTableResolve } from "vite-plugin-style-import";
import ElementPlus from "unplugin-element-plus/vite";
import { visualizer } from "rollup-plugin-visualizer";
import UnoCSS from "unocss/vite";
import cesium from "vite-plugin-cesium";

// import { createVersion } from "./script/version-check/createVersion";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
	const root = process.cwd();
	// 加载环境配置
	const ENV = loadEnv(mode, root);

	const { VITE_MAP_API } = ENV;

	return {
		plugins: [
			vue({ reactivityTransform: true }),
			cesium(),
			VueJsx(),
			AutoImport({
				resolvers: [ElementPlusResolver()],
				dts: resolve(__dirname, "./src/typings/auto-imports.d.ts")
			}),
			Components({
				resolvers: [ElementPlusResolver({ importStyle: "sass" })],
				dts: resolve(__dirname, "./src/typings/components.d.ts")
			}),
			ElementPlus({ useSource: true }),
			UnoCSS(),
			createStyleImportPlugin({
				resolves: [VxeTableResolve()]
			}),
			visualizer({
				// 将分析文件放在打包目录下
				emitFile: true,
				//如果存在本地服务端口，将在打包后自动展示
				open: true
			})
		],
		resolve: {
			alias: {
				"@": resolve(__dirname, "./src")
			}
		},

		server: {
			host: true,
			proxy: {
				[VITE_MAP_API]: {
					target: "http://10.21.0.139:9998",
					rewrite: (path) => path.replace(VITE_MAP_API, "")
				}
			}
		},

		build: {
			minify: "esbuild",
			outDir: join("./dist"),
			emptyOutDir: true,
			rollupOptions: {
				output: {
					chunkFileNames: "static/js/[name]-[hash].js",
					entryFileNames: "static/js/[name]-[hash].js",
					assetFileNames: "static/[ext]/[name]-[hash].[ext]",
					manualChunks: {
						vxeTable: ["vxe-table"],
						axios: ["axios"],
						dayjs: ["dayjs"],
						exceljs: ["exceljs"],
						docxPreview: ["docx-preview"],
						elementPlus: ["element-plus"],
						turf: ["@turf/turf"]
					}
				}
			},
			// 启动 / 禁用 CSS 代码拆分
			cssCodeSplit: true,
			// 禁用 gzip 压缩大小报告。
			reportCompressedSize: true,
			// 构建后是否生成 soutrce map 文件
			sourcemap: false
		}
	};
});
