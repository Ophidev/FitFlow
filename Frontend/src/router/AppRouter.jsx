import React from 'react'
import { Routes, Route } from "react-router";
import Home from '../pages/Home.jsx';
import Login from "../pages/Login.jsx";
import MainLayout from '../layouts/MainLayout.jsx';

const AppRouter = () => {
  return (
    <Routes>
        <Route path="/" element={<MainLayout />}>
            {/* Public Routes */}
            <Route index element={<Home />} />
            <Route path="login" element={<Login />} />

            {/* Protected Routes */}

        </Route>
    </Routes>
  )
}

export default AppRouter