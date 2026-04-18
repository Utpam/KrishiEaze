import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { requestOtpThunk, verifyOtpThunk, clearError } from '../auth/authSlice';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [step, setStep] = useState(1);
    const [mobileNo, setMobileNo] = useState('');
    const [otp, setOtp] = useState('');
    
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, error } = useSelector((state) => state.auth);

    const handleRequestOtp = async (e) => {
        e.preventDefault();
        dispatch(clearError());
        const resultAction = await dispatch(requestOtpThunk({ mobileNo }));
        if (requestOtpThunk.fulfilled.match(resultAction)) {
            setStep(2);
        }
    };

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        dispatch(clearError());
        const resultAction = await dispatch(verifyOtpThunk({ mobileNo, otp }));
        if (verifyOtpThunk.fulfilled.match(resultAction)) {
            const isNewUser = resultAction.payload.isNewUser;
            if (isNewUser) {
                // If it's a new user, redirect them to a profile setup page or signup
                navigate('/signup?setup=true');
            } else {
                navigate('/dashboard');
            }
        }
    };

    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark flex items-center justify-center px-4 py-8 transition-colors duration-200">
            <div className="max-w-md w-full bg-white dark:bg-card-dark rounded-xl md:rounded-2xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700">
                <div className="p-6 md:p-8">
                    <div className="text-center mb-6 md:mb-8">
                        <span className="material-icons text-primary text-4xl md:text-5xl mb-2">agriculture</span>
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Welcome Back</h2>
                        <p className="text-sm md:text-base text-gray-500 dark:text-gray-400 mt-2">
                            {step === 1 ? 'Sign in with your mobile number' : 'Enter the OTP sent to your number'}
                        </p>
                    </div>

                    {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-xs md:text-sm">{error}</div>}

                    {step === 1 ? (
                        <form onSubmit={handleRequestOtp} className="space-y-4 md:space-y-6">
                            <div>
                                <label className="block text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Mobile Number</label>
                                <input
                                    type="tel"
                                    required
                                    className="w-full px-4 py-2.5 md:py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-all text-sm md:text-base"
                                    placeholder="Enter 10-digit mobile number"
                                    value={mobileNo}
                                    onChange={(e) => setMobileNo(e.target.value)}
                                    pattern="[0-9]{10}"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading || mobileNo.length !== 10}
                                className="w-full bg-primary hover:bg-green-700 text-white font-bold py-2.5 md:py-3 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base"
                            >
                                {loading ? 'Requesting...' : 'Get OTP'}
                            </button>
                        </form>
                    ) : (
                        <form onSubmit={handleVerifyOtp} className="space-y-4 md:space-y-6">
                            <div>
                                <label className="block text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Enter OTP</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full px-4 py-2.5 md:py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-all text-sm md:text-base text-center tracking-widest text-lg"
                                    placeholder="••••••"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    maxLength={6}
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading || otp.length < 4}
                                className="w-full bg-primary hover:bg-green-700 text-white font-bold py-2.5 md:py-3 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base"
                            >
                                {loading ? 'Verifying...' : 'Verify OTP'}
                            </button>
                            
                            <button
                                type="button"
                                onClick={() => setStep(1)}
                                className="w-full mt-2 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                            >
                                Change Mobile Number
                            </button>
                        </form>
                    )}

                    <div className="mt-6 text-center text-xs md:text-sm text-gray-500 dark:text-gray-400">
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
