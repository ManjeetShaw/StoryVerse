import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Core Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import CreateBookPage from './pages/CreateBookPage';
import BookReaderPage from './pages/BookReaderPage';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Main Homepage */}
          <Route path="/" element={<HomePage />} />

          {/* PAGE 1: /login */}
          <Route path="/login" element={<LoginPage />} />

          {/* PAGE 2: /register */}
          <Route path="/register" element={<RegisterPage />} />

          {/* PAGE 3: /dashboard (protected in DashboardPage component) */}
          <Route path="/dashboard" element={<DashboardPage />} />

          {/* PAGE 4: /create (protected in CreateBookPage component) */}
          <Route path="/create" element={<CreateBookPage />} />

          {/* Reader View: /books/:id */}
          <Route path="/books/:id" element={<BookReaderPage />} />

          {/* Fallback route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
