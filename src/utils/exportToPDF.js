// src/utils/exportToPDF.js
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export const exportDashboardToPDF = async (filename = 'dashboard-report.pdf') => {
  // Открываем новое окно с PrintPage
  const printWindow = window.open('/print', '_blank');

  if (!printWindow) {
    alert('Пожалуйста, разрешите всплывающие окна для этого сайта');
    return;
  }

  // Ждём загрузки страницы
  printWindow.onload = () => {
    setTimeout(() => {
      printWindow.print();
    }, 1000);
  };
};