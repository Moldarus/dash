// src/routes/AppRoutes.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from '../pages/HomePage';
import DashboardPage from '../pages/DashboardPage';
import NotFoundPage from '../pages/NotFoundPage';  // ✅ Импортируем страницу 404

export default function AppRoutes() {
  return (
    <Routes>
      {/* Главная страница */}
      <Route path="/" element={<HomePage />} />
      
      {/* Страница дашборда */}
      <Route path="/dashboard" element={<DashboardPage />} />
      
      {/* ✅ Catch-all маршрут для всех несуществующих страниц */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}