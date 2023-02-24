/**
 * 使用xlsx导出数据
 * @param data 数据
 * @param fileName 文件名
 * @param sheetName sheet名
 * @param header 表头
 * @param keys 数据key
 * @param type 导出类型
 * @param bookType 导出文件类型
 */
import  { BookType } from 'xlsx';
import * as XLSX from 'xlsx';
export type XlsxType = {
  data: any[],
  fileName?: string,
  sheetName?: string,
  header: Record<string, string>
  type?: string,
  bookType?: BookType,
}
export function useXlsx(
 {
    data,
    header,
    fileName = '导出数据',
    sheetName = 'sheet1',
    type = 'xlsx',
    bookType = 'xlsx',
 }: XlsxType,
) {
  const list = data.map((item) => {
    const obj: Record<string, any> = {};
    Object.keys(header).forEach((key) => {
      obj[header[key]] = item[key];
    });
    return obj;
  });
  const exportData = () => {
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(list);
    XLSX.utils.book_append_sheet(wb, ws, sheetName);
    XLSX.writeFile(wb, `${fileName}.${type}`, { bookType });
  };
  return { exportData };
}