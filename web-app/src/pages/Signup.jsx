import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { requestOtpThunk, verifyOtpThunk, updateProfileThunk, clearError } from '../auth/authSlice';
import { useNavigate, useLocation } from 'react-router-dom';

const Signup = () => {
    // If navigated here with ?setup=true from login
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const initialStep = queryParams.get('setup') === 'true' ? 2 : 1;

    const [step, setStep] = useState(initialStep);
    
    // Step 1 data
    const [mobileNo, setMobileNo] = useState('');
    
    // Step 2 & 3 data
    const [otp, setOtp] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [firstName, setFirstName] = useState('');
    const [middleName, setMiddleName] = useState('');
    const [surName, setSurName] = useState('');
    const [role, setRole] = useState('Farmer');
    const [address, setAddress] = useState('');
    const [village, setVillage] = useState('');
    const [district, setDistrict] = useState('');
    const [stateName, setStateName] = useState('');
    const [pincode, setPincode] = useState('');

    // To track auth state if we came from login where OTP is already verified
    const [otpVerified, setOtpVerified] = useState(initialStep === 2);

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

    const handleFinalize = async (e) => {
        e.preventDefault();
        dispatch(clearError());

        // We only verify OTP if it's not already verified
        if (!otpVerified) {
            const verifyResult = await dispatch(verifyOtpThunk({ mobileNo, otp }));
            if (!verifyOtpThunk.fulfilled.match(verifyResult)) {
                return; // Stop if verification failed
            }
            setOtpVerified(true);
        }


        // Proceed to update profile
        const updateResult = await dispatch(updateProfileThunk({
            firstName,
            middleName,
            surName,
            address,
            state: stateName,
            district,
            pinCode: pincode,
            roles: [`ROLE_${role.toUpperCase()}`]
        }));

        if (updateProfileThunk.fulfilled.match(updateResult)) {
            navigate('/dashboard');
        }
    };

    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark flex items-center justify-center px-4 py-6 md:py-8 transition-colors duration-200">
            <div className="max-w-md w-full bg-white dark:bg-card-dark rounded-xl md:rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 flex flex-col max-h-[95vh] md:max-h-[90vh]">
                <div className="p-6 md:p-8 overflow-y-auto custom-scrollbar">
                    <div className="text-center mb-6 md:mb-8">
                        <span className="material-icons text-primary text-4xl md:text-5xl mb-2">person_add</span>
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Create Account</h2>
                        <p className="text-sm md:text-base text-gray-500 dark:text-gray-400 mt-2">
                            {step === 1 ? 'Join the KrishiEaze community' : 'Complete your profile setup'}
                        </p>
                    </div>

                    {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-xs md:text-sm">{error}</div>}

                    {step === 1 ? (
                        <form onSubmit={handleRequestOtp} className="space-y-4">
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
                                className="w-full bg-primary hover:bg-green-700 text-white font-bold py-2.5 md:py-3 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 mt-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base"
                            >
                                {loading ? 'Requesting...' : 'Get OTP'}
                            </button>
                        </form>
                    ) : (
                        <form onSubmit={handleFinalize} className="space-y-4">
                            {!otpVerified && (
                                <div>
                                    <label className="block text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Enter OTP</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full px-4 py-2.5 md:py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-all text-sm md:text-base tracking-widest text-center"
                                        placeholder="••••••"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value)}
                                        maxLength={6}
                                    />
                                </div>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">First Name</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full px-4 py-2.5 md:py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-all text-sm md:text-base"
                                        placeholder="e.g. Ramesh"
                                        value={firstName}
                                        onChange={(e) => setFirstName(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Middle Name</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full px-4 py-2.5 md:py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-all text-sm md:text-base"
                                        placeholder="e.g. Kumar"
                                        value={middleName}
                                        onChange={(e) => setMiddleName(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Surname</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full px-4 py-2.5 md:py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-all text-sm md:text-base"
                                        placeholder="e.g. Patel"
                                        value={surName}
                                        onChange={(e) => setSurName(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Username</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full px-4 py-2.5 md:py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-all text-sm md:text-base"
                                        placeholder="ramesh_p"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                                    <input
                                        type="email"
                                        className="w-full px-4 py-2.5 md:py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-all text-sm md:text-base"
                                        placeholder="Optional"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Pincode</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full px-4 py-2.5 md:py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-all text-sm md:text-base"
                                        placeholder="123456"
                                        value={pincode}
                                        onChange={(e) => setPincode(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">State</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full px-4 py-2.5 md:py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-all text-sm md:text-base"
                                        placeholder="e.g. Maharashtra"
                                        value={stateName}
                                        onChange={(e) => setStateName(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">District</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full px-4 py-2.5 md:py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-all text-sm md:text-base"
                                        placeholder="e.g. Pune"
                                        value={district}
                                        onChange={(e) => setDistrict(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Village/City</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full px-4 py-2.5 md:py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-all text-sm md:text-base"
                                        placeholder="e.g. Shirur"
                                        value={village}
                                        onChange={(e) => setVillage(e.target.value)}
                                    />
                                </div>
                            </div>
                            
                            <div>
                                <label className="block text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Address</label>
                                <textarea
                                    required
                                    className="w-full px-4 py-2.5 md:py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-all text-sm md:text-base"
                                    placeholder="Enter your detailed address"
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                    rows="2"
                                />
                            </div>

                            <div>
                                <label className="block text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">I am a</label>
                                <div className="grid grid-cols-2 gap-3 md:gap-4">
                                    <button
                                        type="button"
                                        onClick={() => setRole('Farmer')}
                                        className={`p-2.5 md:p-3 rounded-xl border flex flex-col md:flex-row items-center justify-center gap-2 transition-all ${role === 'Farmer' ? 'border-primary bg-green-50 dark:bg-green-900/20 text-primary' : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'}`}
                                    >
                                        <span className="material-icons text-xl md:text-2xl">agriculture</span>
                                        <span className="font-medium text-xs md:text-sm">Farmer</span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setRole('Buyer')}
                                        className={`p-2.5 md:p-3 rounded-xl border flex flex-col md:flex-row items-center justify-center gap-2 transition-all ${role === 'Buyer' ? 'border-primary bg-green-50 dark:bg-green-900/20 text-primary' : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'}`}
                                    >
                                        <span className="material-icons text-xl md:text-2xl">storefront</span>
                                        <span className="font-medium text-xs md:text-sm">Buyer</span>
                                    </button>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading || (!otpVerified && otp.length < 4) || firstName.length < 2 || surName.length < 2 || middleName.length < 1 || username.length < 2}
                                className="w-full bg-primary hover:bg-green-700 text-white font-bold py-2.5 md:py-3 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 mt-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base"
                            >
                                {loading ? 'Saving...' : 'Complete Profile'}
                            </button>
                            
                            {!otpVerified && (
                                <button
                                    type="button"
                                    onClick={() => setStep(1)}
                                    className="w-full mt-2 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                                >
                                    Change Mobile Number
                                </button>
                            )}
                        </form>
                    )}

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
