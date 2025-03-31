import { VxeTable, VxeColumn, VxeColgroup, VxeGrid } from "vxe-table";
import { VxeLoading, VxeTooltip, VxeModal, Icon, Print, VxeInput, VxeUI, Upload } from "vxe-pc-ui";
import zhCN from "vxe-table/es/locale/lang/zh-CN";
import "vxe-table/styles/cssvar.scss";

import VXETablePluginDataPaste from "./vxe-table-plugin-data-paste";
import VXETablePluginXLSX from "./vxe-table-plugin-export-xlsx";
import type { App, Plugin } from "vue";

VxeUI.setI18n("zh-CN", zhCN);
VxeUI.setLanguage("zh-CN");
VxeUI.setConfig({
	table: {
		size: "medium",
		autoResize: true,
		align: "center",
		border: true,
		height: "100%",
		showOverflow: "tooltip",
		scrollX: { enabled: true },
		scrollY: { enabled: true }
	},
	grid: {
		size: "medium"
	},
	input: { controls: false }
});
VxeUI.use(VXETablePluginXLSX).use(VXETablePluginDataPaste);

const components: Plugin[] = [
	VxeModal,
	VxeTable,
	VxeColumn,
	VxeColgroup,
	VxeGrid,
	VxeLoading,
	VxeTooltip,
	Icon,
	Print,
	Upload,
	VxeInput
];

export default function (app: App): void {
	components.forEach(app.use);
}
