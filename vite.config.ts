import { defineConfig } from "vite";
import { resolve } from "node:path";
import vue from "@vitejs/plugin-vue";
import VueJsx from "@vitejs/plugin-vue-jsx";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";
import { createStyleImportPlugin, VxeTableResolve } from "vite-plugin-style-import";

import UnoCSS from "unocss/vite";

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		vue({ reactivityTransform: true }),
		VueJsx(),
		AutoImport({
			resolvers: [ElementPlusResolver()]
		}),
		Components({
			resolvers: [ElementPlusResolver()]
		}),
		UnoCSS(),
		createStyleImportPlugin({
			resolves: [VxeTableResolve()]
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
			"/map": {
				target: "http://gxpt.jxsl.gov.cn/arcgis/rest/services",
				rewrite: (path) => path.replace("/map", "")
			}
		}
	}
});
