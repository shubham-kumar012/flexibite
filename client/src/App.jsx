import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Profile from './pages/Profile';
import Onboarding from './pages/Onboarding';
import Dashboard from './pages/Dashboard';
import NutritionPlan from './pages/NutritionPlan';
import Foods from './pages/Foods';
import FoodDetails from './pages/FoodDetails';
import TodaysDiet from './pages/TodaysDiet';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import AdminFoods from './pages/admin/AdminFoods';
import AddFood from './pages/admin/AddFood';
import EditFood from './pages/admin/EditFood';
import { AuthProvider } from './context/AuthContext';

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/nutrition-plan"
          element={
            <ProtectedRoute>
              <NutritionPlan />
            </ProtectedRoute>
          }
        />
        <Route
          path="/foods"
          element={
            <ProtectedRoute>
              <Foods />
            </ProtectedRoute>
          }
        />
        <Route
          path="/foods/:id"
          element={
            <ProtectedRoute>
              <FoodDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/todays-diet"
          element={
            <ProtectedRoute>
              <TodaysDiet />
            </ProtectedRoute>
          }
        />
        <Route
          path="/onboarding"
          element={
            <ProtectedRoute>
              <Onboarding />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        {/* ADMIN ROUTES */}
        <Route
          path="/admin/foods"
          element={
            <AdminRoute>
              <AdminFoods />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/foods/new"
          element={
            <AdminRoute>
              <AddFood />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/foods/:id/edit"
          element={
            <AdminRoute>
              <EditFood />
            </AdminRoute>
          }
        />
      </Routes>
    </AuthProvider>
  );
}
