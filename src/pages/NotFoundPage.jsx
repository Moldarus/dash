// src/pages/NotFoundPage.jsx
import React from 'react';
import { Container, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <Container 
      fluid 
      className="d-flex justify-content-center align-items-center" 
      style={{ 
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e8ec 100%)'
      }}
    >
      <Card 
        className="text-center" 
        style={{ 
          maxWidth: '500px',
          width: '100%',
          border: 'none',
          borderRadius: '16px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)'
        }}
      >
        <Card.Body className="p-5">
          {/* Иконка ошибки */}
          <div style={{ 
            fontSize: '80px', 
            fontWeight: '700', 
            color: '#1a3a5c',
            marginBottom: '10px'
          }}>
            404
          </div>
          
          <h2 className="mb-3" style={{ color: '#1a3a5c', fontWeight: '700' }}>
            Страница не найдена
          </h2>
          
          <p className="text-muted mb-4" style={{ fontSize: '16px' }}>
            К сожалению, страница, которую вы ищете, не существует или была перемещена.
          </p>
          
          {/* Кнопки навигации */}
          <div className="d-flex gap-3 justify-content-center">
            <Link to="/">
              <Button 
                variant="primary" 
                size="lg"
                style={{ 
                  background: 'linear-gradient(135deg, #2c5aa0 0%, #1e40af 100%)',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '12px 32px',
                  fontWeight: '600'
                }}
              >
                🏠 На главную
              </Button>
            </Link>
            
            <Button 
              variant="outline-primary" 
              size="lg"
              onClick={() => window.history.back()}
              style={{ 
                borderColor: '#2c5aa0',
                color: '#2c5aa0',
                borderRadius: '8px',
                padding: '12px 32px',
                fontWeight: '600'
              }}
            >
              ← Назад
            </Button>
          </div>
          
          {/* Дополнительная информация */}
          <div className="mt-5 pt-4" style={{ borderTop: '1px solid #dee2e6' }}>
            <p className="text-muted small mb-0">
              Если вы считаете, что это ошибка, пожалуйста, свяжитесь с администратором системы.
            </p>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
}