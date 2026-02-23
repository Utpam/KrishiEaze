import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import MandiPrices from './pages/MandiPrices';
import SellProduce from './pages/SellProduce';
import OrderDetails from './pages/OrderDetails';
import Login from './pages/Login';
import Signup from './pages/Signup';
import { useSelector } from 'react-redux';

const PrivateRoute = ({ children }) => {
    const { isAuthenticated } = useSelector((state) => state.auth);
    return isAuthenticated ? children : <Navigate to="/login" />;
};

const App = () => {
    return (
        <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/mandi" element={<MandiPrices />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* Protected Routes */}
            <Route
                path="/dashboard"
                element={
                    <PrivateRoute>
                        <Dashboard />
                    </PrivateRoute>
                }
            />
            <Route
                path="/sell"
                element={
                    <PrivateRoute>
                        <SellProduce />
                    </PrivateRoute>
                }
            />
            <Route
                path="/orders"
                element={
                    <PrivateRoute>
                        <OrderDetails />
                    </PrivateRoute>
                }
            />

            {/* Catch all - redirect to landing */}
            <Route path="*" element={<Navigate to="/" />} />
        </Routes>
    );
};

export default App;
