import { Link, useNavigate } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../auth/authSlice';
import Logo_No_text from '../../Public/Logo_No_text.png';
import { useState } from 'react';

const Navbar = () => {
    const { isAuthenticated, user } = useSelector(state => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleLogout = () => {
        dispatch(logout());
        navigate('/');
    };

    return (
        <nav className="sticky top-0 z-50 w-full glass-effect bg-white/80 dark:bg-background-dark/90 border-b border-gray-200 dark:border-gray-800 shadow-sm transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">
                    
                    {/* Logo - Always show on non-auth. On auth, show only on mobile since desktop has sidebar logo */}
                    <Link
                        to="/"
                        className={`flex-shrink-0 flex items-center gap-2 cursor-pointer ${user ? 'md:hidden' : ''}`}
                    >
                        <span className="material-icons text-primary text-4xl">
                            <img src={Logo_No_text} className='w-[3rem] md:w-[4rem]' alt="Logo" />
                        </span>
                        <span className="font-bold text-xl md:text-2xl tracking-tight text-primary dark:text-green-400">Krishiaze</span>
                    </Link>

                    {/* Desktop Links (Non-auth) */}
                    {!user && (
                        <div className="hidden md:flex space-x-8 items-center">
                            <Link to="/" className="text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-green-400 font-medium transition">Home</Link>
                            <Link to="/mandi" className="text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-green-400 font-medium transition">Mandi Prices</Link>
                            <Link to="/dashboard" className="text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-green-400 font-medium transition">Dashboard</Link>
                        </div>
                    )}

                    <div className="flex items-center space-x-3 md:space-x-4">
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
                                    className="hidden md:inline-flex items-center justify-center px-6 py-2 border border-transparent text-base font-medium rounded-full text-white bg-primary hover:bg-green-700 dark:bg-primary dark:hover:bg-green-600 shadow-lg hover:shadow-xl transition transform hover:-translate-y-0.5"
                                >
                                    Sign Up
                                </Link>
                                
                                {/* Mobile Menu Toggle */}
                                <button 
                                    className="md:hidden p-2 text-gray-600 dark:text-gray-300"
                                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                >
                                    <span className="material-icons">{isMobileMenuOpen ? 'close' : 'menu'}</span>
                                </button>
                            </>
                        ) : (
                            <div className="flex items-center gap-2 md:gap-3">
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-200 hidden sm:block">Hi, {user?.name?.split(' ')[0]}</span>
                                <button
                                    onClick={handleLogout}
                                    className="p-1 md:p-2 text-gray-500 hover:text-red-500 transition"
                                    title="Logout"
                                >
                                    <span className="material-icons">logout</span>
                                </button>
                                <div className="h-8 w-8 md:h-10 md:w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold border-2 border-primary/20 text-sm md:text-base">
                                    {user?.name?.charAt(0) || 'U'}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Mobile Menu Dropdown (Non-auth) */}
            {!isAuthenticated && isMobileMenuOpen && (
                <div className="md:hidden bg-white dark:bg-card-dark border-b border-gray-200 dark:border-gray-800 shadow-lg">
                    <div className="px-4 pt-2 pb-6 space-y-4">
                        <Link to="/" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-primary transition" onClick={() => setIsMobileMenuOpen(false)}>Home</Link>
                        <Link to="/mandi" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-primary transition" onClick={() => setIsMobileMenuOpen(false)}>Mandi Prices</Link>
                        <Link to="/dashboard" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-primary transition" onClick={() => setIsMobileMenuOpen(false)}>Dashboard</Link>
                        
                        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                            <Link
                                to="/login"
                                className="flex items-center justify-center px-4 py-2 border border-primary text-base font-medium rounded-full text-primary bg-white dark:bg-transparent dark:text-white dark:border-white transition"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Login
                            </Link>
                            <Link
                                to="/signup"
                                className="flex items-center justify-center px-4 py-2 border border-transparent text-base font-medium rounded-full text-white bg-primary hover:bg-green-700 shadow-md transition"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Sign Up
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
