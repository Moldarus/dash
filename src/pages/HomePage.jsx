// src/pages/HomePage.jsx
import React, { useState } from 'react';
import { Container, Card, Row, Col, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import RussiaMap from '../components/map/RussiaMap';
import { getRegionsWithPlants } from '../data/regionsData';

export default function HomePage() {
  const [searchTerm, setSearchTerm] = useState('');
  const regionsWithPlants = getRegionsWithPlants();

  const filteredRegions = regionsWithPlants.map(region => ({
    ...region,
    plants: region.plants.filter(plant =>
      plant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      plant.city.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(region => region.plants.length > 0);

  return (
    <Container fluid className="px-4">
      {/* Заголовок */}
      <Row className="justify-content-center mb-4 mt-5">
        <Col md={12} className="text-center">
          <h1 className="mb-3">
            Дашборд аудита заводов
          </h1>
          <p className="text-muted lead">
            Система визуализации результатов производственного аудита
          </p>
          <div className="mt-3">
            <Link to="/rating" className="btn btn-outline-primary me-2">
               Рейтинг заводов
            </Link>
          </div>
        </Col>
      </Row>

      {/* Карта России */}
      <Row className="mb-4">
        <Col md={12}>
          <Card className="shadow-sm">
            <Card.Header className="bg-primary text-white">
              <h5 className="mb-0">
                Выберите регион для просмотра дашборда
              </h5>
            </Card.Header>
            <Card.Body>
              <RussiaMap />
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Список заводов */}
      {regionsWithPlants.length > 0 && (
        <Row>
          <Col md={12}>
            <Card className="shadow-sm">
              <Card.Header className="d-flex justify-content-between align-items-center flex-wrap">
                <h5 className="mb-0">
                  Доступные заводы для аудита
                </h5>
                <div className="mt-2 mt-sm-0">
                </div>
              </Card.Header>
              <Card.Body>
                {filteredRegions.length === 0 ? (
                  <div className="text-center py-4">
                    <i className="fas fa-search fa-3x text-muted mb-3"></i>
                    <p className="text-muted">Ничего не найдено. Попробуйте другой запрос.</p>
                  </div>
                ) : (
                  <div className="row">
                    {filteredRegions.map((region, idx) =>
                      region.plants.map((plant, plantIdx) => (
                        <div className="col-md-4 mb-3" key={`${idx}-${plantIdx}`}>
                          <div className="card border-primary h-100 shadow-sm">
                            <div className="card-body">
                              <h5 className="card-title text-primary">
                                <i className="fas fa-factory me-2"></i>
                                {plant.name}
                              </h5>
                              <p className="card-text">
                                <strong>Город:</strong> {plant.city}<br/>
                                <strong>Регион:</strong> {region.regionName}
                              </p>
                              <button
                                className="btn btn-primary w-100"
                                onClick={() => {
                                  localStorage.setItem('selectedPlant', JSON.stringify(plant));
                                  localStorage.setItem('selectedRegion', JSON.stringify({
                                    regionId: region.regionId,
                                    regionName: region.regionName
                                  }));
                                  window.location.href = '/dashboard';
                                }}
                              >
                                <i className="fas fa-chart-line me-1"></i>
                                Открыть дашборд
                              </button>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}
    </Container>
  );
}