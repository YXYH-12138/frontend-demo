import { ComponentInternalInstance } from "vue";
import { isArray } from "xe-utils";
import { parseString, tableHelper } from "./utils";
import type { VxeGlobalInterceptorHandles, VXETableCore } from "vxe-table";

declare module "vxe-table/types/table" {
	export interface VxeTableEventProps<D = VxeTableDataRow> {
		onDataPaste?: (data: VxeTableEvents.DataPaste<D>) => void;
	}
	// eslint-disable-next-line @typescript-eslint/no-namespace
	export namespace VxeTableEvents {
		export type DataPaste<D = any> = (data: D) => void;
	}
	// eslint-disable-next-line @typescript-eslint/no-namespace
	export namespace VxeTablePropTypes {
		export type DataPasteConfig = {
			/**
			 * 解析数据时忽略的字段
			 * @default ['seq', 'checkbox']
			 */
			ignoreField?: string[];
			/**
			 * 是否同步data
			 * @default true
			 */
			syncData?: boolean;
		};
	}
}

type $VxeTable = VxeGlobalInterceptorHandles.InterceptorParams["$table"];

function parseText(text: string, vxeTable: $VxeTable) {
	const ignoreField: string[] = ["seq", "checkbox"];
	const textIsToArray = isArray(text);

	const allData: any[] = textIsToArray ? JSON.parse(text) : parseString(text);

	let newData: any[] = [];
	// vxeTable
	const maxIndex = Math.min(Infinity, allData.length);

	const columns = vxeTable
		.getColumns()
		.filter((item) => (item.type ? !ignoreField.includes(item.type) : true));

	if (textIsToArray) {
		newData = allData.slice(0, maxIndex);
	} else {
		for (let i = 0; i < maxIndex; i++) {
			const rows = allData[i] as any[];
			const data: Record<string, any> = {};
			rows.forEach((value, i) => {
				if (columns[i]) {
					data[columns[i].field] = value;
				}
			});
			newData.push(data);
		}
	}

	return newData;
}

function handlePaste(e: ClipboardEvent, vxeTable: $VxeTable, instance: ComponentInternalInstance) {
	if (!e.clipboardData) return;
	const text = e.clipboardData.getData("text/plain");
	if (text == null) return;
	const newData = parseText(text, vxeTable);
	// vxeTable.loadData(newData);
	instance.props.data = newData;
	instance.emit("dataPaste", newData);
}

function handleMounted(params: VxeGlobalInterceptorHandles.InterceptorParams) {
	const { instance } = params.$table;
	if (!instance) return;
	const { el } = instance.vnode;
	tableHelper.addEmitOption(instance, "dataPaste");
	console.log(instance);
	if (el) {
		(el as HTMLElement).addEventListener("paste", (e) => handlePaste(e, params.$table, instance));
	}
}

export const VXETablePluginDataPaste = {
	install(vxetablecore: VXETableCore) {
		const { interceptor } = vxetablecore;

		interceptor.mixin({
			mounted: handleMounted
		});
	}
};

if (typeof window !== "undefined" && window.VXETable && window.VXETable.use) {
	window.VXETable.use(VXETablePluginDataPaste);
}

export default VXETablePluginDataPaste;
