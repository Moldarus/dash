// src/components/Dashboard/HeatMap.jsx
import React from 'react';
import { Card } from 'react-bootstrap';
import './HeatMap.css';

export default function HeatMap({ data }) {
  // Цвета по ТЗ
  const COLORS = {
    white: '#ffffff',
    black: '#000000',
    darkBlue: '#1a3a5c',
    brightGreen: '#92D050',
    brightRed: '#ED1D24',
    lightBlue: '#e3f2fd'
  };

  // Собираем все категории в один массив
  const allCategories = [];
  data.forEach((section) => {
    section.categories.forEach((cat) => {
      allCategories.push({
        name: cat.name,
        value: cat.value ?? 0,
        auditValue: cat.auditValue ?? 0
      });
    });
  });

  const midpoint = Math.ceil(allCategories.length / 2);
  const firstHalf = allCategories.slice(0, midpoint);
  const secondHalf = allCategories.slice(midpoint);

  const renderTableHalf = (categories, tableIndex) => (
    <div key={`table-${tableIndex}`} className="heatmap-table-container" style={{ marginBottom: '40px' }}>
      <div className="heatmap-wrapper">
        <table className="heatmap-table">
          <thead>
            <tr>
              <th className="criteria-header">Критерий</th>
              {categories.map((cat, catIndex) => (
                <th
                  key={`table${tableIndex}-cat${catIndex}`}
                  className="category-header"
                >
                  {/* <span> для вертикального текста */}
                  <span>{cat.name}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {/* Row 1: Самооценка завода */}
            <tr className="data-row">
              <td className="row-label">Самооценка завода</td>
              {categories.map((cat, catIndex) => (
                <td
                  key={`self-table${tableIndex}-cat${catIndex}`}
                  className="data-cell self-audit"
                >
                  {(cat.value ?? 0).toFixed(2)}
                </td>
              ))}
            </tr>

            {/* Row 2: Результат аудита */}
            <tr className="data-row audit-row">
              <td className="row-label">Результат аудита</td>
              {categories.map((cat, catIndex) => {
                const catSelfAudit = cat.value ?? 0;
                const catAudit = cat.auditValue ?? 0;
                const bgColor = catAudit >= catSelfAudit && catAudit !== catSelfAudit
                  ? COLORS.brightGreen
                  : COLORS.brightRed;
                
                return (
                  <td 
                    key={`audit-table${tableIndex}-cat${catIndex}`}
                    className="data-cell audit-result"
                    style={{ backgroundColor: bgColor }}
                  >
                    {catAudit.toFixed(2)}
                  </td>
                );
              })}
            </tr>

            {/* Row 3: Динамика относительно самооценки */}
            <tr className="data-row dynamics-row">
              <td className="row-label">Динамика относительно самооценки</td>
              {categories.map((cat, catIndex) => {
                const catSelfAudit = cat.value ?? 0;
                const catAudit = cat.auditValue ?? 0;
                const catDynamics = catAudit - catSelfAudit;
                const bgColor = catDynamics >= 0 ? COLORS.brightGreen : COLORS.brightRed;
                
                return (
                  <td 
                    key={`dynamics-table${tableIndex}-cat${catIndex}`}
                    className="data-cell dynamics"
                    style={{ backgroundColor: bgColor }}
                  >
                    {catDynamics >= 0 ? '+' : ''}{catDynamics.toFixed(2)}
                  </td>
                );
              })}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <Card style={{
      border: 'none',
      borderRadius: '8px',
      overflow: 'visible'
    }}>
      <Card.Header
        style={{
          background: COLORS.darkBlue,
          color: COLORS.white,
          padding: '15px 20px',
          fontSize: '18px',
          fontWeight: '700',
          fontFamily: 'Arial, sans-serif',
          marginBottom: '30px'
        }}
      >
        Тепловая карта результатов аудита
      </Card.Header>
      <Card.Body className="p-0">
        {/* Таблица 1 - первая половина */}
        <div className="table-block">
          <h5 className="table-block-title">Таблица 1</h5>
          {renderTableHalf(firstHalf, 1)}
        </div>

        {/* Таблица 2 - вторая половина */}
        <div className="table-block">
          <h5 className="table-block-title">Таблица 2</h5>
          {renderTableHalf(secondHalf, 2)}
        </div>
      </Card.Body>

      {/*Легенда */}
      <Card.Footer style={{ 
        background: '#f8f9fa', 
        padding: '20px 30px', 
        border: 'none',
        textAlign: 'center'
      }}>
        <div style={{ 
          fontSize: '16px', 
          color: '#666', 
          fontFamily: 'Arial, sans-serif',
          fontWeight: '700',
          marginBottom: '15px'
        }}>
          <strong>Условные обозначения: </strong>
        </div>
        <div className="d-flex flex-wrap gap-4 justify-content-center" style={{ fontSize: '16px' }}>
          <span style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: '8px',
            padding: '8px 16px',
            background: '#ffffff',
            borderRadius: '6px',
            border: '1px solid #dee2e6'
          }}>
            <span style={{ 
              display: 'inline-block', 
              width: '28px',
              height: '28px',
              background: COLORS.lightBlue, 
              color: COLORS.darkBlue,
              fontWeight: 'bold',
              textAlign: 'center',
              lineHeight: '28px',
              borderRadius: '4px',
              fontSize: '14px'
            }}>0.00</span>
            <span style={{ fontFamily: 'Arial, sans-serif', fontWeight: '700' }}>Самооценка завода</span>
          </span>
          <span style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: '8px',
            padding: '8px 16px',
            background: '#ffffff',
            borderRadius: '6px',
            border: '1px solid #dee2e6'
          }}>
            <span style={{ 
              display: 'inline-block', 
              width: '28px',
              height: '28px',
              background: COLORS.brightGreen, 
              color: COLORS.white,
              fontWeight: 'bold',
              textAlign: 'center',
              lineHeight: '28px',
              borderRadius: '4px',
              fontSize: '14px'
            }}>0.00</span>
            <span style={{ fontFamily: 'Arial, sans-serif', fontWeight: '700' }}>Аудит ≥ Самоаудита / Динамика ≥ 0</span>
          </span>
          <span style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: '8px',
            padding: '8px 16px',
            background: '#ffffff',
            borderRadius: '6px',
            border: '1px solid #dee2e6'
          }}>
            <span style={{ 
              display: 'inline-block', 
              width: '28px',
              height: '28px',
              background: COLORS.brightRed, 
              color: COLORS.white,
              fontWeight: 'bold',
              textAlign: 'center',
              lineHeight: '28px',
              borderRadius: '4px',
              fontSize: '14px'
            }}>0.00</span>
            <span style={{ fontFamily: 'Arial, sans-serif', fontWeight: '700' }}>Аудит &lt; Самоаудита / Динамика &lt; 0</span>
          </span>
        </div>
      </Card.Footer>
    </Card>
  );
}