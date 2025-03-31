import { isArray } from "xe-utils";
import { stringToArray } from "@/utils";
import type { VxeGlobalInterceptorHandles, VXETableCore } from "vxe-table";

interface DataPasteConfig$ {
	/**
	 * 解析数据时忽略的字段
	 * @default ['seq', 'checkbox']
	 */
	ignoreField?: string[];
	// 自定义解析的逻辑
	parseString?: (text: string) => any[];
	// 粘贴完成发出的事件
	onDataPaste?: (data: any[]) => void;
}

declare module "vxe-table" {
	// eslint-disable-next-line @typescript-eslint/no-namespace
	export namespace VxeTablePropTypes {
		export type DataPasteConfig = DataPasteConfig$;
	}
}

type $VxeTable = VxeGlobalInterceptorHandles.InterceptorParams["$table"];

function parseText(text: string, config: DataPasteConfig$, vxeTable: $VxeTable) {
	const { ignoreField, parseString } = config as Required<DataPasteConfig$>;

	let data: any = null;
	try {
		data = JSON.parse(text);
	} catch {
		//
	}
	const textIsToArray = isArray(data);

	const allData: any[] = textIsToArray
		? data
		: parseString
		? parseString(text)
		: stringToArray(text);

	let newData: any[] = [];
	// vxeTable
	const maxIndex = Math.min(Infinity, allData.length);

	const columns = vxeTable
		.getColumns()
		.filter((item) =>
			item.type ? !ignoreField.includes(item.type) : !ignoreField.includes(item.field)
		);

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
	if (!config.ignoreField) {
		config.ignoreField = ["seq", "checkbox"];
	} else {
		config.ignoreField = config.ignoreField.concat(["seq", "checkbox"]);
	}
	const newData = parseText(text, config, vxeTable);
	config.onDataPaste && config.onDataPaste(newData);
}

function handleMounted(params: VxeGlobalInterceptorHandles.InterceptorParams) {
	const tableInstance = params.$grid || params.$table;
	const { renderVN, context } = tableInstance;
	if (!context || !renderVN) return;
	const { attrs } = context;
	const config = attrs["data-paste-config"] || attrs["dataPasteConfig"];
	if (!config) return;
	const el = (renderVN() as any).props.ref.value;
	if (el) {
		(el as HTMLElement).addEventListener("paste", (e) =>
			handlePaste(e, tableInstance as $VxeTable, config)
		);
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

export default VXETablePluginDataPaste;
