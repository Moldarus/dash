// src/components/Dashboard/HeatMap.jsx
import React from 'react';
import { Card } from 'react-bootstrap';
import './HeatMap.css';

export default function HeatMap({ data, onCategoryClick, hideLegend = false }) {
  const COLORS = {
    white: '#ffffff',
    black: '#000000',
    darkBlue: '#1a3a5c',
    brightGreen: '#92D050',
    brightRed: '#C0504D',
    lightBlue: '#e3f2fd'
  };

  const getHeatMapColor = (selfAudit, audit) => {
    if (audit >= selfAudit) return COLORS.brightGreen;
    if (audit < selfAudit) return COLORS.brightRed;
    return COLORS.lightBlue;
  };

  const getDynamicsColor = (value) => {
    return value >= 0 ? COLORS.brightGreen : COLORS.brightRed;
  };

  const getTextColor = (bgColor) => {
    if (bgColor === COLORS.lightBlue) return COLORS.darkBlue;
    return COLORS.white;
  };

  const allCategories = [];
  data.forEach((section) => {
    section.categories.forEach((cat) => {
      allCategories.push({
        name: cat.name,
        value: cat.value ?? 0,
        auditValue: cat.auditValue ?? 0,
        sectionName: section.sectionName,
        selfAuditCount: cat.trueCount || 0,
        auditCount: cat.auditCount || 0,
        totalQuestions: cat.totalQuestions || 0
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
                <th key={`table${tableIndex}-cat${catIndex}`} className="category-header">
                  <span>{cat.name}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr className="data-row">
              <td className="row-label">Самооценка завода</td>
              {categories.map((cat, catIndex) => (
                <td
                  key={`self-table${tableIndex}-cat${catIndex}`}
                  className="data-cell self-audit"
                  style={{ cursor: 'pointer' }}
                  onClick={() => onCategoryClick && onCategoryClick({
                    name: cat.name,
                    selfAudit: cat.value,
                    auditValue: cat.auditValue,
                    sectionName: cat.sectionName,
                    selfAuditCount: cat.selfAuditCount,
                    auditCount: cat.auditCount,
                    totalQuestions: cat.totalQuestions
                  })}
                >
                  {(cat.value ?? 0).toFixed(2)}
                </td>
              ))}
            </tr>

            <tr className="data-row audit-row">
              <td className="row-label">Результат аудита</td>
              {categories.map((cat, catIndex) => {
                const catSelfAudit = cat.value ?? 0;
                const catAudit = cat.auditValue ?? 0;
                const bgColor = getHeatMapColor(catSelfAudit, catAudit);

                return (
                  <td
                    key={`audit-table${tableIndex}-cat${catIndex}`}
                    className="data-cell audit-result"
                    style={{ backgroundColor: bgColor, cursor: 'pointer', color: getTextColor(bgColor) }}
                    onClick={() => onCategoryClick && onCategoryClick({
                      name: cat.name,
                      selfAudit: cat.value,
                      auditValue: cat.auditValue,
                      sectionName: cat.sectionName,
                      selfAuditCount: cat.selfAuditCount,
                      auditCount: cat.auditCount,
                      totalQuestions: cat.totalQuestions
                    })}
                  >
                    {catAudit.toFixed(2)}
                  </td>
                );
              })}
            </tr>

            <tr className="data-row dynamics-row">
              <td className="row-label">Динамика</td>
              {categories.map((cat, catIndex) => {
                const catSelfAudit = cat.value ?? 0;
                const catAudit = cat.auditValue ?? 0;
                const catDynamics = catAudit - catSelfAudit;
                const bgColor = getDynamicsColor(catDynamics);

                return (
                  <td
                    key={`dynamics-table${tableIndex}-cat${catIndex}`}
                    className="data-cell dynamics"
                    style={{ backgroundColor: bgColor, cursor: 'pointer', color: COLORS.white }}
                    onClick={() => onCategoryClick && onCategoryClick({
                      name: cat.name,
                      selfAudit: cat.value,
                      auditValue: cat.auditValue,
                      sectionName: cat.sectionName,
                      selfAuditCount: cat.selfAuditCount,
                      auditCount: cat.auditCount,
                      totalQuestions: cat.totalQuestions
                    })}
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
        <div className="table-block">
          <h5 className="table-block-title">Таблица 1</h5>
          {renderTableHalf(firstHalf, 1)}
        </div>
        <div className="table-block">
          <h5 className="table-block-title">Таблица 2</h5>
          {renderTableHalf(secondHalf, 2)}
        </div>
      </Card.Body>

      {!hideLegend && (
        <Card.Footer style={{
          background: '#f8f9fa',
          padding: '20px 30px',
          border: 'none',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '16px', color: '#666', fontWeight: '700', marginBottom: '15px' }}>
            <strong>Условные обозначения:</strong>
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
                width: '32px',
                height: '32px',
                background: COLORS.lightBlue,
                color: COLORS.darkBlue,
                fontWeight: 'bold',
                textAlign: 'center',
                lineHeight: '32px',
                borderRadius: '4px',
                fontSize: '14px',
                whiteSpace: 'nowrap'
              }}>0.00</span>
              <span style={{ fontFamily: 'Arial, sans-serif', fontWeight: '700', whiteSpace: 'nowrap' }}>Самооценка завода</span>
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
                width: '32px',
                height: '32px',
                background: COLORS.brightGreen,
                color: COLORS.white,
                fontWeight: 'bold',
                textAlign: 'center',
                lineHeight: '32px',
                borderRadius: '4px',
                fontSize: '14px',
                whiteSpace: 'nowrap'
              }}>0.00</span>
              <span style={{ fontFamily: 'Arial, sans-serif', fontWeight: '700', whiteSpace: 'nowrap' }}>Аудит ≥ Самоаудита / Динамика ≥ 0</span>
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
                width: '32px',
                height: '32px',
                background: COLORS.brightRed,
                color: COLORS.white,
                fontWeight: 'bold',
                textAlign: 'center',
                lineHeight: '32px',
                borderRadius: '4px',
                fontSize: '14px',
                whiteSpace: 'nowrap'
              }}>0.00</span>
              <span style={{ fontFamily: 'Arial, sans-serif', fontWeight: '700', whiteSpace: 'nowrap' }}>Аудит &lt; Самоаудита / Динамика &lt; 0</span>
            </span>
          </div>
          <div className="mt-3 text-muted small">
            <i className="fas fa-mouse-pointer me-1"></i> Кликните по любой ячейке для деталей
          </div>
        </Card.Footer>
      )}
    </Card>
  );
}