import React, { useState, useEffect, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchProfileThunk } from './auth/authSlice';
import GlobalLoader from './components/GlobalLoader';

const Landing = React.lazy(() => import('./pages/Landing'));
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const MandiPrices = React.lazy(() => import('./pages/MandiPrices'));
const SellProduce = React.lazy(() => import('./pages/SellProduce'));
const OrderDetails = React.lazy(() => import('./pages/OrderDetails'));
const Login = React.lazy(() => import('./pages/Login'));
const Signup = React.lazy(() => import('./pages/Signup'));
const Profile = React.lazy(() => import('./pages/Profile'));

const PrivateRoute = ({ children }) => {
    const { isAuthenticated } = useSelector((state) => state.auth);
    return isAuthenticated ? children : <Navigate to="/login" />;
};

const App = () => {
    const [isAppLoaded, setIsAppLoaded] = useState(false);
    const dispatch = useDispatch();
    const { isAuthenticated, user } = useSelector((state) => state.auth);

    useEffect(() => {
        if (isAuthenticated && !user) {
            dispatch(fetchProfileThunk());
        }
    }, [isAuthenticated, user, dispatch]);

    useEffect(() => {
        const handleLoad = () => {
            setIsAppLoaded(true);
        };

        if (document.readyState === 'complete') {
            setIsAppLoaded(true);
        } else {
            window.addEventListener('load', handleLoad);
            // Fallback in case load event already fired or is stuck
            const timer = setTimeout(() => setIsAppLoaded(true), 10000);
            return () => {
                window.removeEventListener('load', handleLoad);
                clearTimeout(timer);
            };
        }
    }, []);

    return (
        <>
            {!isAppLoaded && <GlobalLoader />}
            <Suspense fallback={<GlobalLoader />}>
                <Routes>
                    <Route path="/" element={<Landing />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />

                    {/* Protected Routes */}
                    <Route 
                        path="/mandi" 
                        element={
                            <PrivateRoute>
                                <MandiPrices />
                            </PrivateRoute>
                        } 
                    />
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
                        path="/profile"
                        element={
                            <PrivateRoute>
                                <Profile />
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
            </Suspense>
        </>
    );
};

export default App;
