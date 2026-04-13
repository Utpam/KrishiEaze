import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { signupStart, signupSuccess, signupFailure } from '../auth/authSlice';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'Farmer'
    });

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, error } = useSelector((state) => state.auth);

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(signupStart());

        // Simulate API call
        setTimeout(() => {
            if (formData.email && formData.password) {
                dispatch(signupSuccess({
                    name: formData.name,
                    email: formData.email,
                    type: formData.role
                }));
                navigate('/dashboard');
            } else {
                dispatch(signupFailure('Please fill in all fields'));
            }
        }, 1000);
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark flex items-center justify-center px-4 py-6 md:py-8 transition-colors duration-200">
            <div className="max-w-md w-full bg-white dark:bg-card-dark rounded-xl md:rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 flex flex-col max-h-[95vh] md:max-h-[90vh]">
                <div className="p-6 md:p-8 overflow-y-auto custom-scrollbar">
                    <div className="text-center mb-6 md:mb-8">
                        <span className="material-icons text-primary text-4xl md:text-5xl mb-2">person_add</span>
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Create Account</h2>
                        <p className="text-sm md:text-base text-gray-500 dark:text-gray-400 mt-2">Join the KrishiEaze community</p>
                    </div>

                    {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-xs md:text-sm">{error}</div>}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
                            <input
                                name="name"
                                type="text"
                                required
                                className="w-full px-4 py-2.5 md:py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-all text-sm md:text-base"
                                placeholder="Ramesh Patel"
                                value={formData.name}
                                onChange={handleChange}
                            />
                        </div>

                        <div>
                            <label className="block text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email Address</label>
                            <input
                                name="email"
                                type="email"
                                required
                                className="w-full px-4 py-2.5 md:py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-all text-sm md:text-base"
                                placeholder="ramesh@example.com"
                                value={formData.email}
                                onChange={handleChange}
                            />
                        </div>

                        <div>
                            <label className="block text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password</label>
                            <input
                                name="password"
                                type="password"
                                required
                                className="w-full px-4 py-2.5 md:py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-all text-sm md:text-base"
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={handleChange}
                            />
                        </div>

                        <div>
                            <label className="block text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">I am a</label>
                            <div className="grid grid-cols-2 gap-3 md:gap-4">
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, role: 'Farmer' })}
                                    className={`p-2.5 md:p-3 rounded-xl border flex flex-col md:flex-row items-center justify-center gap-2 transition-all ${formData.role === 'Farmer' ? 'border-primary bg-green-50 dark:bg-green-900/20 text-primary' : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'}`}
                                >
                                    <span className="material-icons text-xl md:text-2xl">agriculture</span>
                                    <span className="font-medium text-xs md:text-sm">Farmer</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, role: 'Buyer' })}
                                    className={`p-2.5 md:p-3 rounded-xl border flex flex-col md:flex-row items-center justify-center gap-2 transition-all ${formData.role === 'Buyer' ? 'border-primary bg-green-50 dark:bg-green-900/20 text-primary' : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'}`}
                                >
                                    <span className="material-icons text-xl md:text-2xl">storefront</span>
                                    <span className="font-medium text-xs md:text-sm">Buyer</span>
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-primary hover:bg-green-700 text-white font-bold py-2.5 md:py-3 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 mt-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base"
                        >
                            {loading ? 'Creating Account...' : 'Sign Up'}
                        </button>
                    </form>

                    <div className="mt-6 text-center text-xs md:text-sm text-gray-500 dark:text-gray-400">
                        Already have an account?{' '}
                        <button onClick={() => navigate('/login')} className="text-primary font-bold hover:underline">
                            Sign In
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Signup;
