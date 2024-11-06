// import { ApiType } from "@/api";
import dayjs from "dayjs";
import { transform } from "ol/proj";
import { omit } from "xe-utils";
// import { omit } from "lodash-es";

/** 雨量图颜色 */
export function getRainfallColor(val: number) {
	if (val >= 250) {
		return "#8B061B";
	} else if (val >= 100 && val < 250) {
		return "#FA01F9";
	} else if (val >= 50 && val < 100) {
		return "#0000FB";
	} else if (val >= 25 && val <= 50) {
		return "#61B8FF";
	} else if (val >= 10 && val < 25) {
		return "#068205";
	} else if (val >= 0 && val < 10) {
		return "#CFFFCF";
	} else {
		return "#ffffff";
	}
}

/** 若依时间参数 */
export function createQueryTime(
	start: number | string | Date | undefined,
	end: number | string | Date | undefined
) {
	return {
		"params[beginTime]": start ? dayjs(start).format("YYYY-MM-DD 00:00:00") : null,
		"params[endTime]": end ? dayjs(end).format("YYYY-MM-DD 23:59:59") : null
	};
}

/**
 * vxe-table默认会给每一行数据生成一个唯一id，使用此函数可以剔除
 * @param data
 * @returns
 */
export function omitVxeTableData<T extends Record<string, any>>(data: T[], keys?: string[]): T[] {
	return data.map((item) => omit(item, ["_X_ROW_KEY", ...(keys || [])]));
}

/**
 * 移除表格数据
 * @param tableData 表格数据
 * @param removeRows 需要移除的数据
 * @returns 移除后的新数据
 */
export function removeTableData<T = any>(tableData: T[], removeRows: T[]) {
	const newData: T[] = [];
	const removeLen = removeRows.length;
	const len = tableData.length;
	// 如果移除数据长度和总数据长度相等，则直接清空数据
	if (removeLen === len) return newData;

	// 采用splice删除
	if (removeLen <= 50 && len <= 500) {
		newData.push(...tableData);
		for (let i = 0; i < removeLen; i++) {
			newData.splice(newData.indexOf(removeRows[i]), 1);
		}
	} else {
		return tableData.filter((row) => !removeRows.includes(row));
	}

	return newData;
}

export const transform4326 = (coordinates: number[]) =>
	transform(coordinates, "EPSG:3857", "EPSG:4326");

export const transform3857 = (coordinates: number[]) =>
	transform(coordinates, "EPSG:4326", "EPSG:3857");

/**
 *
 * @param e 事件源
 * @param keys 要合并的列
 * @param tip 不支持虚拟表格
 * @returns
 */
export const mergeRowMethod = (e: any, keys: string[]) => {
	const { row, _rowIndex, column, visibleData } = e;
	const fields = keys;
	const cellValue = row[column.property];
	if (cellValue && fields.includes(column.property)) {
		const prevRow = visibleData[_rowIndex - 1];
		let nextRow = visibleData[_rowIndex + 1];
		if (prevRow && prevRow[column.property] === cellValue) {
			return { rowspan: 0, colspan: 0 };
		} else {
			let countRowspan = 1;
			while (nextRow && nextRow[column.property] === cellValue) {
				nextRow = visibleData[++countRowspan + _rowIndex];
			}
			if (countRowspan > 1) {
				return { rowspan: countRowspan, colspan: 1 };
			}
		}
	}
};
