// src/pages/DashboardPage.jsx
import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Spinner, Alert, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { auditApi } from '../api/auditApi';
import HeatMap from '../components/Dashboard/HeatMap';
import RadarChartComponent from '../components/Dashboard/RadarChart';
import GroupedBarChart from '../components/Dashboard/GroupedBarChart';

export default function DashboardPage() {
  const [chartData, setChartData] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [closedTasksData, setClosedTasksData] = useState([]);
  const [summary, setSummary] = useState(null);
  const [esteemSummary, setEsteemSummary] = useState(null);
  const [plantInfo, setPlantInfo] = useState(null);
  const [regionInfo, setRegionInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const COLORS = {
    brightGreen: '#92D050',
    brightRed: '#ED1D24',
    darkBlue: '#1a3a5c',
    lightBlue: '#e3f2fd'
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        const storedPlant = localStorage.getItem('selectedPlant');
        const storedRegion = localStorage.getItem('selectedRegion');
        
        if (!storedPlant) {
          throw new Error('Завод не выбран. Вернитесь на карту.');
        }

        const plant = JSON.parse(storedPlant);
        const region = storedRegion ? JSON.parse(storedRegion) : null;
        
        setPlantInfo(plant);
        if (region) setRegionInfo(region);

        console.log('🏭 Загружаем данные для:', plant.name);
        console.log('📂 Путь к файлу:', plant.auditData);

        const [chartResult, tableResult, closedTasksResult] = await Promise.all([
          auditApi.getChartData(plant.auditData),
          auditApi.getTableData(plant.auditData),
          auditApi.getClosedTasksData(plant.auditData)
        ]);
        
        setChartData(chartResult.chartData);
        
        // ✅ ИСПРАВЛЕНИЕ: Правильное извлечение числовых значений
        const summaryValue = typeof chartResult.summary === 'number' 
          ? chartResult.summary 
          : parseFloat(chartResult.summary) || 0;
        
        const esteemSummaryValue = typeof chartResult.esteemSummary === 'number'
          ? chartResult.esteemSummary
          : parseFloat(chartResult.esteemSummary) || 0;
        
        setSummary(summaryValue);
        setEsteemSummary(esteemSummaryValue);
        
        setTableData(tableResult);
        setClosedTasksData(closedTasksResult);
        
        console.log('✅ Данные загружены успешно');
        console.log('📊 Summary:', summaryValue, 'EsteemSummary:', esteemSummaryValue);
        
      } catch (err) {
        console.error('❌ Ошибка загрузки:', err);
        setError(err.message || 'Ошибка при загрузке данных');
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, []);

  const radarData = chartData.map(item => ({
    subject: item.name,
    A: item.value2,
    B: item.value1,
    fullMark: 5
  }));

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Загрузка данных...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-4">
        <Alert variant="danger">
          <Alert.Heading>Ошибка загрузки данных</Alert.Heading>
          <p>{error}</p>
          <div className="mt-3">
            <Link to="/" className="btn btn-outline-danger me-2">На карту</Link>
            <button className="btn btn-outline-danger" onClick={() => window.location.reload()}>Повторить</button>
          </div>
        </Alert>
      </Container>
    );
  }

  return (
    <Container fluid className="dashboard-container">
      {/* Заголовок */}
      <Row className="mb-4">
        <Col md={12}>
          <Card style={{ 
            background: COLORS.darkBlue, 
            color: '#ffffff',
            border: 'none',
            borderRadius: '8px'
          }}>
            <Card.Body className="d-flex justify-content-between align-items-center">
              <div>
                <h2 className="dashboard-title mb-1">{plantInfo?.name || 'Завод'}</h2>
                <p className="mb-0" style={{ opacity: 0.9 }}>
                  {regionInfo?.regionName || ''}, {plantInfo?.city || ''}
                  <br />
                  <small>{plantInfo?.fullName || ''}</small>
                </p>
              </div>
              <Link to="/" className="btn btn-outline-light">Выбрать другой регион</Link>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Сводные карточки */}
      <Row className="mb-4">
        <Col md={5}>
          <Card style={{ 
            background: COLORS.darkBlue, 
            color: '#ffffff',
            border: 'none',
            borderRadius: '8px'
          }}>
            <Card.Body>
              <Card.Title style={{ fontSize: '18px', fontWeight: '700' }}>Самоаудит</Card.Title>
              <Card.Text className="summary-text" style={{ fontSize: '36px', fontWeight: '700' }}>
                {summary !== null && summary !== undefined && !isNaN(summary) 
                  ? `${Number(summary).toFixed(2)} / 5.00` 
                  : '—'}
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={7}>
          <Card style={{ 
            background: COLORS.brightGreen, 
            color: '#ffffff',
            border: 'none',
            borderRadius: '8px'
          }}>
            <Card.Body>
              <Card.Title style={{ fontSize: '18px', fontWeight: '700' }}>Аудит</Card.Title>
              <Card.Text className="summary-text" style={{ fontSize: '36px', fontWeight: '700' }}>
                {esteemSummary !== null && esteemSummary !== undefined && !isNaN(esteemSummary) 
                  ? `${Number(esteemSummary).toFixed(2)} / 5.00` 
                  : '—'}
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Графики */}
      <Row className="mb-4">
        <Col md={5}>
          <RadarChartComponent data={radarData} />
        </Col>
        <Col md={7}>
          <GroupedBarChart data={closedTasksData} />
        </Col>
      </Row>

      {/* Тепловая карта */}
      <Row>
        <Col md={12}>
          <HeatMap data={tableData} />
        </Col>
      </Row>
    </Container>
  );
}