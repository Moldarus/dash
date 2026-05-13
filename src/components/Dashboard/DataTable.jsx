import React from 'react';
import { Card, Table, Button, Collapse } from 'react-bootstrap';

function SectionRow({ section, onToggle }) {
  return (
    <>
      <tr 
        className="table-primary fw-bold" 
        style={{ cursor: 'pointer' }} 
        onClick={() => onToggle(section.sectionName)}
      >
        <td>
          <Button variant="link" className="p-0 me-2 text-decoration-none text-dark">
            {section.isOpen ? '▼' : '▶'}
          </Button>
          {section.sectionName}
        </td>
        <td className="text-center">{section.sectionValue1?.toFixed(2)}</td>
        <td className="text-center">{section.sectionValue2?.toFixed(2)}</td>
        <td className="text-center">{section.coefficient}</td>
        <td className="text-center">
          <span className={`badge ${
            section.sectionValue1 >= 4 ? 'bg-success' : 
            section.sectionValue1 >= 3 ? 'bg-warning text-dark' : 'bg-danger'
          }`}>
            {section.sectionValue1 >= 4 ? 'Отлично' : section.sectionValue1 >= 3 ? 'Хорошо' : 'Требует работы'}
          </span>
        </td>
      </tr>
      
      <Collapse in={section.isOpen}>
        <tbody>
          {section.categories?.map((cat, idx) => (
            <tr key={idx} className="table-light small">
              <td className="ps-5">└─ {cat.name}</td>
              <td className="text-center">{cat.value?.toFixed(2)}</td>
              <td className="text-center">—</td>
              <td className="text-center">—</td>
              <td className="text-center">
                <span className={`badge ${
                  cat.value >= 4 ? 'bg-success' : 
                  cat.value >= 3 ? 'bg-warning text-dark' : 'bg-danger'
                }`}>
                  {cat.value >= 4 ? '✓' : cat.value >= 3 ? '○' : '✗'}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </Collapse>
    </>
  );
}

export default function DataTable({ data, onToggle, onToggleAll }) {
  return (
    <Card>
      <Card.Header className="d-flex justify-content-between align-items-center">
        <h5 className="mb-0">Детальные результаты</h5>
        <div>
          <Button size="sm" variant="outline-secondary" className="me-2" onClick={() => onToggleAll(true)}>
            Развернуть все
          </Button>
          <Button size="sm" variant="outline-secondary" onClick={() => onToggleAll(false)}>
            Свернуть все
          </Button>
        </div>
      </Card.Header>
      <Card.Body className="p-0">
        <Table responsive striped hover className="mb-0">
          <thead className="table-dark">
            <tr>
              <th>Раздел / Категория</th>
              <th className="text-center">Обычные</th>
              <th className="text-center">Оценочные</th>
              <th className="text-center">Коэфф.</th>
              <th className="text-center">Статус</th>
            </tr>
          </thead>
          <tbody>
            {data.map((section, idx) => (
              <SectionRow key={idx} section={section} onToggle={onToggle} />
            ))}
          </tbody>
        </Table>
      </Card.Body>
    </Card>
  );
}