import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateProfileThunk, fetchProfileThunk, clearError } from '../auth/authSlice';
import { locationAPI } from '../api';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import MobileBottomNav from '../components/MobileBottomNav';

const Profile = () => {
    const dispatch = useDispatch();
    const { user, loading, error } = useSelector((state) => state.auth);

    // Profile form state
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [firstName, setFirstName] = useState('');
    const [middleName, setMiddleName] = useState('');
    const [surName, setSurName] = useState('');
    const [address, setAddress] = useState('');
    const [village, setVillage] = useState('');
    const [district, setDistrict] = useState('');
    const [stateName, setStateName] = useState('');
    const [pincode, setPincode] = useState('');
    const [farmerType, setFarmerType] = useState('Marginal');
    const [landArea, setLandArea] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const [syncingLocation, setSyncingLocation] = useState(false);
    
    // Check if the user is a farmer
    const isFarmer = user?.roles?.includes('FARMER') || user?.role === 'FARMER' || user?.role === 'Farmer';

    useEffect(() => {
        dispatch(fetchProfileThunk());
    }, [dispatch]);

    useEffect(() => {
        if (user) {
            setUsername(user.username || '');
            setEmail(user.email || '');
            setFirstName(user.firstName || '');
            setMiddleName(user.middleName || '');
            setSurName(user.surName || '');
            setAddress(user.address || '');
            setVillage(user.village || '');
            setDistrict(user.district || '');
            setStateName(user.state || '');
            setPincode(user.pincode || '');
            setFarmerType(user.farmerType || 'Marginal');
            setLandArea(user.landArea || '');
        }
    }, [user]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        dispatch(clearError());
        setSuccessMsg('');
        

        const updateResult = await dispatch(updateProfileThunk({
            username,
            email,
            firstName,
            surName,
            address,
            village,
            district,
            state: stateName,
            pinCode: pincode,
            profileImageUrl: user?.profileImageUrl || "",
            farmerType: isFarmer ? farmerType : null,
            landArea: isFarmer ? landArea : null,
            roles: user?.roles || ['FARMER']
        }));

        if (updateProfileThunk.fulfilled.match(updateResult)) {
            setSuccessMsg('Profile updated successfully!');
            setTimeout(() => setSuccessMsg(''), 3000);
        }
    };

    const handleSyncLocation = () => {
        if (!navigator.geolocation) {
            setSuccessMsg('Geolocation is not supported by your browser.');
            setTimeout(() => setSuccessMsg(''), 3000);
            return;
        }

        setSyncingLocation(true);
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                try {
                    await locationAPI.updateLocation({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    });
                    setSuccessMsg('Location synced successfully!');
                    setTimeout(() => setSuccessMsg(''), 3000);
                    dispatch(fetchProfileThunk()); // Refresh profile state
                } catch (err) {
                    setSuccessMsg('Failed to sync location with server.');
                    setTimeout(() => setSuccessMsg(''), 3000);
                } finally {
                    setSyncingLocation(false);
                }
            },
            (error) => {
                setSyncingLocation(false);
                setSuccessMsg('Failed to grab GPS location: ' + error.message);
                setTimeout(() => setSuccessMsg(''), 3000);
            }
        );
    };

    return (
        <div className="flex h-screen overflow-hidden bg-background-light dark:bg-background-dark transition-colors duration-300">
            {/* Sidebar */}
            <Sidebar />

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto flex flex-col relative w-full">
                <Navbar />

                <div className="p-4 md:p-8 max-w-4xl mx-auto w-full pb-24 md:pb-8">
                    <div className="mb-6 md:mb-8 text-center md:text-left">
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2 justify-center md:justify-start">
                            <span className="material-icons text-primary">person</span>
                            My Profile
                        </h2>
                        <p className="text-sm md:text-base text-gray-500 dark:text-gray-400 mt-1">Manage your personal information and preferences.</p>
                    </div>

                    <div className="bg-white dark:bg-card-dark rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 overflow-hidden">
                        
                        <div className="bg-primary/10 dark:bg-primary/5 p-6 flex flex-col sm:flex-row items-center gap-6">
                            <div className="h-24 w-24 rounded-full bg-primary text-white flex items-center justify-center text-4xl font-bold shadow-lg border-4 border-white dark:border-card-dark">
                                {firstName ? firstName.charAt(0).toUpperCase() : (username ? username.charAt(0).toUpperCase() : 'U')}
                            </div>
                            <div className="text-center sm:text-left">
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white">{(firstName + ' ' + middleName + ' ' + surName).trim() || 'Complete Your Profile'}</h3>
                                <p className="text-gray-500 dark:text-gray-400 text-sm">{user?.mobileNo || 'Verified User'}</p>
                                <span className="inline-block mt-2 px-3 py-1 bg-white dark:bg-gray-800 text-primary text-xs font-bold rounded-full shadow-sm">
                                    {isFarmer ? 'Farmer Account' : 'Buyer Account'}
                                </span>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
                            {error && <div className="p-3 bg-red-100 text-red-700 rounded-lg text-sm">{error}</div>}
                            {successMsg && <div className="p-3 bg-green-100 text-green-700 rounded-lg text-sm">{successMsg}</div>}

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">First Name</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-all text-sm"
                                        value={firstName}
                                        onChange={(e) => setFirstName(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Middle Name</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-all text-sm"
                                        value={middleName}
                                        onChange={(e) => setMiddleName(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Surname</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-all text-sm"
                                        value={surName}
                                        onChange={(e) => setSurName(e.target.value)}
                                    />
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Username</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-all text-sm"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                                    <input
                                        type="email"
                                        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-all text-sm"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="border-t border-gray-100 dark:border-gray-800 pt-6">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
                                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Location Details</h4>
                                    <button
                                        type="button"
                                        onClick={handleSyncLocation}
                                        disabled={syncingLocation}
                                        className="flex items-center justify-center gap-1 px-3 py-1.5 text-sm bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/40 rounded-lg transition-colors disabled:opacity-50"
                                    >
                                        <span className={`material-icons text-base ${syncingLocation ? 'animate-spin' : ''}`}>{syncingLocation ? 'sync' : 'my_location'}</span>
                                        {syncingLocation ? 'Syncing...' : 'Sync GPS'}
                                    </button>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Address</label>
                                        <textarea
                                            required
                                            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-all text-sm"
                                            value={address}
                                            onChange={(e) => setAddress(e.target.value)}
                                            rows="2"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Village/City</label>
                                        <input
                                            type="text"
                                            required
                                            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-all text-sm"
                                            value={village}
                                            onChange={(e) => setVillage(e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">District</label>
                                        <input
                                            type="text"
                                            required
                                            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-all text-sm"
                                            value={district}
                                            onChange={(e) => setDistrict(e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">State</label>
                                        <input
                                            type="text"
                                            required
                                            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-all text-sm"
                                            value={stateName}
                                            onChange={(e) => setStateName(e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Pincode</label>
                                        <input
                                            type="text"
                                            required
                                            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-all text-sm"
                                            value={pincode}
                                            onChange={(e) => setPincode(e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>

                            {isFarmer && (
                                <div className="border-t border-gray-100 dark:border-gray-800 pt-6">
                                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Farmer Details</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Farmer Type</label>
                                            <select
                                                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-all text-sm"
                                                value={farmerType}
                                                onChange={(e) => setFarmerType(e.target.value)}
                                            >
                                                <option value="Marginal">Marginal</option>
                                                <option value="Small">Small</option>
                                                <option value="Medium">Medium</option>
                                                <option value="Large">Large</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Land Area (Acres)</label>
                                            <input
                                                type="number"
                                                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-all text-sm"
                                                value={landArea}
                                                onChange={(e) => setLandArea(e.target.value)}
                                                step="0.1"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="pt-4">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full md:w-auto px-8 py-3 bg-primary hover:bg-green-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? 'Saving...' : 'Save Profile Changes'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </main>
            
            {/* Mobile Bottom Navigation */}
            <MobileBottomNav />
        </div>
    );
};

export default Profile;
