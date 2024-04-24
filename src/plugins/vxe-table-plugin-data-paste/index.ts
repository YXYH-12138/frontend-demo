import { isArray } from "xe-utils";
import { parseString } from "./utils";
import type { VxeGlobalInterceptorHandles, VXETableCore } from "vxe-table";

interface DataPasteConfig$ {
	/**
	 * 解析数据时忽略的字段
	 * @default ['seq', 'checkbox']
	 */
	ignoreField?: string[];
	onDataPaste?: (data: any[]) => void;
}

declare module "vxe-table/types/table" {
	// eslint-disable-next-line @typescript-eslint/no-namespace
	export namespace VxeTablePropTypes {
		export type DataPasteConfig = DataPasteConfig$;
	}
}

type $VxeTable = VxeGlobalInterceptorHandles.InterceptorParams["$table"];

function parseText(text: string, ignoreField: string[], vxeTable: $VxeTable) {
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

const shouldPaste = (e: ClipboardEvent) => {
	const el = e.target as HTMLElement;
	return e.clipboardData && el.tagName.toUpperCase() !== "INPUT";
};

function handlePaste(e: ClipboardEvent, vxeTable: $VxeTable, config: DataPasteConfig$) {
	if (!shouldPaste(e)) return;
	const text = e.clipboardData!.getData("text/plain");
	if (text == null) return;
	const newData = parseText(text, config.ignoreField ?? ["seq", "checkbox"], vxeTable);
	console.log(vxeTable);
	vxeTable.loadData(newData);
	config.onDataPaste && config.onDataPaste(newData);
}

function handleMounted(params: VxeGlobalInterceptorHandles.InterceptorParams) {
	const { instance } = params.$table;
	const config = instance.attrs["data-paste-config"] || instance.attrs["dataPasteConfig"];
	if (!instance || !config) return;
	const { el } = instance.vnode;
	if (el) {
		(el as HTMLElement).addEventListener("paste", (e) => handlePaste(e, params.$table, config));
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
