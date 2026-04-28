import React from 'react'
import { Routes, Route } from "react-router";
import Home from '../pages/Home.jsx';
import Login from "../pages/Login.jsx";
import MainLayout from '../layouts/MainLayout.jsx';
import ProtectedRoute from './ProtectedRoute.jsx';
import Profile from '../pages/Profile.jsx';

const AppRouter = () => {
  return (
    <Routes>
        <Route path="/" element={<MainLayout />}>
            {/* Public Routes */}
            <Route path="/" element={<Home/>} />
            <Route path="/login" element={<Login />} />

            {/* Protected Routes */}
            <Route element={<ProtectedRoute/>}>
            <Route path="/profile" element={<Profile/>}/>

            </Route>

        </Route>
    </Routes>
  )
}

export default AppRouter