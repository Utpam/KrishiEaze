import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginStart, loginSuccess, loginFailure } from '../auth/authSlice';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
    const [mobileNo, setMobileNo] = useState('');
    const [otp, setOtp] = useState('');
    const [step, setStep] = useState(1);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, error } = useSelector((state) => state.auth);

    const handleSendOtp = async (e) => {
        e.preventDefault();
        dispatch(loginFailure(null)); // Clear previous errors
        
        if (mobileNo.length !== 10) {
            dispatch(loginFailure('Please enter a valid 10-digit mobile number'));
            return;
        }

        dispatch(loginStart());

        try {
            await axios.post('http://localhost:8080/auth/signup-request', {
                mobileNo
            });
            
            // Once sent, stop loading state but don't consider it logged in. 
            // We just clear error state and proceed to step 2.
            // Using loginFailure(null) is a hacky way to stop loading if authSlice doesn't have an explicit 'stopLoading'
            dispatch(loginFailure(null)); 
            setStep(2);
        } catch (err) {
            console.error('Failed to send OTP:', err.response?.data?.message || err.message);
            dispatch(loginFailure(err.response?.data?.message || 'Failed to send OTP'));
        }
    };

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        dispatch(loginStart());

        try {
            const res = await axios.post('http://localhost:8080/auth/verify-otp', {
                mobileNo,
                otp
            });
            
            if (res.data) {
                dispatch(loginSuccess(res.data));
                localStorage.setItem('krishieaze_token', res.data.tokenResponse?.accessToken || res.data.token || res.data.accessToken);
                
                // Backend returns "newUser", redirect to appropriate setup if needed in future, currently going to dashboard.
                if (res.data.newUser) {
                    navigate('/dashboard'); 
                } else {
                    navigate('/dashboard');
                }
            }
        } catch (err) {
            console.error('Login failed:', err.response?.data?.message || err.message);
            dispatch(loginFailure(err.response?.data?.message || 'Invalid OTP'));
        }
    };

    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark flex items-center justify-center px-4 transition-colors duration-200">
            <div className="max-w-md w-full bg-white dark:bg-card-dark rounded-2xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700">
                <div className="p-8">
                    <div className="text-center mb-8">
                        <span className="material-icons text-primary text-5xl mb-2">{step === 1 ? 'agriculture' : 'password'}</span>
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                            {step === 1 ? 'Welcome Back' : 'Verify OTP'}
                        </h2>
                        <p className="text-gray-500 dark:text-gray-400 mt-2">
                            {step === 1 ? 'Enter your mobile number to sign in' : `We've sent a code to +91 ${mobileNo}`}
                        </p>
                    </div>

                    {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">{error}</div>}

                    {step === 1 ? (
                        <form onSubmit={handleSendOtp} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Mobile Number</label>
                                <div className="relative">
                                    <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-500 dark:text-gray-400">
                                        +91
                                    </span>
                                    <input
                                        type="tel"
                                        required
                                        maxLength={10}
                                        className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-all"
                                        placeholder="Enter 10 digit number"
                                        value={mobileNo}
                                        onChange={(e) => setMobileNo(e.target.value.replace(/\D/g, ''))}
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading || mobileNo.length !== 10}
                                className="w-full bg-primary hover:bg-green-700 text-white font-bold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Sending OTP...' : 'Get OTP'}
                            </button>
                        </form>
                    ) : (
                        <form onSubmit={handleVerifyOtp} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Enter OTP</label>
                                <input
                                    type="text"
                                    required
                                    maxLength={6}
                                    className="w-full px-4 py-3 text-center tracking-widest text-xl rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-all"
                                    placeholder="••••••"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading || otp.length !== 6}
                                className="w-full bg-primary hover:bg-green-700 text-white font-bold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Verifying...' : 'Verify & Login'}
                            </button>
                            
                            <div className="text-center mt-4">
                                <button
                                    type="button"
                                    onClick={() => setStep(1)}
                                    className="text-sm text-primary hover:underline"
                                >
                                    Change Mobile Number
                                </button>
                            </div>
                        </form>
                    )}

                    <div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
                        Don't have an account?{' '}
                        <button onClick={() => navigate('/signup')} className="text-primary font-bold hover:underline">
                            Create Account
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
