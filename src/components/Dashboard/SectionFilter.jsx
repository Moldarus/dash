// src/components/Dashboard/SectionFilter.jsx
import React, { useState } from 'react';
import { Badge, Button } from 'react-bootstrap';

export default function SectionFilter({ sections, onFilterChange }) {
  const [activeFilters, setActiveFilters] = useState([]);

  const toggleFilter = (sectionName) => {
    const newFilters = activeFilters.includes(sectionName)
      ? activeFilters.filter(s => s !== sectionName)
      : [...activeFilters, sectionName];

    setActiveFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearAll = () => {
    setActiveFilters([]);
    onFilterChange([]);
  };

  return (
    <div style={{
      padding: '15px 20px',
      background: '#f8f9fa',
      borderRadius: '12px',
      border: '1px solid #e9ecef'
    }}>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h6 style={{ fontWeight: '700', margin: 0, color: '#1a3a5c' }}>
          <i className="fas fa-filter me-2"></i>
          Фильтр по разделам
          {activeFilters.length > 0 && (
            <span className="ms-2 badge bg-primary" style={{ fontSize: '12px' }}>
              {activeFilters.length} выбрано
            </span>
          )}
        </h6>
        {activeFilters.length > 0 && (
          <Button
            variant="link"
            size="sm"
            onClick={clearAll}
            style={{ color: '#dc3545', textDecoration: 'none' }}
          >
            <i className="fas fa-times me-1"></i>
            Сбросить все
          </Button>
        )}
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
        {sections.map((section, idx) => {
          const isActive = activeFilters.includes(section.name);
          return (
            <span
              key={idx}
              onClick={() => toggleFilter(section.name)}
              style={{
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 16px',
                fontSize: '13px',
                fontWeight: '500',
                borderRadius: '50px',
                background: isActive ? '#e9ecef' : '#1a3a5c',
                color: isActive ? '#1a3a5c' : '#ffffff',
                transition: 'all 0.2s ease'
              }}
            >
              {isActive && <i className="fas fa-check-circle" style={{ fontSize: '12px', color: '#ffffff' }}></i>}
              {section.name}
            </span>
          );
        })}
      </div>
    </div>
  );
}