// src/components/SkeletonLoader.jsx
import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

export default function SkeletonLoader() {
  return (
    <Container className="mt-4">
      <div className="mb-4">
        <div className="skeleton" style={{ width: '300px', height: '32px', marginBottom: '10px', borderRadius: '8px' }}></div>
        <div className="skeleton" style={{ width: '200px', height: '20px', borderRadius: '8px' }}></div>
      </div>

      <Row className="mb-4">
        {[1, 2, 3, 4].map(i => (
          <Col md={3} key={i} className="mb-3">
            <div className="skeleton" style={{ height: '130px', borderRadius: '16px' }}></div>
          </Col>
        ))}
      </Row>

      <Row className="mb-4">
        <Col md={6}>
          <div className="skeleton" style={{ height: '120px', borderRadius: '16px' }}></div>
        </Col>
        <Col md={6}>
          <div className="skeleton" style={{ height: '120px', borderRadius: '16px' }}></div>
        </Col>
      </Row>

      <Row>
        <Col md={5}>
          <div className="skeleton" style={{ height: '450px', borderRadius: '12px' }}></div>
        </Col>
        <Col md={7}>
          <div className="skeleton" style={{ height: '450px', borderRadius: '12px' }}></div>
        </Col>
      </Row>

      <Row className="mt-4">
        <Col md={12}>
          <div className="skeleton" style={{ height: '500px', borderRadius: '12px' }}></div>
        </Col>
      </Row>

      <style>{`
        .skeleton {
          background: linear-gradient(90deg, #e0e0e0 25%, #f0f0f0 50%, #e0e0e0 75%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
        }
        .dark-theme .skeleton {
          background: linear-gradient(90deg, #2a2a2a 25%, #3a3a3a 50%, #2a2a2a 75%);
          background-size: 200% 100%;
        }
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </Container>
  );
}