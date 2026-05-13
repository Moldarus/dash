// src/components/Dashboard/GroupedBarChart.jsx
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, LabelList } from 'recharts';
import '../../pages/DashboardPage.css';

export default function GroupedBarChart({ data }) {
  const COLORS = {
    brightGreen: '#92D050',
    brightRed: '#C0504D',
    darkBlue: '#1a3a5c',
    lightBlue: '#e3f2fd',
    gray: '#6c757d'
  };

  const renderCustomizedXAxisTick = (props) => {
    const { x, y, payload } = props;
    const label = payload.value;
    
    if (label === 'Подготовка производства') {
      return (
        <g>
          <text x={x} y={y} dy={15} textAnchor="middle" fill={COLORS.darkBlue} fontSize="18" fontWeight="700">
            <tspan x={x} dy="0">Подготовка</tspan>
            <tspan x={x} dy="22">производства</tspan>
          </text>
        </g>
      );
    }
    
    if (label === 'SF-m Ручные операции') {
      return (
        <g>
          <text x={x} y={y} dy={15} textAnchor="middle" fill={COLORS.darkBlue} fontSize="18" fontWeight="700">
            <tspan x={x} dy="0">SF-m Ручные</tspan>
            <tspan x={x} dy="22">операции</tspan>
          </text>
        </g>
      );
    }
    
    if (label === 'Техническое развитие') {
      return (
        <g>
          <text x={x} y={y} dy={15} textAnchor="middle" fill={COLORS.darkBlue} fontSize="18" fontWeight="700">
            <tspan x={x} dy="0">Техническое</tspan>
            <tspan x={x} dy="22">развитие</tspan>
          </text>
        </g>
      );
    }
    
    if (label === 'Цепочка поставок') {
      return (
        <g>
          <text x={x} y={y} dy={15} textAnchor="middle" fill={COLORS.darkBlue} fontSize="18" fontWeight="700">
            <tspan x={x} dy="0">Цепочка</tspan>
            <tspan x={x} dy="22">поставок</tspan>
          </text>
        </g>
      );
    }
    
    return (
      <g>
        <text x={x} y={y} dy={15} textAnchor="middle" fill={COLORS.darkBlue} fontSize="18" fontWeight="700">
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
      height: '650px',
      background: '#ffffff', 
      borderRadius: '12px', 
      padding: '20px', 
      border: '1px solid #dee2e6' 
    }}>
      <h4 className="chart-title" style={{ margin: '0 0 15px 0', fontSize: '18px', fontWeight: '700', color: COLORS.darkBlue }}>
        Сравнение закрытых мероприятий
      </h4>
      
      <div style={{ height: 'calc(100% - 60px)', minHeight: '300px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart 
            data={chartData} 
            margin={{ top: 40, right: 30, left: 10, bottom: 80 }}
            barGap={12}
            barSize={60}
          >
            <CartesianGrid stroke="none" />
            
            <XAxis 
              dataKey="name" 
              angle={0}
              interval={0}
              height={100}
              tick={renderCustomizedXAxisTick}
              tickMargin={10}
              axisLine={{ stroke: '#dee2e6', strokeWidth: 1 }}
              tickLine={false}
            />
            
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={false}
            />
            
            {/* ✅ Tooltip: ТОЧНО как в RadarChart */}
            <Tooltip 
              contentStyle={{ 
                background: '#fff', 
                border: '1px solid #dee2e6', 
                borderRadius: '8px',
                fontSize: '18px',
                fontFamily: "'Magistral Black', 'Arial', sans-serif"
              }}
            />
            
            {/* Столбец Самоаудит - СЕРЫЙ цвет + скруглённые углы */}
            <Bar name="Самоаудит" dataKey="selfAudit" fill={COLORS.gray} barSize={60}>
              {chartData.map((entry, index) => (
                <Cell 
                  key={`self-${index}`} 
                  radius={[10, 10, 0, 0]}
                />
              ))}
              <LabelList 
                dataKey="selfAudit" 
                position="top" 
                fill={COLORS.darkBlue}
                fontSize={20}
                fontWeight={700}
                formatter={(value) => value}
              />
            </Bar>
            
            {/* Столбец Аудит - Зелёный/Красный + скруглённые углы */}
            <Bar name="Аудит" dataKey="audit" barSize={60}>
              {chartData.map((entry, index) => (
                <Cell 
                  key={`audit-${index}`} 
                  fill={entry.auditColor}
                  radius={[10, 10, 0, 0]}
                />
              ))}
              <LabelList 
                dataKey="audit" 
                position="top" 
                fill={COLORS.darkBlue}
                fontSize={20}
                fontWeight={700}
                formatter={(value) => value}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      <div className="legend-text" style={{ marginTop: '15px', textAlign: 'center', fontSize: '14px', fontWeight: '700' }}>
        <span style={{ color: COLORS.brightGreen }}>●</span> Аудит ≥ Самоаудита &nbsp;
        <span style={{ color: COLORS.brightRed }}>●</span> Аудит &lt; Самоаудита &nbsp;
        <span style={{ color: COLORS.gray }}>●</span> Самоаудит
      </div>
    </div>
  );
}