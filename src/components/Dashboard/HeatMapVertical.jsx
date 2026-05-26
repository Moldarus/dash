// src/components/Dashboard/HeatMapVertical.jsx
import React from 'react';
import { Card } from 'react-bootstrap';

export default function HeatMapVertical({ data, hideLegend = false }) {
  const COLORS = {
    white: '#ffffff',
    black: '#000000',
    darkBlue: '#1a3a5c',
    brightGreen: '#92D050',
    brightRed: '#C0504D',
    lightBlue: '#e3f2fd'
  };

  // НОВОЕ ПРАВИЛО: зелёный если аудит >= самооценки (включая равенство)
  const getHeatMapColor = (selfAudit, audit) => {
    if (audit >= selfAudit) return COLORS.brightGreen;
    if (audit < selfAudit) return COLORS.brightRed;
    return COLORS.lightBlue;
  };

  const getTextColor = (bgColor) => {
    if (bgColor === COLORS.lightBlue) return COLORS.darkBlue;
    return COLORS.white;
  };

  // Подготовка данных: каждый пункт — это строка
  const rows = [];
  data.forEach((section) => {
    // Заголовок раздела
    rows.push({
      isHeader: true,
      name: section.sectionName,
      selfAudit: null,
      auditValue: null,
      coefficient: section.coefficient
    });

    // Категории раздела
    section.categories.forEach((cat) => {
      rows.push({
        isHeader: false,
        name: cat.name,
        selfAudit: cat.value ?? 0,
        auditValue: cat.auditValue ?? 0,
        sectionName: section.sectionName
      });
    });
  });

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
          fontFamily: 'Arial, sans-serif'
        }}
      >
        Тепловая карта результатов аудита
      </Card.Header>
      <Card.Body className="p-0">
        <div style={{ overflowX: 'auto' }}>
          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
            fontFamily: 'Arial, sans-serif',
            fontSize: '12px'
          }}>
            <thead>
              <tr style={{ background: COLORS.darkBlue, color: COLORS.white }}>
                <th style={{ padding: '12px', border: '1px solid #dee2e6', textAlign: 'left', minWidth: '250px' }}>
                  Категория / Показатель
                </th>
                <th style={{ padding: '12px', border: '1px solid #dee2e6', textAlign: 'center', minWidth: '100px' }}>
                  Самооценка
                </th>
                <th style={{ padding: '12px', border: '1px solid #dee2e6', textAlign: 'center', minWidth: '100px' }}>
                  Результат аудита
                </th>
                <th style={{ padding: '12px', border: '1px solid #dee2e6', textAlign: 'center', minWidth: '100px' }}>
                  Динамика
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, idx) => {
                if (row.isHeader) {
                  return (
                    <tr key={idx} style={{ background: COLORS.lightBlue }}>
                      <td style={{ padding: '10px', border: '1px solid #dee2e6', fontWeight: 'bold', color: COLORS.darkBlue }}>
                        {row.name}
                        <span style={{ fontSize: '11px', marginLeft: '10px', fontWeight: 'normal' }}>
                          (коэф. {row.coefficient})
                        </span>
                      </td>
                      <td style={{ padding: '10px', border: '1px solid #dee2e6', textAlign: 'center', background: COLORS.lightBlue }}>—</td>
                      <td style={{ padding: '10px', border: '1px solid #dee2e6', textAlign: 'center', background: COLORS.lightBlue }}>—</td>
                      <td style={{ padding: '10px', border: '1px solid #dee2e6', textAlign: 'center', background: COLORS.lightBlue }}>—</td>
                    </tr>
                  );
                }

                const dynamics = row.auditValue - row.selfAudit;
                const bgColor = getHeatMapColor(row.selfAudit, row.auditValue);

                return (
                  <tr key={idx}>
                    <td style={{ padding: '10px', border: '1px solid #dee2e6', paddingLeft: '25px' }}>
                      {row.name}
                    </td>
                    <td style={{
                      padding: '10px',
                      border: '1px solid #dee2e6',
                      textAlign: 'center',
                      background: COLORS.lightBlue,
                      color: COLORS.darkBlue
                    }}>
                      {row.selfAudit.toFixed(2)}
                    </td>
                    <td style={{
                      padding: '10px',
                      border: '1px solid #dee2e6',
                      textAlign: 'center',
                      backgroundColor: bgColor,
                      color: getTextColor(bgColor),
                      fontWeight: 'bold'
                    }}>
                      {row.auditValue.toFixed(2)}
                    </td>
                    <td style={{
                      padding: '10px',
                      border: '1px solid #dee2e6',
                      textAlign: 'center',
                      backgroundColor: dynamics >= 0 ? COLORS.brightGreen : COLORS.brightRed,
                      color: COLORS.white,
                      fontWeight: 'bold'
                    }}>
                      {dynamics >= 0 ? '+' : ''}{dynamics.toFixed(2)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card.Body>

      {!hideLegend && (
        <Card.Footer style={{
          background: '#f8f9fa',
          padding: '15px 20px',
          border: 'none',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '13px', fontWeight: 'bold', marginBottom: '10px' }}>Условные обозначения:</div>
          <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', justifyContent: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: '16px', height: '16px', background: COLORS.lightBlue, border: '1px solid #1a3a5c' }}></div>
              <span style={{ fontSize: '11px' }}>Самооценка</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: '16px', height: '16px', background: COLORS.brightGreen }}></div>
              <span style={{ fontSize: '11px' }}>Аудит ≥ Самоаудита</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: '16px', height: '16px', background: COLORS.brightRed }}></div>
              <span style={{ fontSize: '11px' }}>Аудит &lt; Самоаудита</span>
            </div>
          </div>
        </Card.Footer>
      )}
    </Card>
  );
}