// src/components/Dashboard/GroupedBarChart.jsx
import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, LabelList } from 'recharts';
import '../../pages/DashboardPage.css';

export default function GroupedBarChart({ data, isPrintMode = false }) {
  const [isPrinting, setIsPrinting] = useState(false);

  useEffect(() => {
    const beforePrint = () => setIsPrinting(true);
    const afterPrint = () => setIsPrinting(false);

    window.addEventListener('beforeprint', beforePrint);
    window.addEventListener('afterprint', afterPrint);

    return () => {
      window.removeEventListener('beforeprint', beforePrint);
      window.removeEventListener('afterprint', afterPrint);
    };
  }, []);

  const printMode = isPrintMode || isPrinting;

  const COLORS = {
    brightGreen: '#92D050',
    brightRed: '#C0504D',
    darkBlue: '#1a3a5c',
    darkGray: '#6c757d',
    white: '#ffffff'
  };

  const renderCustomizedXAxisTick = (props) => {
    const { x, y, payload } = props;
    const label = payload.value;

    if (label === 'Подготовка производства') {
      return (
        <g>
          <text x={x} y={y} dy={15} textAnchor="middle" fill={COLORS.darkBlue} fontSize={printMode ? "14" : "11"} fontWeight="700">
            <tspan x={x} dy="0">Подготовка</tspan>
            <tspan x={x} dy={printMode ? "18" : "14"}>производства</tspan>
          </text>
        </g>
      );
    }

    if (label === 'SF-m Ручные операции') {
      return (
        <g>
          <text x={x} y={y} dy={15} textAnchor="middle" fill={COLORS.darkBlue} fontSize={printMode ? "14" : "11"} fontWeight="700">
            <tspan x={x} dy="0">SF-m Ручные</tspan>
            <tspan x={x} dy={printMode ? "18" : "14"}>операции</tspan>
          </text>
        </g>
      );
    }

    if (label === 'Техническое развитие') {
      return (
        <g>
          <text x={x} y={y} dy={15} textAnchor="middle" fill={COLORS.darkBlue} fontSize={printMode ? "14" : "11"} fontWeight="700">
            <tspan x={x} dy="0">Техническое</tspan>
            <tspan x={x} dy={printMode ? "18" : "14"}>развитие</tspan>
          </text>
        </g>
      );
    }

    if (label === 'Цепочка поставок') {
      return (
        <g>
          <text x={x} y={y} dy={15} textAnchor="middle" fill={COLORS.darkBlue} fontSize={printMode ? "14" : "11"} fontWeight="700">
            <tspan x={x} dy="0">Цепочка</tspan>
            <tspan x={x} dy={printMode ? "18" : "14"}>поставок</tspan>
          </text>
        </g>
      );
    }

    return (
      <g>
        <text x={x} y={y} dy={15} textAnchor="middle" fill={COLORS.darkBlue} fontSize={printMode ? "14" : "11"} fontWeight="700">
          {label}
        </text>
      </g>
    );
  };

  const chartData = data.map((item) => {
    const selfAudit = item.selfAuditCount || 0;
    const audit = item.auditCount || 0;

    return {
      name: item.name,
      selfAudit: selfAudit,
      audit: audit,
      auditColor: audit >= selfAudit ? COLORS.brightGreen : COLORS.brightRed
    };
  });

  return (
    <div style={{
      width: '100%',
      height: printMode ? '700px' : '500px',
      background: COLORS.white,
      borderRadius: '12px',
      padding: printMode ? '25px' : '15px',
      border: `1px solid ${COLORS.darkBlue}`,
      display: 'flex',
      flexDirection: 'column',
      boxSizing: 'border-box'
    }}>
      <h4 className="chart-title" style={{
        margin: '0 0 15px 0',
        fontSize: printMode ? '22px' : '16px',
        fontWeight: '700',
        color: COLORS.darkBlue,
        textAlign: 'center'
      }}>
        Сравнение закрытых мероприятий
      </h4>

      <div style={{ flex: 1, minHeight: 0 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 40, right: 30, left: 10, bottom: 90 }}
            barGap={12}
            barSize={printMode ? 55 : 40}
          >
            <CartesianGrid stroke="#e0e0e0" strokeDasharray="3 3" horizontal={true} vertical={false} />

            <XAxis
              dataKey="name"
              angle={0}
              interval={0}
              height={100}
              tick={renderCustomizedXAxisTick}
              tickMargin={15}
              axisLine={{ stroke: COLORS.darkBlue, strokeWidth: 1 }}
              tickLine={false}
            />

            {/* YAxis полностью скрыт */}
            <YAxis hide={true} />

            <Tooltip
              contentStyle={{
                background: COLORS.white,
                border: `1px solid ${COLORS.darkBlue}`,
                borderRadius: '8px',
                fontSize: printMode ? '14px' : '11px'
              }}
              formatter={(value, name) => {
                if (name === 'Аудит') return [value, 'Аудит'];
                if (name === 'Самоаудит') return [value, 'Самоаудит'];
                return [value, name];
              }}
            />

            {/* Столбцы аудита */}
            <Bar
              name="Аудит"
              dataKey="audit"
              barSize={printMode ? 55 : 40}
              shape={(props) => {
                const { fill, x, y, width, height } = props;
                const radius = 8;
                return (
                  <path
                    d={`
                      M ${x + radius}, ${y}
                      L ${x + width - radius}, ${y}
                      Q ${x + width}, ${y} ${x + width}, ${y + radius}
                      L ${x + width}, ${y + height}
                      L ${x}, ${y + height}
                      L ${x}, ${y + radius}
                      Q ${x}, ${y} ${x + radius}, ${y}
                      Z
                    `}
                    fill={fill}
                    stroke="none"
                  />
                );
              }}
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`audit-${index}`}
                  fill={entry.auditColor}
                />
              ))}
              <LabelList
                dataKey="audit"
                position="top"
                fill={COLORS.darkBlue}
                fontSize={printMode ? 18 : 12}
                fontWeight={700}
                formatter={(value) => value}
                offset={5}
              />
            </Bar>

            {/* Столбцы самоаудита */}
            <Bar
              name="Самоаудит"
              dataKey="selfAudit"
              fill={COLORS.darkGray}
              barSize={printMode ? 55 : 40}
              shape={(props) => {
                const { x, y, width, height } = props;
                const radius = 8;
                return (
                  <path
                    d={`
                      M ${x + radius}, ${y}
                      L ${x + width - radius}, ${y}
                      Q ${x + width}, ${y} ${x + width}, ${y + radius}
                      L ${x + width}, ${y + height}
                      L ${x}, ${y + height}
                      L ${x}, ${y + radius}
                      Q ${x}, ${y} ${x + radius}, ${y}
                      Z
                    `}
                    fill={COLORS.darkGray}
                    stroke="none"
                  />
                );
              }}
            >
              <LabelList
                dataKey="selfAudit"
                position="top"
                fill={COLORS.darkBlue}
                fontSize={printMode ? 18 : 12}
                fontWeight={700}
                formatter={(value) => value}
                offset={5}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Легенда */}
      <div style={{
        marginTop: '15px',
        paddingTop: '12px',
        paddingBottom: '5px',
        borderTop: `1px solid ${COLORS.darkBlue}`,
        display: 'flex',
        justifyContent: 'center',
        gap: '30px',
        flexWrap: 'wrap',
        flexShrink: 0
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '18px', height: '18px', backgroundColor: COLORS.brightGreen, borderRadius: '4px' }}></div>
          <span style={{ color: COLORS.darkBlue, fontSize: printMode ? '14px' : '12px', fontWeight: '600' }}>Аудит ≥ Самоаудита</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '18px', height: '18px', backgroundColor: COLORS.brightRed, borderRadius: '4px' }}></div>
          <span style={{ color: COLORS.darkBlue, fontSize: printMode ? '14px' : '12px', fontWeight: '600' }}>Аудит &lt; Самоаудита</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '18px', height: '18px', backgroundColor: COLORS.darkGray, borderRadius: '4px' }}></div>
          <span style={{ color: COLORS.darkBlue, fontSize: printMode ? '14px' : '12px', fontWeight: '600' }}>Самоаудит</span>
        </div>
      </div>
    </div>
  );
}