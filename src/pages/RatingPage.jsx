// src/pages/RatingPage.jsx
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { getRegionsWithPlants } from '../data/regionsData';
import { auditApi } from '../api/auditApi';

// Цвета из тепловой карты
const COLORS = {
  darkBlue: '#1a3a5c',
  brightGreen: '#92D050',
  brightRed: '#C0504D',
  lightBlue: '#e3f2fd',
  white: '#ffffff'
};

export default function RatingPage() {
  const [plantsData, setPlantsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('audit');
  const [sortOrder, setSortOrder] = useState('desc');

  useEffect(() => {
    const loadAllPlants = async () => {
      try {
        setLoading(true);
        const regions = getRegionsWithPlants();
        const plantsPromises = [];

        for (const region of regions) {
          for (const plant of region.plants) {
            plantsPromises.push(
              auditApi.getChartData(plant.auditData)
                .then(result => ({
                  ...plant,
                  regionName: region.regionName,
                  regionId: region.regionId,
                  summary: result.summary,
                  esteemSummary: result.esteemSummary,
                  difference: (result.esteemSummary - result.summary).toFixed(2)
                }))
                .catch(err => ({
                  ...plant,
                  regionName: region.regionName,
                  regionId: region.regionId,
                  summary: 0,
                  esteemSummary: 0,
                  difference: 0,
                  error: true
                }))
            );
          }
        }

        const results = await Promise.all(plantsPromises);
        setPlantsData(results);
      } catch (error) {
        console.error('Ошибка загрузки рейтинга:', error);
      } finally {
        setLoading(false);
      }
    };

    loadAllPlants();
  }, []);

  // Фон для всех оценок — голубой (светлый)
  const getRatingColor = () => {
    return COLORS.lightBlue;
  };

  // Текст всегда тёмно-синий (хорошо видно на светлом фоне)
  const getTextColor = () => {
    return COLORS.darkBlue;
  };

  const getTrendIcon = (diff) => {
    if (diff > 0) return <span style={{ color: COLORS.brightGreen }}>▲</span>;
    if (diff < 0) return <span style={{ color: COLORS.brightRed }}>▼</span>;
    return <span style={{ color: COLORS.darkBlue }}>●</span>;
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const sortedPlants = [...plantsData].sort((a, b) => {
    let aVal, bVal;
    if (sortBy === 'audit') {
      aVal = a.esteemSummary;
      bVal = b.esteemSummary;
    } else if (sortBy === 'selfAudit') {
      aVal = a.summary;
      bVal = b.summary;
    } else if (sortBy === 'difference') {
      aVal = parseFloat(a.difference);
      bVal = parseFloat(b.difference);
    } else {
      aVal = a.name;
      bVal = b.name;
    }

    if (sortOrder === 'asc') {
      return aVal > bVal ? 1 : -1;
    } else {
      return aVal < bVal ? 1 : -1;
    }
  });

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Загрузка рейтинга заводов...</p>
      </Container>
    );
  }

  return (
    <Container fluid className="mt-4">
      <Row className="mb-4">
        <Col md={12}>
          <Card style={{
            border: 'none',
            borderRadius: '16px',
            background: COLORS.darkBlue,
            color: COLORS.white
          }}>
            <Card.Body className="d-flex justify-content-between align-items-center flex-wrap">
              <div>
                <h2 className="mb-1">
                  <i className="fas fa-chart-line me-2"></i>
                  Рейтинг заводов
                </h2>
                <p className="mb-0 opacity-75">Сравнение результатов аудита всех предприятий</p>
              </div>
              <div className="mt-2 mt-sm-0">
                <Link to="/" className="btn btn-outline-light">
                  <i className="fas fa-home me-1"></i> На главную
                </Link>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col md={12}>
          <Card style={{ border: `1px solid ${COLORS.lightBlue}`, borderRadius: '16px' }}>
            <Card.Body className="p-0">
              <div className="table-responsive">
                <table className="table table-hover mb-0" style={{ fontFamily: 'Arial, sans-serif' }}>
                  <thead style={{ background: COLORS.lightBlue }}>
                  <tr>
                    <th style={{ cursor: 'pointer', padding: '15px', color: COLORS.darkBlue }} onClick={() => handleSort('name')}>
                      Завод {sortBy === 'name' && (sortOrder === 'asc' ? '↑' : '↓')}
                    </th>
                    <th style={{ color: COLORS.darkBlue }}>Регион</th>
                    <th style={{ cursor: 'pointer', textAlign: 'center', color: COLORS.darkBlue }} onClick={() => handleSort('selfAudit')}>
                      Самооценка {sortBy === 'selfAudit' && (sortOrder === 'asc' ? '↑' : '↓')}
                    </th>
                    <th style={{ cursor: 'pointer', textAlign: 'center', color: COLORS.darkBlue }} onClick={() => handleSort('audit')}>
                      Аудит {sortBy === 'audit' && (sortOrder === 'asc' ? '↑' : '↓')}
                    </th>
                    <th style={{ cursor: 'pointer', textAlign: 'center', color: COLORS.darkBlue }} onClick={() => handleSort('difference')}>
                      Динамика {sortBy === 'difference' && (sortOrder === 'asc' ? '↑' : '↓')}
                    </th>
                    <th style={{ textAlign: 'center', color: COLORS.darkBlue }}>Действие</th>
                  </tr>
                  </thead>
                  <tbody>
                    {sortedPlants.map((plant, idx) => (
                      <tr key={idx}>
                        <td style={{ padding: '12px 15px', fontWeight: '600', color: COLORS.darkBlue }}>
                          {plant.name}
                        </td>
                        <td style={{ padding: '12px 15px', color: COLORS.darkBlue }}>{plant.regionName}</td>
                        <td style={{ textAlign: 'center', padding: '12px 15px' }}>
                          <span style={{
                            background: getRatingColor(),
                            padding: '4px 12px',
                            borderRadius: '20px',
                            color: getTextColor(),
                            fontWeight: '600',
                            fontSize: '14px'
                          }}>
                            {plant.summary.toFixed(2)}
                          </span>
                        </td>
                        <td style={{ textAlign: 'center', padding: '12px 15px' }}>
                          <span style={{
                            background: getRatingColor(),
                            padding: '4px 12px',
                            borderRadius: '20px',
                            color: getTextColor(),
                            fontWeight: '600',
                            fontSize: '14px'
                          }}>
                            {plant.esteemSummary.toFixed(2)}
                          </span>
                        </td>
                        <td style={{ textAlign: 'center', padding: '12px 15px', fontWeight: '600' }}>
                          {getTrendIcon(plant.difference)}
                          <span className="ms-1" style={{ color: COLORS.darkBlue }}>
                            {plant.difference > 0 ? `+${plant.difference}` : plant.difference}
                          </span>
                        </td>
                        <td style={{ textAlign: 'center', padding: '12px 15px' }}>
                          <button
                            className="btn btn-sm"
                            style={{
                              background: COLORS.darkBlue,
                              color: COLORS.white,
                              border: 'none',
                              borderRadius: '6px',
                              padding: '5px 12px',
                              fontSize: '12px'
                            }}
                            onClick={() => {
                              localStorage.setItem('selectedPlant', JSON.stringify(plant));
                              localStorage.setItem('selectedRegion', JSON.stringify({
                                regionId: plant.regionId,
                                regionName: plant.regionName
                              }));
                              window.location.href = '/dashboard';
                            }}
                          >
                            <i className="fas fa-chart-line me-1"></i> Подробнее
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}