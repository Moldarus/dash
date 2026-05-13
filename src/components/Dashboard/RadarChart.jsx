// src/components/Dashboard/RadarChart.jsx
import React from 'react';
import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis,
  PolarRadiusAxis, ResponsiveContainer, Tooltip
} from 'recharts';
import '../../pages/DashboardPage.css';

export default function RadarChartComponent({ data }) {
  // Цвета из HeatMap таблицы
  const COLORS = {
    brightGreen: '#92D050',
    brightRed: '#ED1D24',
    darkBlue: '#1a3a5c',
    lightBlue: '#e3f2fd'
  };

  // Кастомный рендерер для заголовков с двумя значениями
  const renderCustomizedAngleAxisTick = (props) => {
    const { x, y, payload, index } = props;
    
    // Проверка на существование payload
    if (!payload) {
      return null;
    }

    const label = payload.value;
    
    // Получаем значения для этого раздела
    const selfAudit = payload.B ?? data?.[index]?.B ?? 0;
    const audit = payload.A ?? data?.[index]?.A ?? 0;

    // Разделение заголовков по строкам как в столбчатой диаграмме
    if (label === 'Подготовка производства') {
      return (
        <g key={`tick-${index}`}>
          <text
            x={x}
            y={y - 5}
            textAnchor="middle"
            fill={COLORS.darkBlue}
            fontSize="18"
            fontWeight="700"
            fontFamily="'Magistral Black', 'Arial', sans-serif"
          >
            <tspan x={x} dy="0">Подготовка</tspan>
            <tspan x={x} dy="22">производства</tspan>
          </text>
          <text
            x={x - 5}
            y={y + 35}
            textAnchor="end"
            fill={COLORS.brightGreen}
            fontSize="14"
            fontWeight="700"
            fontFamily="'Magistral Black', 'Arial', sans-serif"
          >
            {audit.toFixed(2)}
          </text>
          <text
            x={x + 5}
            y={y + 35}
            textAnchor="start"
            fill={COLORS.darkBlue}
            fontSize="14"
            fontWeight="700"
            fontFamily="'Magistral Black', 'Arial', sans-serif"
          >
            {selfAudit.toFixed(2)}
          </text>
        </g>
      );
    }

    if (label === 'SF-m Ручные операции') {
      return (
        <g key={`tick-${index}`}>
          <text
            x={x}
            y={y - 5}
            textAnchor="middle"
            fill={COLORS.darkBlue}
            fontSize="18"
            fontWeight="700"
            fontFamily="'Magistral Black', 'Arial', sans-serif"
          >
            <tspan x={x} dy="0">SF-m Ручные</tspan>
            <tspan x={x} dy="22">операции</tspan>
          </text>
          <text
            x={x - 5}
            y={y + 35}
            textAnchor="end"
            fill={COLORS.brightGreen}
            fontSize="14"
            fontWeight="700"
            fontFamily="'Magistral Black', 'Arial', sans-serif"
          >
            {audit.toFixed(2)}
          </text>
          <text
            x={x + 5}
            y={y + 35}
            textAnchor="start"
            fill={COLORS.darkBlue}
            fontSize="14"
            fontWeight="700"
            fontFamily="'Magistral Black', 'Arial', sans-serif"
          >
            {selfAudit.toFixed(2)}
          </text>
        </g>
      );
    }

    if (label === 'Техническое развитие') {
      return (
        <g key={`tick-${index}`}>
          <text
            x={x}
            y={y - 5}
            textAnchor="middle"
            fill={COLORS.darkBlue}
            fontSize="18"
            fontWeight="700"
            fontFamily="'Magistral Black', 'Arial', sans-serif"
          >
            <tspan x={x} dy="0">Техническое</tspan>
            <tspan x={x} dy="22">развитие</tspan>
          </text>
          <text
            x={x - 5}
            y={y + 35}
            textAnchor="end"
            fill={COLORS.brightGreen}
            fontSize="14"
            fontWeight="700"
            fontFamily="'Magistral Black', 'Arial', sans-serif"
          >
            {audit.toFixed(2)}
          </text>
          <text
            x={x + 5}
            y={y + 35}
            textAnchor="start"
            fill={COLORS.darkBlue}
            fontSize="14"
            fontWeight="700"
            fontFamily="'Magistral Black', 'Arial', sans-serif"
          >
            {selfAudit.toFixed(2)}
          </text>
        </g>
      );
    }

    if (label === 'Цепочка поставок') {
      return (
        <g key={`tick-${index}`}>
          <text
            x={x}
            y={y - 5}
            textAnchor="middle"
            fill={COLORS.darkBlue}
            fontSize="18"
            fontWeight="700"
            fontFamily="'Magistral Black', 'Arial', sans-serif"
          >
            <tspan x={x} dy="0">Цепочка</tspan>
            <tspan x={x} dy="22">поставок</tspan>
          </text>
          <text
            x={x - 5}
            y={y + 35}
            textAnchor="end"
            fill={COLORS.brightGreen}
            fontSize="14"
            fontWeight="700"
            fontFamily="'Magistral Black', 'Arial', sans-serif"
          >
            {audit.toFixed(2)}
          </text>
          <text
            x={x + 5}
            y={y + 35}
            textAnchor="start"
            fill={COLORS.darkBlue}
            fontSize="14"
            fontWeight="700"
            fontFamily="'Magistral Black', 'Arial', sans-serif"
          >
            {selfAudit.toFixed(2)}
          </text>
        </g>
      );
    }

    return (
      <g key={`tick-${index}`}>
        <text
          x={x}
          y={y - 5}
          textAnchor="middle"
          fill={COLORS.darkBlue}
          fontSize="18"
          fontWeight="700"
          fontFamily="'Magistral Black', 'Arial', sans-serif"
        >
          {label}
        </text>
        <text
          x={x - 5}
          y={y + 20}
          textAnchor="end"
          fill={COLORS.brightGreen}
          fontSize="14"
          fontWeight="700"
          fontFamily="'Magistral Black', 'Arial', sans-serif"
        >
          {audit.toFixed(2)}
        </text>
        <text
          x={x + 5}
          y={y + 20}
          textAnchor="start"
          fill={COLORS.darkBlue}
          fontSize="14"
          fontWeight="700"
          fontFamily="'Magistral Black', 'Arial', sans-serif"
        >
          {selfAudit.toFixed(2)}
        </text>
      </g>
    );
  };

  return (
    <div style={{
      width: '100%', 
      height: '650px',
      background: '#ffffff', 
      borderRadius: '12px',
      padding: '20px', 
      border: '1px solid #dee2e6',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <h4 
        className="chart-title" 
        style={{ 
          margin: '0 0 20px 0', 
          fontSize: '18px', 
          fontWeight: '700',
          fontFamily: "'Magistral Black', 'Arial', sans-serif",
          color: COLORS.darkBlue
        }}
      >
        Сравнение по разделам
      </h4>
      
      <div style={{ flex: 1 }}>
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="85%" data={data}>
            <PolarGrid stroke="#e0e0e0" />
            
            <PolarAngleAxis 
              dataKey="subject" 
              tick={renderCustomizedAngleAxisTick}
            />
            
            <PolarRadiusAxis 
              angle={90} 
              domain={[0, 5]} 
              ticks={[0, 1, 2, 3, 4, 5]}
              tick={false}
            />
            
            <Radar 
              name="Аудит" 
              dataKey="A" 
              stroke={COLORS.brightGreen}
              fill={COLORS.brightGreen} 
              fillOpacity={0.6}
            />
            <Radar 
              name="Самоаудит" 
              dataKey="B" 
              stroke={COLORS.darkBlue}
              fill={COLORS.lightBlue}
              fillOpacity={0.6}
            />
            
            <Tooltip 
              contentStyle={{ 
                background: '#fff', 
                border: '1px solid #dee2e6', 
                borderRadius: '8px',
                fontSize: '18px',
                fontFamily: "'Magistral Black', 'Arial', sans-serif"
              }} 
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '30px',
        marginTop: '20px',
        paddingTop: '15px',
        borderTop: '2px solid #dee2e6'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          fontSize: '18px',
          fontWeight: '700',
          fontFamily: "'Magistral Black', 'Arial', sans-serif"
        }}>
          <div style={{
            width: '20px',
            height: '20px',
            backgroundColor: COLORS.brightGreen,
            borderRadius: '3px'
          }}></div>
          <span>Аудит</span>
        </div>
        
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          fontSize: '18px',
          fontWeight: '700',
          fontFamily: "'Magistral Black', 'Arial', sans-serif"
        }}>
          <div style={{
            width: '20px',
            height: '20px',
            backgroundColor: COLORS.lightBlue,
            borderRadius: '3px',
            border: `2px solid ${COLORS.darkBlue}`
          }}></div>
          <span style={{ color: COLORS.darkBlue }}>Самоаудит</span>
        </div>
      </div>
    </div>
  );
}