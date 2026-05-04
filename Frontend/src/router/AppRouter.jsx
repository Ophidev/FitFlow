import React from "react";
import { Routes, Route, Navigate } from "react-router";
import { useSelector } from "react-redux";

import Home from "../pages/Home.jsx";
import Login from "../pages/Login.jsx";
import MainLayout from "../layouts/MainLayout.jsx";
import ProtectedRoute from "./ProtectedRoute.jsx";
import Profile from "../pages/Profile.jsx";
import NotFound from "../pages/NotFound.jsx";
import Dashboard from "../pages/Dashboard.jsx";

const AppRouter = () => {
  const user = useSelector((state) => state.user);

  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />

        {/* Login Route */}
        <Route
          path="login"
          element={user ? <Navigate to="/" replace /> : <Login />}
        />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/profile" element={<Profile />} />
          <Route path="/dashboard" element={<Dashboard/>} />
        </Route>

        {/* 404 fallback */}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
};

export default AppRouter;
