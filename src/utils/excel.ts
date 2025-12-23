import ExcelJS, { Alignment } from "exceljs";
import { VxeTableDefines } from "vxe-table";
import XEUtils from "xe-utils";
import { download } from "./common";

const defaultHeaderBackgroundColor = "f8f8f9";
const defaultCellFontColor = "606266";
const defaultCellBorderStyle = "thin";
const defaultCellBorderColor = "e8eaec";

function getCellLabel(column: VxeTableDefines.ColumnInfo, cellValue: any) {
	if (cellValue) {
		if (column.type === "seq") {
			return XEUtils.toValueString(cellValue);
		}
		switch (column.cellType) {
			case "string":
				return XEUtils.toValueString(cellValue);
			case "number":
				if (!isNaN(cellValue)) {
					return Number(cellValue);
				}
				break;
			default:
				if (cellValue.length < 12 && !isNaN(cellValue)) {
					return Number(cellValue);
				}
				break;
		}
	}
	return cellValue;
}

function getValidColumn(column: VxeTableDefines.ColumnInfo): VxeTableDefines.ColumnInfo {
	const { childNodes } = column;
	const isColGroup = childNodes && childNodes.length;
	if (isColGroup) {
		return getValidColumn(childNodes[0]);
	}
	return column;
}

function setExcelRowHeight(excelRow: ExcelJS.Row, height: number) {
	if (height) {
		excelRow.height = XEUtils.floor(height * 0.75, 12);
	}
}

function setExcelCellStyle(excelCell: ExcelJS.Cell, align?: Alignment["horizontal"]) {
	excelCell.protection = {
		locked: false
	};
	excelCell.alignment = {
		vertical: "middle",
		horizontal: align || "left"
	};
}

function getDefaultBorderStyle() {
	return {
		top: {
			style: defaultCellBorderStyle,
			color: {
				argb: defaultCellBorderColor
			}
		},
		left: {
			style: defaultCellBorderStyle,
			color: {
				argb: defaultCellBorderColor
			}
		},
		bottom: {
			style: defaultCellBorderStyle,
			color: {
				argb: defaultCellBorderColor
			}
		},
		right: {
			style: defaultCellBorderStyle,
			color: {
				argb: defaultCellBorderColor
			}
		}
	};
}

function exportXLSX(params: VxeGlobalInterceptorHandles.InterceptorExportParams) {
	const { options, columns, colgroups, datas } = params;
	// const { props, reactData } = $table;
	// const { computeColumnOpts } = $table.getComputeMaps();
	const { headerAlign: allHeaderAlign, align: allAlign, footerAlign: allFooterAlign } = props;
	const { rowHeight } = reactData;
	const { sheetName, isHeader, isFooter, isMerge, isColgroup, original, useStyle, sheetMethod } =
		options;
	// const columnOpts = computeColumnOpts.value;
	// const mergeCells = $table.getMergeCells();
	const colList: any[] = [];
	const footList: any[] = [];
	const sheetCols: any[] = [];
	const sheetMerges: { s: { r: number; c: number }; e: { r: number; c: number } }[] = [];
	let beforeRowCount = 0;
	columns.forEach((column) => {
		const { id, renderWidth } = column;
		sheetCols.push({
			key: id,
			width: XEUtils.ceil(renderWidth / 8, 1)
		});
	});
	// 处理表头
	if (isHeader) {
		// 处理分组
		if (isColgroup && colgroups) {
			colgroups.forEach((cols, rIndex) => {
				const groupHead: any = {};
				columns.forEach((column) => {
					groupHead[column.id] = null;
				});
				cols.forEach((column) => {
					const { _colSpan, _rowSpan } = column;
					const validColumn = getValidColumn(column);
					const columnIndex = columns.indexOf(validColumn);
					const headExportMethod =
						(column as any).headerExportMethod || (columnOpts as any).headerExportMethod;
					groupHead[validColumn.id] = headExportMethod
						? headExportMethod({ column, options, $table })
						: original
						? validColumn.field
						: column.getTitle();
					if (_colSpan > 1 || _rowSpan > 1) {
						sheetMerges.push({
							s: { r: rIndex, c: columnIndex },
							e: { r: rIndex + _rowSpan - 1, c: columnIndex + _colSpan - 1 }
						});
					}
				});
				colList.push(groupHead);
			});
		} else {
			const colHead: any = {};
			columns.forEach((column) => {
				const { id, field } = column as any;
				const headExportMethod =
					(column as any).headerExportMethod || (columnOpts as any).headerExportMethod;
				colHead[id] = headExportMethod
					? headExportMethod({ column, options, $table })
					: original
					? field
					: column.getTitle();
			});
			colList.push(colHead);
		}
		beforeRowCount += colList.length;
	}
	// 处理合并
	if (isMerge) {
		mergeCells.forEach((mergeItem) => {
			const {
				row: mergeRowIndex,
				rowspan: mergeRowspan,
				col: mergeColIndex,
				colspan: mergeColspan
			} = mergeItem;
			sheetMerges.push({
				s: { r: mergeRowIndex + beforeRowCount, c: mergeColIndex },
				e: {
					r: mergeRowIndex + beforeRowCount + mergeRowspan - 1,
					c: mergeColIndex + mergeColspan - 1
				}
			});
		});
	}
	const rowList = datas.map((item) => {
		const rest: any = {};
		columns.forEach((column) => {
			rest[column.id] = getCellLabel(column, item[column.id]);
		});
		return rest;
	});
	beforeRowCount += rowList.length;

	const exportMethod = () => {
		const workbook: ExcelJS.Workbook = new ExcelJS.Workbook();
		const sheet = workbook.addWorksheet(sheetName);
		workbook.creator = "vxe-table";
		sheet.columns = sheetCols;
		if (isHeader) {
			sheet.addRows(colList).forEach((excelRow) => {
				if (useStyle) {
					setExcelRowHeight(excelRow, rowHeight);
				}
				excelRow.eachCell((excelCell) => {
					const excelCol = sheet.getColumn(excelCell.col);
					const column: any = $table.getColumnById(excelCol.key as string);
					const { headerAlign, align } = column;
					setExcelCellStyle(excelCell, headerAlign || align || allHeaderAlign || allAlign);
					if (useStyle) {
						Object.assign(excelCell, {
							font: {
								bold: true,
								color: {
									argb: defaultCellFontColor
								}
							},
							fill: {
								type: "pattern",
								pattern: "solid",
								fgColor: {
									argb: defaultHeaderBackgroundColor
								}
							},
							border: getDefaultBorderStyle()
						});
					}
				});
			});
		}
		sheet.addRows(rowList).forEach((excelRow) => {
			if (useStyle) {
				setExcelRowHeight(excelRow, rowHeight);
			}
			excelRow.eachCell((excelCell) => {
				const excelCol = sheet.getColumn(excelCell.col);
				const column = $table.getColumnById(excelCol.key as string);
				if (column) {
					const { align } = column;
					setExcelCellStyle(excelCell, align || allAlign);
					if (useStyle) {
						Object.assign(excelCell, {
							font: {
								color: {
									argb: defaultCellFontColor
								}
							},
							border: getDefaultBorderStyle()
						});
					}
				}
			});
		});
		if (isFooter) {
			sheet.addRows(footList).forEach((excelRow) => {
				if (useStyle) {
					setExcelRowHeight(excelRow, rowHeight);
				}
				excelRow.eachCell((excelCell) => {
					const excelCol = sheet.getColumn(excelCell.col);
					const column = $table.getColumnById(excelCol.key as string);
					if (column) {
						const { footerAlign, align } = column;
						setExcelCellStyle(excelCell, footerAlign || align || allFooterAlign || allAlign);
						if (useStyle) {
							Object.assign(excelCell, {
								font: {
									color: {
										argb: defaultCellFontColor
									}
								},
								border: getDefaultBorderStyle()
							});
						}
					}
				});
			});
		}
		// 自定义处理
		if (sheetMethod) {
			sheetMethod({
				options: options,
				workbook,
				worksheet: sheet,
				columns,
				colgroups,
				datas,
				$table,
				$grid
			});
		}
		sheetMerges.forEach(({ s, e }) => {
			sheet.mergeCells(s.r + 1, s.c + 1, e.r + 1, e.c + 1);
		});
		workbook.xlsx.writeBuffer().then((buffer) => {
			const blob = new Blob([buffer], { type: "application/octet-stream" });
			download(blob, "");
		});
	};
	exportMethod();
}
