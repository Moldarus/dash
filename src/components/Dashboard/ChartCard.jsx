// src/components/Dashboard/ChartCard.jsx
import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell
} from 'recharts';

export default function ChartCard({ title, data }) {
  return (
    <div style={{
      width: '100%',
      height: '500px',
      background: '#ffffff',
      borderRadius: '12px',
      padding: '20px',
      border: '1px solid #dee2e6',
      boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
    }}>
      <h4 style={{ 
        margin: '0 0 20px 0', 
        fontSize: '16px', 
        fontWeight: '600',
        color: '#2c3e50'
      }}>
      </h4>
      
      <ResponsiveContainer width="100%" height="85%">
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
          <XAxis 
            type="number" 
            domain={[0, 5]} 
            tick={{ fontSize: 11 }}
          />
          <YAxis 
            type="category" 
            dataKey="name" 
            width={150}
            tick={{ fontSize: 11 }}
          />
          <Tooltip
            contentStyle={{
              background: '#fff',
              border: '1px solid #dee2e6',
              borderRadius: '8px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}
          />
          <Legend />
          <Bar 
            name="Самоаудит" 
            dataKey="value1" 
            fill="#2c5aa0"
          />
          <Bar 
            name="Аудит" 
            dataKey="value2" 
            fill="#28a745"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}