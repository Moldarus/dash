// src/utils/exportToExcel.js
import * as XLSX from 'xlsx';

export const exportToExcel = (data, filename = 'audit_report.xlsx') => {
  const worksheetData = data.map(section => ({
    'Раздел': section.sectionName,
    'Самооценка завода': section.sectionValue1,
    'Результат аудита': section.sectionValue2,
    'Коэффициент': section.coefficient
  }));

  const ws = XLSX.utils.json_to_sheet(worksheetData);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Результаты аудита');
  XLSX.writeFile(wb, filename);
};