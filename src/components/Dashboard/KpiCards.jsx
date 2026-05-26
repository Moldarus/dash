// src/components/Dashboard/KpiCards.jsx
import React from 'react';
import { Row, Col, Card } from 'react-bootstrap';

const COLORS = {
  brightGreen: '#92D050',
  brightRed: '#C0504D',
  darkBlue: '#1a3a5c',
  lightBlue: '#e3f2fd',
  white: '#ffffff'
};

export default function KpiCards({ totalProgress, pointsToGoal, bestSection, worstSection }) {
  return (
    <Row className="mb-4">
      <Col md={3}>
        <Card className="h-100" style={{
          background: COLORS.darkBlue,
          color: COLORS.white,
          border: 'none',
          borderRadius: '8px'
        }}>
          <Card.Body>
            <div>
              <h6 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px' }}>Общий прогресс от аудита</h6>
              <h2 style={{ fontSize: '36px', fontWeight: '700', marginBottom: '4px' }}>{totalProgress}%</h2>
              <small style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px' }}>от целевого 5.00</small>
            </div>
          </Card.Body>
        </Card>
      </Col>

      <Col md={3}>
        <Card className="h-100" style={{
          background: COLORS.darkBlue,
          color: COLORS.white,
          border: `1px solid ${COLORS.darkBlue}`,
          borderRadius: '8px'
        }}>
          <Card.Body>
            <div>
              <h6 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '1px' }}>До цели</h6>
              <h2 style={{ fontSize: '36px', fontWeight: '700', marginBottom: '4px' }}>{pointsToGoal}</h2>
              <small style={{ fontSize: '15px', fontWeight: '700', marginBottom: '4px' }}>баллов осталось</small>
            </div>
          </Card.Body>
        </Card>
      </Col>

      <Col md={3}>
        <Card className="h-100" style={{
          background: COLORS.brightGreen,
          color: COLORS.white,
          border: `0px solid ${COLORS.darkBlue}`,
          borderRadius: '8px'
        }}>
          <Card.Body>
            <div>
              <h6 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '1px' }}>Раздел-лидер</h6>
              <small style={{ fontSize: '36px', fontWeight: '700', marginBottom: '4px' }}>
                {bestSection ? bestSection.value2.toFixed(2) : 0} / 5.00
              </small>
              <h5 style={{ fontSize: '15px', fontWeight: '700', marginBottom: '4px' }}>
                {bestSection ? bestSection.name.substring(0, 25) : 'Н/Д'}
              </h5>
            </div>
          </Card.Body>
        </Card>
      </Col>

      <Col md={3}>
        <Card className="h-100" style={{
          background: COLORS.brightRed,
          color: COLORS.white,
          border: 'none',
          borderRadius: '8px'
        }}>
          <Card.Body>
            <div>
              <h6 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '1px' }}>Зона роста</h6>
              <small style={{ fontSize: '36px', fontWeight: '700', marginBottom: '1px' }}>
                {worstSection ? worstSection.value2.toFixed(2) : 0} / 5.00
              </small>
              <h5 style={{ fontSize: '15px', fontWeight: '700', marginBottom: '4px' }}>
                {worstSection ? worstSection.name.substring(0, 25) : 'Н/Д'}
              </h5>
            </div>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
}