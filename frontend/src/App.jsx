import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import CreateBook from './pages/CreateBooks';
import ShowBook from './pages/ShowBook';
import EditBook from './pages/EditBook';
import DeleteBook from './pages/DeleteBook';
import Login from './pages/login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import AdminDashboard from './pages/AdminDashboard';
import ProtectedRoute from './components/common/ProtectedRoute';
import ReadingListModal from './components/ReadingListModal';

const App = () => {
  return (
    <div className="relative min-h-screen paper-canvas selection:bg-[#7B1826] selection:text-[#FAF7F2] transition-colors duration-300">
      <div className="relative z-10 flex flex-col min-h-screen">
        <ReadingListModal />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/books/details/:id" element={<ShowBook />} />

          {/* Create Book Route */}
          <Route
            path="/books/create"
            element={
              <ProtectedRoute>
                <CreateBook />
              </ProtectedRoute>
            }
          />
          <Route
            path="/books/edit/:id"
            element={
              <ProtectedRoute adminOnly={true}>
                <EditBook />
              </ProtectedRoute>
            }
          />
          <Route
            path="/books/delete/:id"
            element={
              <ProtectedRoute adminOnly={true}>
                <DeleteBook />
              </ProtectedRoute>
            }
          />

          {/* Grand Curator Admin Dashboard */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute adminOnly={true}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* 404 Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
