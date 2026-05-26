// src/utils/exportToExcelAdvanced.js
import * as XLSX from 'xlsx';

// Функция для экспорта радарной диаграммы (числовые значения по разделам)
export const exportRadarToExcel = (chartData, plantName) => {
  const worksheetData = chartData.map(item => ({
    'Раздел': item.name,
    'Самоаудит': item.value1.toFixed(2),
    'Аудит': item.value2.toFixed(2),
    'Разница': (item.value2 - item.value1).toFixed(2)
  }));

  const ws = XLSX.utils.json_to_sheet(worksheetData);

  // Заголовок таблицы
  ws['A1'] = { v: `Сравнение по разделам - ${plantName}`, t: 's' };

  // Настройка ширины колонок
  ws['!cols'] = [
    { wch: 35 },  // Раздел
    { wch: 12 },  // Самоаудит
    { wch: 12 },  // Аудит
    { wch: 12 }   // Разница
  ];

  return ws;
};

// Функция для экспорта столбчатой диаграммы (закрытые мероприятия)
export const exportBarChartToExcel = (closedTasksData, plantName) => {
  const worksheetData = closedTasksData.map(item => ({
    'Раздел': item.name,
    'Самоаудит': item.selfAuditCount || 0,
    'Аудит': item.auditCount || 0,
    'Разница': ((item.auditCount || 0) - (item.selfAuditCount || 0)).toFixed(0)
  }));

  const ws = XLSX.utils.json_to_sheet(worksheetData);

  // Заголовок таблицы
  ws['A1'] = { v: `Сравнение закрытых мероприятий - ${plantName}`, t: 's' };

  // Настройка ширины колонок
  ws['!cols'] = [
    { wch: 35 },  // Раздел
    { wch: 15 },  // Самоаудит
    { wch: 12 },  // Аудит
    { wch: 12 }   // Разница
  ];

  return ws;
};

// Функция для экспорта тепловой карты (все категории с пометками, без смайликов)
export const exportHeatMapToExcel = (tableData, plantName) => {
  const worksheetData = [];

  // Заголовок
  worksheetData.push({
    'Категория': `Тепловая карта результатов аудита - ${plantName}`,
    'Самоаудит': '',
    'Аудит': '',
    'Динамика': ''
  });


  // Проходим по всем разделам и категориям
  tableData.forEach((section) => {
    // Заголовок раздела (без коэффициента)
    worksheetData.push({
      'Категория': `${section.sectionName}`,
      'Самоаудит': '',
      'Аудит': '',
      'Динамика': ''
    });

    // Категории внутри раздела
    section.categories.forEach((cat) => {
      const selfAudit = cat.value ?? 0;
      const auditValue = cat.auditValue ?? 0;
      const dynamics = auditValue - selfAudit;

      worksheetData.push({
        'Категория': `  ${cat.name}`,
        'Самоаудит': selfAudit.toFixed(2),
        'Аудит': auditValue.toFixed(2),
        'Динамика': dynamics >= 0 ? `+${dynamics.toFixed(2)}` : dynamics.toFixed(2)
      });
    });

    // Пустая строка между разделами
    worksheetData.push({
      'Категория': '',
      'Самоаудит': '',
      'Аудит': '',
      'Динамика': ''
    });
  });

  const ws = XLSX.utils.json_to_sheet(worksheetData);

  // Настройка ширины колонок
  ws['!cols'] = [
    { wch: 45 },  // Категория
    { wch: 12 },  // Самоаудит
    { wch: 12 },  // Аудит
    { wch: 12 }   // Динамика
  ];

  return ws;
};

// Основная функция экспорта всех трёх листов
export const exportFullToExcel = (chartData, closedTasksData, tableData, plantName) => {
  const workbook = XLSX.utils.book_new();

  // Лист 1: Сравнение по разделам (радарная диаграмма)
  const wsRadar = exportRadarToExcel(chartData, plantName);
  XLSX.utils.book_append_sheet(workbook, wsRadar, 'Сравнение по разделам');

  // Лист 2: Сравнение закрытых мероприятий (столбчатая диаграмма)
  const wsBar = exportBarChartToExcel(closedTasksData, plantName);
  XLSX.utils.book_append_sheet(workbook, wsBar, 'Закрытые мероприятия');

  // Лист 3: Тепловая карта
  const wsHeatMap = exportHeatMapToExcel(tableData, plantName);
  XLSX.utils.book_append_sheet(workbook, wsHeatMap, 'Тепловая карта');

  // Сохраняем файл
  XLSX.writeFile(workbook, `${plantName}_audit_full_report.xlsx`);
};