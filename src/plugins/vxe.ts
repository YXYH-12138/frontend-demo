import { get, toFormatString } from "xe-utils";

import {
	VXETable,
	Table,
	Column,
	Edit,
	Tooltip,
	Grid,
	Input,
	Modal,
	Icon,
	Colgroup,
	Export
} from "vxe-table";
import zhCN from "vxe-table/es/locale/lang/zh-CN";
import "vxe-table/styles/cssvar.scss";

import VXETablePluginDataPaste from "./vxe-table-plugin-data-paste";
import VXETablePluginXLSX from "./vxe-table-plugin-export-xlsx";
import type { App, Plugin } from "vue";

// 按需加载的方式默认是不带国际化的，自定义国际化需要自行解析占位符 '{0}'，例如：
VXETable.config({
	i18n: (key, args) => toFormatString(get(zhCN, key), args),
	table: {
		autoResize: true,
		align: "center",
		border: true,
		height: "auto"
		// showOverflow: true
	}
});

VXETable.use(VXETablePluginDataPaste).use(VXETablePluginXLSX);

const components: Plugin[] = [
	Table,
	Export,
	Grid,
	Input,
	Edit,
	Colgroup,
	Column,
	Tooltip,
	Modal,
	Icon
];

export default function (app: App): void {
	components.forEach(app.use);
}
