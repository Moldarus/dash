import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Spinner, Alert, Card } from 'react-bootstrap';
import { auditApi } from '../../api/auditApi';
import ChartCard from './ChartCard';
import DataTable from './DataTable';

export default function Dashboard() {
  const [chartData, setChartData] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [chartResult, tableResult] = await Promise.all([
          auditApi.getChartData(),
          auditApi.getTableData()
        ]);
        
        setChartData(chartResult.chartData);
        setSummary(chartResult.summary);
        setTableData(tableResult);
      } catch (err) {
        setError(err.message || 'Ошибка загрузки данных');
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, []);

  const toggleSection = (name) => {
    setTableData(prev => prev.map(s => 
      s.sectionName === name ? { ...s, isOpen: !s.isOpen } : s
    ));
  };

  const toggleAllSections = (expand) => {
    setTableData(prev => prev.map(s => ({ ...s, isOpen: expand })));
  };

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
          <Alert.Heading>Ошибка</Alert.Heading>
          <p>{error}</p>
          <Button variant="outline-danger" onClick={() => window.location.reload()}>
            Повторить
          </Button>
        </Alert>
      </Container>
    );
  }

  return (
    <Container fluid>
      {/* Сводные карточки */}
      {summary && (
        <Row className="mb-4">
          <Col md={6}>
            <Card bg="primary" text="white">
              <Card.Body>
                <Card.Title>Обычные результаты</Card.Title>
                <Card.Text style={{ fontSize: '2rem', fontWeight: 'bold' }}>
                  {summary.summary} / 5.00
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}

      {/* Графики */}
      <Row>
        <Col md={12}>
          <ChartCard
            title="Сравнение результатов по разделам"
            data={chartData}
            dataKey1="value1"
            dataKey2="value2"
            name1="Обычные"
            name2="Оценочные"
            color1="#2c5aa0"
            color2="#7cb342"
          />
        </Col>
      </Row>

      {/* Таблица */}
      <Row className="mt-4">
        <Col md={12}>
          <DataTable 
            data={tableData} 
            onToggle={toggleSection}
            onToggleAll={toggleAllSections}
          />
        </Col>
      </Row>
    </Container>
  );
}