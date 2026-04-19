import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import MobileBottomNav from '../components/MobileBottomNav';
import { mandiAPI } from '../api';

const MandiPrices = () => {
    const [searchTerm, setSearchTerm] = useState(''); // default crop to search
    const [cropQuery, setCropQuery] = useState('Wheat');
    const [selectedState, setSelectedState] = useState('All');
    
    const [prices, setPrices] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMandiPrices = async () => {
            if (!cropQuery) return;
            setLoading(true);
            setError(null);
            try {
                const response = await mandiAPI.getNearestMandis(cropQuery);
                setPrices(response.data);
            } catch (err) {
                console.error("Failed to fetch mandi prices:", err);
                setError(err.response?.data?.message || "Failed to load mandi prices. Make sure your location is synced in profile.");
            } finally {
                setLoading(false);
            }
        };

        fetchMandiPrices();
    }, [cropQuery]);

    const handleSearch = () => {
        if (searchTerm.trim()) {
            setCropQuery(searchTerm.trim());
        }
    };

    return (
        <div className="flex h-screen overflow-hidden bg-background-light dark:bg-background-dark transition-colors duration-300">
            <Sidebar />
            <main className="flex-1 overflow-y-auto flex flex-col relative w-full">
                <Navbar />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8 w-full pb-24 md:pb-8">
                    <div className="mb-6 md:mb-8 text-center md:text-left">
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">Mandi Prices</h1>
                        <p className="text-sm md:text-base text-gray-600 dark:text-gray-400">Search real-time nearby market rates for your crops.</p>
                    </div>

                    {/* Filters */}
                    <div className="bg-card-light dark:bg-surface-dark p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 mb-6 flex flex-col md:flex-row gap-4 items-center">
                        <div className="relative flex-1 w-full">
                            <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">search</span>
                            <input
                                type="text"
                                placeholder="Search crop (e.g. Wheat, Tomato)..."
                                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent text-sm md:text-base"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                            />
                        </div>
                        <select
                            className="w-full md:w-48 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent text-sm md:text-base"
                            value={selectedState}
                            onChange={(e) => setSelectedState(e.target.value)}
                        >
                            <option value="All">All States</option>
                            <option value="Maharashtra">Maharashtra</option>
                            <option value="MP">Madhya Pradesh</option>
                            <option value="Punjab">Punjab</option>
                        </select>
                        <button 
                            onClick={handleSearch}
                            className="w-full md:w-auto px-6 py-2 bg-primary text-white font-medium rounded-lg hover:bg-green-700 transition shadow-sm text-sm md:text-base"
                        >
                            Search
                        </button>
                    </div>

                    {/* Loading & Error States */}
                    {loading && (
                        <div className="text-center py-10">
                            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                            <p className="mt-2 text-gray-500">Fetching Mandi rates...</p>
                        </div>
                    )}

                    {error && (
                        <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-lg text-center mb-6">
                            <p className="font-medium">{error}</p>
                        </div>
                    )}

                    {!loading && !error && prices.length === 0 && (
                        <div className="text-center py-10 bg-card-light dark:bg-surface-dark rounded-xl border border-dashed border-gray-300 dark:border-gray-700">
                            <span className="material-icons text-4xl text-gray-400 mb-2">info</span>
                            <p className="text-gray-500 dark:text-gray-400">No mandi records found for "{cropQuery}" nearby.</p>
                        </div>
                    )}

                    {/* Price Cards Grid */}
                    {!loading && prices.length > 0 && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                            {prices.map((item, index) => (
                                <div key={index} className="bg-card-light dark:bg-surface-dark rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition p-4 md:p-5 group">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h3 className="font-bold text-lg md:text-xl text-gray-900 dark:text-white capitalize">{item.commodity || cropQuery}</h3>
                                            <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400">{item.district || 'District'}</p>
                                        </div>
                                        {item.distanceKm != null && (
                                            <div className="text-[10px] md:text-sm font-bold px-2 py-1 rounded-md bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 inline-flex items-center gap-1">
                                                <span className="material-icons text-[12px] md:text-sm">map</span>
                                                {item.distanceKm.toFixed(1)} km
                                            </div>
                                        )}
                                    </div>
                                    <div className="mb-4">
                                        <span className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                                            ₹{item.modalPrice ? String(item.modalPrice).replace(/₹/g, '').trim() : 'N/A'}
                                        </span>
                                        <span className="text-sm text-gray-500 ml-1">/{item.priceUnit || 'Quintal'}</span>
                                    </div>
                                    <div className="flex items-center justify-between text-[10px] md:text-sm text-gray-500 dark:text-gray-400 pt-4 border-t border-gray-100 dark:border-gray-700">
                                        <span className="flex items-center gap-1">
                                            <span className="material-icons text-sm md:text-base">location_on</span>
                                            {item.mandiName || 'Local Mandi'}, {item.state || ''}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>
            <MobileBottomNav />
        </div>
    );
};

export default MandiPrices;
