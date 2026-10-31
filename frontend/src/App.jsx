import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/common/ProtectedRoute';
import ReadingListModal from './components/ReadingListModal';
import PageLoader from './components/common/PageLoader';

// Eager load Home for instant first contentful paint
import Home from './pages/Home';

// Code-split heavy routes for lightning-fast bundles
const ShowBook = lazy(() => import('./pages/ShowBook'));
const Login = lazy(() => import('./pages/login'));
const Register = lazy(() => import('./pages/Register'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const ResetPassword = lazy(() => import('./pages/ResetPassword'));
const CreateBook = lazy(() => import('./pages/CreateBooks'));
const EditBook = lazy(() => import('./pages/EditBook'));
const DeleteBook = lazy(() => import('./pages/DeleteBook'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));

const App = () => {
  return (
    <div className="relative min-h-screen paper-canvas selection:bg-[#7B1826] selection:text-[#FAF7F2] transition-colors duration-300">
      <div className="relative z-10 flex flex-col min-h-screen">
        <ReadingListModal />
        
        <Suspense fallback={<PageLoader />}>
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
        </Suspense>
      </div>
    </div>
  );
};

export default App;
