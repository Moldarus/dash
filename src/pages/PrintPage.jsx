// src/pages/PrintPage.jsx
import React, { useEffect, useState } from 'react';
import { auditApi } from '../api/auditApi';
import RadarChartComponent from '../components/Dashboard/RadarChart';
import GroupedBarChart from '../components/Dashboard/GroupedBarChart';
import HeatMapVertical from '../components/Dashboard/HeatMapVertical';

export default function PrintPage() {
  const [chartData, setChartData] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [closedTasksData, setClosedTasksData] = useState([]);
  const [summary, setSummary] = useState(null);
  const [esteemSummary, setEsteemSummary] = useState(null);
  const [plantInfo, setPlantInfo] = useState(null);
  const [regionInfo, setRegionInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [printReady, setPrintReady] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const storedPlant = localStorage.getItem('selectedPlant');
        const storedRegion = localStorage.getItem('selectedRegion');

        if (!storedPlant) {
          throw new Error('Завод не выбран.');
        }

        const plant = JSON.parse(storedPlant);
        const region = storedRegion ? JSON.parse(storedRegion) : null;

        setPlantInfo(plant);
        if (region) setRegionInfo(region);

        const [chartResult, tableResult, closedTasksResult] = await Promise.all([
          auditApi.getChartData(plant.auditData),
          auditApi.getTableData(plant.auditData),
          auditApi.getClosedTasksData(plant.auditData)
        ]);

        setChartData(chartResult.chartData);
        setTableData(tableResult);
        setClosedTasksData(closedTasksResult);

        const summaryValue = typeof chartResult.summary === 'number'
          ? chartResult.summary
          : parseFloat(chartResult.summary) || 0;

        const esteemSummaryValue = typeof chartResult.esteemSummary === 'number'
          ? chartResult.esteemSummary
          : parseFloat(chartResult.esteemSummary) || 0;

        setSummary(summaryValue);
        setEsteemSummary(esteemSummaryValue);

      } catch (err) {
        console.error('Ошибка загрузки:', err);
      } finally {
        setLoading(false);
        setPrintReady(true);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    if (printReady) {
      setTimeout(() => {
        window.print();
      }, 1000);
    }
  }, [printReady]);

  const radarDataFull = chartData.map(item => ({
    subject: item.name,
    A: item.value2,
    B: item.value1,
    fullMark: 5
  }));

  const totalProgress = esteemSummary !== null ? Math.round((esteemSummary / 5) * 100) : 0;
  const pointsToGoal = summary !== null ? (5 - summary).toFixed(1) : 0;

  const bestSection = chartData.length > 0
    ? chartData.reduce((max, item) => item.value2 > max.value2 ? item : max, chartData[0])
    : null;

  const worstSection = chartData.length > 0
    ? chartData.reduce((min, item) => item.value2 < min.value2 ? item : min, chartData[0])
    : null;

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontFamily: 'Arial, sans-serif'
      }}>
        <div style={{ textAlign: 'center' }}>
          <h2>Подготовка отчёта к печати...</h2>
          <p>Пожалуйста, подождите</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      padding: '30px',
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#ffffff',
      maxWidth: '1600px',
      margin: '0 auto',
      width: '100%'
    }}>
      <style>{`
        @page {
          size: A2 landscape;
          margin: 15mm;
        }

        @media print {
          body {
            background-color: white;
          }
          .no-break {
            page-break-inside: avoid;
          }
        }

        * {
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }
      `}</style>

      {/* Заголовок */}
      <div style={{ textAlign: 'center', marginBottom: '40px', borderBottom: '2px solid #1a3a5c', paddingBottom: '25px' }}>
        <h1 style={{ color: '#1a3a5c', fontSize: '32px', marginBottom: '15px' }}>
          {plantInfo?.name || 'Завод'} — Результаты аудита
        </h1>
        <p style={{ fontSize: '16px', color: '#666' }}>
          {regionInfo?.regionName || ''}, {plantInfo?.city || ''}
        </p>
        <p style={{ fontSize: '14px', color: '#888' }}>
          {plantInfo?.fullName || ''}
        </p>
        <p style={{ fontSize: '12px', color: '#999', marginTop: '10px' }}>
          Дата формирования: {new Date().toLocaleDateString()}
        </p>
      </div>

      {/* Сводные карточки */}
      <div style={{ display: 'flex', gap: '30px', marginBottom: '40px' }}>
        <div style={{ flex: 1, background: '#1a3a5c', color: 'white', padding: '25px', borderRadius: '12px', textAlign: 'center' }}>
          <h3 style={{ fontSize: '20px', marginBottom: '15px' }}>Самоаудит</h3>
          <p style={{ fontSize: '36px', fontWeight: 'bold', margin: 0 }}>
            {summary !== null ? `${Number(summary).toFixed(2)} / 5.00` : '—'}
          </p>
        </div>
        <div style={{ flex: 1, background: '#92D050', color: 'white', padding: '25px', borderRadius: '12px', textAlign: 'center' }}>
          <h3 style={{ fontSize: '20px', marginBottom: '15px' }}>Аудит</h3>
          <p style={{ fontSize: '36px', fontWeight: 'bold', margin: 0 }}>
            {esteemSummary !== null ? `${Number(esteemSummary).toFixed(2)} / 5.00` : '—'}
          </p>
        </div>
      </div>

      {/* KPI Карточки */}
      <div style={{ display: 'flex', gap: '20px', marginBottom: '40px', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, background: '#1a3a5c', color: 'white', padding: '20px', borderRadius: '10px', textAlign: 'center', minWidth: '200px' }}>
          <h4 style={{ fontSize: '16px', marginBottom: '10px' }}>Общий прогресс</h4>
          <p style={{ fontSize: '32px', fontWeight: 'bold', margin: 0 }}>{totalProgress}%</p>
          <small style={{ fontSize: '12px' }}>от целевого 5.00</small>
        </div>
        <div style={{ flex: 1, background: '#e3f2fd', color: '#1a3a5c', padding: '20px', borderRadius: '10px', textAlign: 'center', minWidth: '200px', border: '1px solid #1a3a5c' }}>
          <h4 style={{ fontSize: '16px', marginBottom: '10px' }}>До цели</h4>
          <p style={{ fontSize: '32px', fontWeight: 'bold', margin: 0 }}>{pointsToGoal}</p>
          <small style={{ fontSize: '12px' }}>баллов осталось</small>
        </div>
        <div style={{ flex: 1, background: '#e3f2fd', color: '#1a3a5c', padding: '20px', borderRadius: '10px', textAlign: 'center', minWidth: '200px', border: '1px solid #1a3a5c' }}>
          <h4 style={{ fontSize: '16px', marginBottom: '10px' }}>Раздел-лидер</h4>
          <p style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>{bestSection ? bestSection.value2.toFixed(2) : 0} / 5.00</p>
          <small style={{ fontSize: '12px' }}>{bestSection ? bestSection.name.substring(0, 30) : 'Н/Д'}</small>
        </div>
        <div style={{ flex: 1, background: '#C0504D', color: 'white', padding: '20px', borderRadius: '10px', textAlign: 'center', minWidth: '200px' }}>
          <h4 style={{ fontSize: '16px', marginBottom: '10px' }}>Зона роста</h4>
          <p style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>{worstSection ? worstSection.value2.toFixed(2) : 0} / 5.00</p>
          <small style={{ fontSize: '12px' }}>{worstSection ? worstSection.name.substring(0, 30) : 'Н/Д'}</small>
        </div>
      </div>

      {/* График 1: Сравнение по разделам */}
      <div style={{ marginBottom: '60px', pageBreakInside: 'avoid', clear: 'both', width: '100%' }}>
        <h2 style={{ color: '#1a3a5c', marginBottom: '20px', fontSize: '22px', borderLeft: '4px solid #92D050', paddingLeft: '15px' }}>
          1. Сравнение по разделам
        </h2>
        <RadarChartComponent data={radarDataFull} isPrintMode={true} />
      </div>

      {/* График 2: Сравнение закрытых мероприятий */}
      <div style={{ marginBottom: '60px', pageBreakInside: 'avoid', clear: 'both', width: '100%' }}>
        <h2 style={{ color: '#1a3a5c', marginBottom: '20px', fontSize: '22px', borderLeft: '4px solid #92D050', paddingLeft: '15px' }}>
          2. Сравнение закрытых мероприятий
        </h2>
        <GroupedBarChart data={closedTasksData} isPrintMode={true} />
      </div>

      {/* Тепловая карта */}
      <div style={{ marginBottom: '40px', pageBreakInside: 'avoid', clear: 'both', width: '100%' }}>
        <h2 style={{ color: '#1a3a5c', marginBottom: '20px', fontSize: '22px', borderLeft: '4px solid #92D050', paddingLeft: '15px' }}>
          3. Тепловая карта результатов аудита
        </h2>
        <HeatMapVertical data={tableData} hideLegend={false} />
      </div>

      {/* Нижний колонтитул */}
      <div style={{ marginTop: '40px', paddingTop: '20px', borderTop: '1px solid #dee2e6', textAlign: 'center', fontSize: '11px', color: '#999' }}>
        <p>АО «Желдорреммаш» — Система цифрового аудита | Все данные конфиденциальны</p>
      </div>
    </div>
  );
}