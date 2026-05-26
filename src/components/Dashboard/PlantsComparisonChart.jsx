// src/components/Dashboard/PlantsComparisonChart.jsx
import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { Card, Spinner } from 'react-bootstrap';
import { getRegionsWithPlants } from '../../data/regionsData';
import { auditApi } from '../../api/auditApi';

export default function PlantsComparisonChart() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const regions = getRegionsWithPlants();
        const results = [];

        for (const region of regions) {
          for (const plant of region.plants) {
            const result = await auditApi.getChartData(plant.auditData);
            results.push({
              name: plant.name,
              selfAudit: result.summary,
              audit: result.esteemSummary,
              fullName: plant.fullName
            });
          }
        }

        setData(results.sort((a, b) => b.audit - a.audit));
      } catch (error) {
        console.error('Ошибка загрузки данных для сравнения:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <Card className="text-center p-5">
        <Spinner animation="border" variant="primary" />
      </Card>
    );
  }

  return (
    <Card style={{ border: 'none', borderRadius: '16px' }}>
      <Card.Header style={{ background: '#1a3a5c', color: 'white', border: 'none', borderRadius: '16px 16px 0 0' }}>
        <h5 className="mb-0">
          <i className="fas fa-chart-bar me-2"></i>
          Сравнение результатов по всем заводам
        </h5>
      </Card.Header>
      <Card.Body style={{ height: '500px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} interval={0} />
            <YAxis domain={[0, 5]} label={{ value: 'Оценка', angle: -90, position: 'insideLeft' }} />
            <Tooltip
              formatter={(value) => value.toFixed(2)}
              labelFormatter={(label) => `${label}`}
            />
            <Legend />
            <Bar name="Самооценка" dataKey="selfAudit" fill="#e3f2fd" />
            <Bar name="Аудит" dataKey="audit" fill="#92D050" />
          </BarChart>
        </ResponsiveContainer>
      </Card.Body>
    </Card>
  );
}