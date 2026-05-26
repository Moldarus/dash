// src/components/Dashboard/ComparisonModal.jsx
import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import { auditApi } from '../../api/auditApi';

export default function ComparisonModal({ show, onHide, currentPlant, currentData }) {
  const [availablePlants, setAvailablePlants] = useState([]);
  const [selectedPlant, setSelectedPlant] = useState(null);
  const [compareData, setCompareData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadPlants = async () => {
      try {
        const regionsData = await import('../../data/regionsData');
        const allPlants = [];
        if (regionsData.getRegionsWithPlants) {
          regionsData.getRegionsWithPlants().forEach(region => {
            region.plants.forEach(plant => {
              if (plant.name !== currentPlant?.name) {
                allPlants.push(plant);
              }
            });
          });
        }
        setAvailablePlants(allPlants);
      } catch (error) {
        console.error('Ошибка загрузки списка заводов:', error);
      }
    };
    if (show) {
      loadPlants();
    }
  }, [show, currentPlant]);

  const handleCompare = async () => {
    if (!selectedPlant) return;

    setLoading(true);
    try {
      const result = await auditApi.getChartData(selectedPlant.auditData);
      setCompareData(result);
    } catch (error) {
      console.error('Ошибка загрузки данных для сравнения:', error);
    } finally {
      setLoading(false);
    }
  };

  const getComparisonColor = (current, compare) => {
    if (current > compare) return '#28a745';
    if (current < compare) return '#dc3545';
    return '#ffc107';
  };

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton style={{ background: '#1a3a5c', color: 'white' }}>
        <Modal.Title>
          Сравнение с другим заводом
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Row className="mb-4">
          <Col md={8}>
            <Form.Select
              value={selectedPlant?.name || ''}
              onChange={(e) => {
                const plant = availablePlants.find(p => p.name === e.target.value);
                setSelectedPlant(plant);
                setCompareData(null);
              }}
            >
              <option value="">Выберите завод для сравнения...</option>
              {availablePlants.map((plant, idx) => (
                <option key={idx} value={plant.name}>{plant.name} ({plant.city})</option>
              ))}
            </Form.Select>
          </Col>
          <Col md={4}>
            <Button
              variant="primary"
              onClick={handleCompare}
              disabled={!selectedPlant || loading}
              style={{ width: '100%' }}
            >
              {loading ? <i className="fas fa-spinner fa-spin me-1"></i> : <i className="fas fa-chart-simple me-1"></i>}
              {loading ? 'Загрузка...' : 'Сравнить'}
            </Button>
          </Col>
        </Row>

        {compareData && (
          <div>
            <h6 className="mb-3">
              Сравнение: {currentPlant?.name} vs {selectedPlant?.name}
            </h6>
            <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
              {currentData?.chartData?.map((item, idx) => {
                const compareItem = compareData.chartData?.find(c => c.name === item.name);
                const diff = compareItem ? (item.value2 - compareItem.value2).toFixed(2) : null;
                const diffColor = getComparisonColor(item.value2, compareItem?.value2 || 0);

                return (
                  <div key={idx} className="mb-2 p-2 border rounded" style={{ background: '#f8f9fa' }}>
                    <div className="d-flex justify-content-between align-items-center">
                      <div style={{ flex: 2, fontWeight: '600', fontSize: '13px' }}>
                        {item.name}
                      </div>
                      <div style={{ flex: 1, textAlign: 'center' }}>
                        <span className="badge bg-primary">{item.value2.toFixed(2)}</span>
                      </div>
                      <div style={{ flex: 1, textAlign: 'center' }}>
                        <span className="badge bg-secondary">{compareItem ? compareItem.value2.toFixed(2) : '—'}</span>
                      </div>
                      <div style={{ flex: 1, textAlign: 'center' }}>
                        {diff && (
                          <span className="badge" style={{ background: diffColor }}>
                            {diff > 0 ? `+${diff}` : diff}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-3 p-2 bg-light rounded">
              <div className="d-flex justify-content-between">
                <div><i className="fas fa-arrow-up text-success me-1"></i> Зелёный — выше</div>
                <div><i className="fas fa-arrow-down text-danger me-1"></i> Красный — ниже</div>
              </div>
            </div>
          </div>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          <i className="fas fa-times me-1"></i> Закрыть
        </Button>
      </Modal.Footer>
    </Modal>
  );
}