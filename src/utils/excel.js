import XLSX from 'xlsx'

// 从Excel文件中获取表格头
function getHeaderRow(sheet) {
  const headers = []
  // 将 A1:G8 这种字符串转换为行列对象
  const range = XLSX.utils.decode_range(sheet['!ref'])
  let C
  const R = range.s.r
  // 从第一列开始，遍历范围中的每一列
  for (C = range.s.c; C <= range.e.c; ++C) {
    // 将行列对象转换为 A1 这种字符串
    const cell = sheet[XLSX.utils.encode_cell({ c: C, r: R })]
    // 用默认值替换
    let hdr = 'UNKNOWN ' + C
    if (cell && cell.t) hdr = XLSX.utils.format_cell(cell)
    headers.push(hdr)
  }
  return headers
}

// 读取Excel文件
export function readDataFromExcel(data, type) {
  // 读取Excel文件并保存到Workbook对象
  const workbook = XLSX.read(data, { type: type })
  const firstSheetName = workbook.SheetNames[0]
  // 获取Workbook对象的worksheet
  const worksheet = workbook.Sheets[firstSheetName]
  const header = getHeaderRow(worksheet)
  // 将worksheet转化成数组
  const results = XLSX.utils.sheet_to_json(worksheet)
  return { header, results }
}

export default {
  readDataFromExcel
}