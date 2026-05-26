// src/routes/AppRoutes.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from '../pages/HomePage';
import DashboardPage from '../pages/DashboardPage';
import PrintPage from '../pages/PrintPage';
import RatingPage from '../pages/RatingPage';
import NotFoundPage from '../pages/NotFoundPage';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/print" element={<PrintPage />} />
      <Route path="/rating" element={<RatingPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}