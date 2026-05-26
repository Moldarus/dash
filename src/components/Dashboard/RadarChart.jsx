// src/components/Dashboard/RadarChart.jsx
import React, { useState, useEffect } from 'react';
import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis,
  PolarRadiusAxis, ResponsiveContainer, Tooltip
} from 'recharts';
import '../../pages/DashboardPage.css';

export default function RadarChartComponent({ data, isPrintMode = false }) {
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
    brightRed: '#ED1D24',
    darkBlue: '#1a3a5c',
    lightBlue: '#e3f2fd',
    white: '#ffffff'
  };

  const renderCustomizedAngleAxisTick = (props) => {
    const { x, y, payload, index } = props;

    if (!payload) return null;

    const label = payload.value;
    const selfAudit = payload.B ?? data?.[index]?.B ?? 0;
    const audit = payload.A ?? data?.[index]?.A ?? 0;

    if (label === 'Подготовка производства') {
      return (
        <g key={`tick-${index}`}>
          <text
            x={x}
            y={y - 5}
            textAnchor="middle"
            fill={COLORS.darkBlue}
            fontSize={printMode ? "16" : "11"}
            fontWeight="700"
          >
            <tspan x={x} dy="0">Подготовка</tspan>
            <tspan x={x} dy={printMode ? "22" : "16"}>производства</tspan>
          </text>
          <text
            x={x - 10}
            y={y + (printMode ? 50 : 30)}
            textAnchor="end"
            fill={COLORS.brightGreen}
            fontSize={printMode ? "16" : "11"}
            fontWeight="700"
          >
            {audit.toFixed(2)}
          </text>
          <text
            x={x + 10}
            y={y + (printMode ? 50 : 30)}
            textAnchor="start"
            fill={COLORS.darkBlue}
            fontSize={printMode ? "16" : "11"}
            fontWeight="700"
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
            fontSize={printMode ? "16" : "11"}
            fontWeight="700"
          >
            <tspan x={x} dy="0">SF-m Ручные</tspan>
            <tspan x={x} dy={printMode ? "22" : "16"}>операции</tspan>
          </text>
          <text
            x={x - 10}
            y={y + (printMode ? 50 : 30)}
            textAnchor="end"
            fill={COLORS.brightGreen}
            fontSize={printMode ? "16" : "11"}
            fontWeight="700"
          >
            {audit.toFixed(2)}
          </text>
          <text
            x={x + 10}
            y={y + (printMode ? 50 : 30)}
            textAnchor="start"
            fill={COLORS.darkBlue}
            fontSize={printMode ? "16" : "11"}
            fontWeight="700"
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
            fontSize={printMode ? "16" : "11"}
            fontWeight="700"
          >
            <tspan x={x} dy="0">Техническое</tspan>
            <tspan x={x} dy={printMode ? "22" : "16"}>развитие</tspan>
          </text>
          <text
            x={x - 10}
            y={y + (printMode ? 50 : 30)}
            textAnchor="end"
            fill={COLORS.brightGreen}
            fontSize={printMode ? "16" : "11"}
            fontWeight="700"
          >
            {audit.toFixed(2)}
          </text>
          <text
            x={x + 10}
            y={y + (printMode ? 50 : 30)}
            textAnchor="start"
            fill={COLORS.darkBlue}
            fontSize={printMode ? "16" : "11"}
            fontWeight="700"
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
            fontSize={printMode ? "16" : "11"}
            fontWeight="700"
          >
            <tspan x={x} dy="0">Цепочка</tspan>
            <tspan x={x} dy={printMode ? "22" : "16"}>поставок</tspan>
          </text>
          <text
            x={x - 10}
            y={y + (printMode ? 50 : 30)}
            textAnchor="end"
            fill={COLORS.brightGreen}
            fontSize={printMode ? "16" : "11"}
            fontWeight="700"
          >
            {audit.toFixed(2)}
          </text>
          <text
            x={x + 10}
            y={y + (printMode ? 50 : 30)}
            textAnchor="start"
            fill={COLORS.darkBlue}
            fontSize={printMode ? "16" : "11"}
            fontWeight="700"
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
          fontSize={printMode ? "16" : "11"}
          fontWeight="700"
        >
          {label}
        </text>
        <text
          x={x - 10}
          y={y + (printMode ? 35 : 20)}
          textAnchor="end"
          fill={COLORS.brightGreen}
          fontSize={printMode ? "16" : "11"}
          fontWeight="700"
        >
          {audit.toFixed(2)}
        </text>
        <text
          x={x + 10}
          y={y + (printMode ? 35 : 20)}
          textAnchor="start"
          fill={COLORS.darkBlue}
          fontSize={printMode ? "16" : "11"}
          fontWeight="700"
        >
          {selfAudit.toFixed(2)}
        </text>
      </g>
    );
  };

  return (
    <div style={{
      width: '100%',
      height: printMode ? '700px' : '500px',
      background: COLORS.white,
      borderRadius: '12px',
      padding: printMode ? '30px' : '15px',
      border: `1px solid ${COLORS.darkBlue}`,
      display: 'flex',
      flexDirection: 'column',
      boxSizing: 'border-box'
    }}>
      <h4
        className="chart-title"
        style={{
          margin: '0 0 15px 0',
          fontSize: printMode ? '22px' : '16px',
          fontWeight: '700',
          color: COLORS.darkBlue,
          textAlign: 'center'
        }}
      >
        Сравнение по разделам
      </h4>

      <div style={{ flex: 1, minHeight: 0 }}>
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius={printMode ? "85%" : "80%"} data={data}>
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
                background: COLORS.white,
                border: `1px solid ${COLORS.darkBlue}`,
                borderRadius: '8px',
                fontSize: printMode ? '16px' : '12px'
              }}
              formatter={(value, name) => {
                if (name === 'Аудит') return [value.toFixed(2), 'Аудит'];
                if (name === 'Самоаудит') return [value.toFixed(2), 'Самоаудит'];
                return [value, name];
              }}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '40px',
        marginTop: '15px',
        paddingTop: '12px',
        borderTop: `1px solid ${COLORS.lightBlue}`
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '20px', height: '20px', backgroundColor: COLORS.brightGreen, borderRadius: '4px' }}></div>
          <span style={{ color: COLORS.darkBlue, fontSize: printMode ? '16px' : '12px', fontWeight: '600' }}>Аудит</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '20px', height: '20px', backgroundColor: COLORS.lightBlue, borderRadius: '4px', border: `2px solid ${COLORS.darkBlue}` }}></div>
          <span style={{ color: COLORS.darkBlue, fontSize: printMode ? '16px' : '12px', fontWeight: '600' }}>Самоаудит</span>
        </div>
      </div>
    </div>
  );
}