import { App, Plugin } from "vue";
import { get, toFormatString } from "xe-utils";
import { VXETable, Table, Column, Edit } from "vxe-table";
import zhCN from "vxe-table/es/locale/lang/zh-CN";
import "vxe-table/styles/cssvar.scss";

// 按需加载的方式默认是不带国际化的，自定义国际化需要自行解析占位符 '{0}'，例如：
VXETable.config({
	i18n: (key, args) => toFormatString(get(zhCN, key), args),
	table: {
		autoResize: true,
		align: "center",
		border: true,
		height: "auto",
		showOverflow: "tooltip"
	},
	input: { controls: false }
});

const components: Plugin[] = [Table, Edit, Column];

export default function (app: App): void {
	components.forEach(app.use);
}
