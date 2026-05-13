// src/pages/HomePage.jsx
import React from 'react';
import { Container, Card, Row, Col } from 'react-bootstrap';
import RussiaMap from '../components/map/RussiaMap';
import { getRegionsWithPlants } from '../data/regionsData';

export default function HomePage() {
  const regionsWithPlants = getRegionsWithPlants();

  return (
    <Container fluid className="px-4">
      {/* Заголовок страницы */}
      <Row className="justify-content-center mb-4 mt-5">
        <Col md={12} className="text-center">
          <h1 className="mb-3">Дашборд аудита заводов</h1>
          <p className="text-muted lead">
            Система визуализации результатов производственного аудита
          </p>
        </Col>
      </Row>

      {/* Карта России */}
      <Row className="mb-4">
        <Col md={12}>
          <Card>
            <Card.Header className="bg-primary text-white">
              <h5 className="mb-0">Выберите регион для просмотра дашборда</h5>
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
            <Card>
              <Card.Header>
                <h5 className="mb-0">Доступные заводы для аудита</h5>
              </Card.Header>
              <Card.Body>
                <div className="row">
                  {regionsWithPlants.map((region, idx) =>
                    region.plants.map((plant, plantIdx) => (
                      <div className="col-md-4 mb-3" key={`${idx}-${plantIdx}`}>
                        <div className="card border-primary h-100">
                          <div className="card-body text-primary">
                            <h5 className="card-title">{plant.name}</h5>
                            <p className="card-text">
                              <strong>Город:</strong> {plant.city}<br/>
                              <strong>Регион:</strong> {region.regionName}
                              {/* ✅ УБРАН статус завода */}
                            </p>
                            <button 
                              className="btn btn-primary" 
                              onClick={() => {
                                localStorage.setItem('selectedPlant', JSON.stringify(plant));
                                localStorage.setItem('selectedRegion', JSON.stringify({
                                  regionId: region.regionId,
                                  regionName: region.regionName
                                }));
                                window.location.href = '/dashboard';
                              }}
                            >
                              Открыть дашборд
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}
    </Container>
  );
}