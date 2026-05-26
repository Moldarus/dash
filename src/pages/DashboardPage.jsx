// src/pages/DashboardPage.jsx
import React, { useEffect, useState, useRef } from 'react';
import { Container, Row, Col, Alert, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { auditApi } from '../api/auditApi';
import HeatMap from '../components/Dashboard/HeatMap';
import RadarChartComponent from '../components/Dashboard/RadarChart';
import GroupedBarChart from '../components/Dashboard/GroupedBarChart';
import SectionFilter from '../components/Dashboard/SectionFilter';
import KpiCards from '../components/Dashboard/KpiCards';
import ComparisonModal from '../components/Dashboard/ComparisonModal';
import CategoryDetailModal from '../components/Dashboard/CategoryDetailModal';
import SkeletonLoader from '../components/SkeletonLoader';
import { exportDashboardToPDF } from '../utils/exportToPDF';
import { exportFullToExcel } from '../utils/exportToExcelAdvanced';

const COLORS = {
  brightGreen: '#92D050',
  brightRed: '#C0504D',
  darkBlue: '#1a3a5c',
  lightBlue: '#e3f2fd',
  white: '#ffffff'
};

const FadeIn = ({ children, delay = 0 }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay);
        }
      },
      { threshold: 0.1, triggerOnce: true }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [delay]);

  return (
    <div
      ref={ref}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
        transition: `opacity 0.6s ease-out ${delay}ms, transform 0.6s ease-out ${delay}ms`
      }}
    >
      {children}
    </div>
  );
};

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
  const [filteredSections, setFilteredSections] = useState([]);
  const [showComparison, setShowComparison] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

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

        console.log('Загружаем данные для:', plant.name);

        const [chartResult, tableResult, closedTasksResult] = await Promise.all([
          auditApi.getChartData(plant.auditData),
          auditApi.getTableData(plant.auditData),
          auditApi.getClosedTasksData(plant.auditData)
        ]);

        setChartData(chartResult.chartData);

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

        console.log('Данные загружены успешно');

      } catch (err) {
        console.error('Ошибка загрузки:', err);
        setError(err.message || 'Ошибка при загрузке данных');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleFilterChange = (filters) => {
    setFilteredSections(filters);
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    setShowCategoryModal(true);
  };

  const filteredChartData = filteredSections.length > 0
    ? chartData.filter(item => filteredSections.includes(item.name))
    : chartData;

  const filteredClosedTasksData = filteredSections.length > 0
    ? closedTasksData.filter(item => filteredSections.includes(item.name))
    : closedTasksData;

  const radarData = filteredChartData.map(item => ({
    subject: item.name,
    A: item.value2,
    B: item.value1,
    fullMark: 5
  }));

  if (loading) {
    return <SkeletonLoader />;
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

  const totalProgress = esteemSummary !== null ? Math.round((esteemSummary / 5) * 100) : 0;
  const pointsToGoal = summary !== null ? (5 - summary).toFixed(1) : 0;

  const bestSection = chartData.length > 0
    ? chartData.reduce((max, item) => item.value2 > max.value2 ? item : max, chartData[0])
    : null;

  const worstSection = chartData.length > 0
    ? chartData.reduce((min, item) => item.value2 < min.value2 ? item : min, chartData[0])
    : null;

  return (
    <div>
      <Container fluid className="dashboard-container">
        {/* Заголовок */}
        <FadeIn delay={0}>
          <Row className="mb-4">
            <Col md={12}>
              <Card style={{
                background: COLORS.darkBlue,
                color: COLORS.white,
                border: 'none',
                borderRadius: '8px'
              }}>
                <Card.Body className="d-flex justify-content-between align-items-center flex-wrap">
                  <div>
                    <h2 className="dashboard-title mb-1">{plantInfo?.name || 'Завод'}</h2>
                    <p className="mb-0" style={{ opacity: 0.9 }}>
                      {regionInfo?.regionName || ''}, {plantInfo?.city || ''}
                      <br />
                      <small>{plantInfo?.fullName || ''}</small>
                    </p>
                  </div>
                  <div className="mt-2 mt-sm-0">
                    <button
                      className="btn btn-outline-light me-2"
                      onClick={() => setShowComparison(true)}
                    >
                      Сравнить
                    </button>
                    <button
                      className="btn btn-outline-light me-2"
                      onClick={() => exportFullToExcel(chartData, closedTasksData, tableData, plantInfo?.name)}
                    >
                      Excel
                    </button>
                    <button
                      className="btn btn-outline-light me-2"
                      onClick={() => {window.open('/print', '_blank');

                      }}
                    >
                      PDF
                    </button>
                    <Link to="/" className="btn btn-outline-light">
                      Карта
                    </Link>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </FadeIn>

        {/* Сводные карточки (Самоаудит / Аудит) */}
        <FadeIn delay={100}>
          <Row className="mb-4">
            <Col md={6}>
              <Card style={{
                background: COLORS.darkBlue,
                color: COLORS.white,
                border: 'none',
                borderRadius: '8px'
              }}>
                <Card.Body>
                  <Card.Title style={{ fontSize: '18px', fontWeight: '700' }}>Самоаудит</Card.Title>
                  <Card.Text className="summary-text" style={{ fontSize: '36px', fontWeight: '700' }}>
                    {summary !== null && !isNaN(summary)
                      ? `${Number(summary).toFixed(2)} / 5.00`
                      : '—'}
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6}>
              <Card style={{
                background: COLORS.darkBlue,
                color: COLORS.white,
                border: 'none',
                borderRadius: '8px'
              }}>
                <Card.Body>
                  <Card.Title style={{ fontSize: '18px', fontWeight: '700' }}>Аудит</Card.Title>
                  <Card.Text className="summary-text" style={{ fontSize: '36px', fontWeight: '700' }}>
                    {esteemSummary !== null && !isNaN(esteemSummary)
                      ? `${Number(esteemSummary).toFixed(2)} / 5.00`
                      : '—'}
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </FadeIn>

        {/* KPI Карточки */}
        <FadeIn delay={150}>
          <KpiCards
            totalProgress={totalProgress}
            pointsToGoal={pointsToGoal}
            bestSection={bestSection}
            worstSection={worstSection}
          />
        </FadeIn>

        {/* Фильтр */}
        <FadeIn delay={200}>
          <Row className="mb-4">
            <Col md={12}>
              <SectionFilter
                sections={chartData}
                onFilterChange={handleFilterChange}
              />
            </Col>
          </Row>
        </FadeIn>

        {/* Графики */}
        <FadeIn delay={250}>
          <Row className="mb-4">
            <Col md={5}>
              {radarData.length > 0 ? (
                <RadarChartComponent data={radarData} />
              ) : (
                <div className="text-center p-5 bg-light rounded" style={{ height: '500px' }}>
                  <p className="text-muted mt-5">Нет данных для выбранных разделов</p>
                </div>
              )}
            </Col>
            <Col md={7}>
              <GroupedBarChart data={filteredClosedTasksData} />
            </Col>
          </Row>
        </FadeIn>

        {/* Тепловая карта */}
        <FadeIn delay={300}>
          <Row>
            <Col md={12}>
              <HeatMap
                data={tableData}
                onCategoryClick={handleCategoryClick}
              />
            </Col>
          </Row>
        </FadeIn>
      </Container>

      {/* Модальные окна */}
      <ComparisonModal
        show={showComparison}
        onHide={() => setShowComparison(false)}
        currentPlant={plantInfo}
        currentData={{ chartData, summary, esteemSummary }}
      />

      <CategoryDetailModal
        show={showCategoryModal}
        onHide={() => setShowCategoryModal(false)}
        category={selectedCategory}
      />
    </div>
  );
}