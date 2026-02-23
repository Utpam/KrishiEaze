import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../features/auth/authSlice';

const Navbar = () => {
    const { isAuthenticated, user } = useSelector(state => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = () => {
        dispatch(logout());
        navigate('/');
    };

    return (
        <nav className="sticky top-0 z-50 w-full glass-effect bg-white/80 dark:bg-background-dark/90 border-b border-gray-200 dark:border-gray-800 shadow-sm transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">
                    <Link
                        to="/"
                        className="flex-shrink-0 flex items-center gap-2 cursor-pointer"
                    >
                        <span className="material-icons text-primary text-4xl">agriculture</span>
                        <span className="font-bold text-2xl tracking-tight text-primary dark:text-green-400">KrishiEaze</span>
                    </Link>

                    <div className="hidden md:flex space-x-8 items-center">
                        <Link to="/" className="text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-green-400 font-medium transition">Home</Link>
                        <Link to="/mandi" className="text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-green-400 font-medium transition">Mandi Prices</Link>
                        <Link to="/dashboard" className="text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-green-400 font-medium transition">Dashboard</Link>
                    </div>

                    <div className="flex items-center space-x-4">
                        <ThemeToggle />
                        {!isAuthenticated ? (
                            <>
                                <Link
                                    to="/login"
                                    className="hidden md:inline-flex items-center justify-center px-6 py-2 border border-transparent text-base font-medium rounded-full text-primary bg-white border-primary hover:bg-green-50 dark:bg-transparent dark:text-white dark:border-white dark:hover:bg-white/10 transition shadow-sm"
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/signup"
                                    className="inline-flex items-center justify-center px-6 py-2 border border-transparent text-base font-medium rounded-full text-white bg-primary hover:bg-green-700 dark:bg-primary dark:hover:bg-green-600 shadow-lg hover:shadow-xl transition transform hover:-translate-y-0.5"
                                >
                                    Sign Up
                                </Link>
                            </>
                        ) : (
                            <div className="flex items-center gap-3">
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-200 hidden sm:block">Hi, {user?.name?.split(' ')[0]}</span>
                                <button
                                    onClick={handleLogout}
                                    className="text-gray-500 hover:text-red-500 transition"
                                    title="Logout"
                                >
                                    <span className="material-icons">logout</span>
                                </button>
                                <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold border-2 border-primary/20">
                                    {user?.name?.charAt(0)}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
