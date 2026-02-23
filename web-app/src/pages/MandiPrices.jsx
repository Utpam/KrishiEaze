import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

const MandiPrices = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedState, setSelectedState] = useState('All');

    const prices = [
        { crop: 'Wheat', variety: 'Lokwan', price: '₹2,450/Qtl', change: '+2.5%', market: 'Nagpur Mandi', date: 'Today' },
        { crop: 'Rice', variety: 'Basmati', price: '₹4,100/Qtl', change: '-1.2%', market: 'Gondia Mandi', date: 'Today' },
        { crop: 'Cotton', variety: 'H-4', price: '₹7,800/Qtl', change: '+0.8%', market: 'Wardha Mandi', date: 'Yield' },
        { crop: 'Soybean', variety: 'Yellow', price: '₹4,800/Qtl', change: '+1.5%', market: 'Amravati Mandi', date: 'Yesterday' },
        { crop: 'Onion', variety: 'Red', price: '₹1,200/Qtl', change: '-5.0%', market: 'Nashik Mandi', date: 'Today' },
        { crop: 'Potato', variety: 'Local', price: '₹950/Qtl', change: '+0.5%', market: 'Nagpur Mandi', date: 'Today' },
    ];

    const filteredPrices = prices.filter(item =>
        item.crop.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.market.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="flex h-screen overflow-hidden bg-background-light dark:bg-background-dark transition-colors duration-300">
            <Sidebar />
            <main className="flex-1 overflow-y-auto flex flex-col relative w-full">
                <Navbar />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Mandi Prices</h1>
                        <p className="text-gray-600 dark:text-gray-400">Real-time market rates from across the region.</p>
                    </div>

                    {/* Filters */}
                    <div className="bg-card-light dark:bg-surface-dark p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 mb-6 flex flex-col md:flex-row gap-4 items-center">
                        <div className="relative flex-1 w-full">
                            <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">search</span>
                            <input
                                type="text"
                                placeholder="Search crop or mandi..."
                                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <select
                            className="w-full md:w-48 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                            value={selectedState}
                            onChange={(e) => setSelectedState(e.target.value)}
                        >
                            <option value="All">All States</option>
                            <option value="Maharashtra">Maharashtra</option>
                            <option value="MP">Madhya Pradesh</option>
                            <option value="Punjab">Punjab</option>
                        </select>
                        <button className="w-full md:w-auto px-6 py-2 bg-primary text-white font-medium rounded-lg hover:bg-green-700 transition shadow-sm">
                            Filters
                        </button>
                    </div>

                    {/* Price Cards Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredPrices.map((item, index) => (
                            <div key={index} className="bg-card-light dark:bg-surface-dark rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition p-5 group">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="font-bold text-xl text-gray-900 dark:text-white">{item.crop}</h3>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">{item.variety}</p>
                                    </div>
                                    <div className={`text-sm font-bold px-2 py-1 rounded-md ${item.change.startsWith('+') ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
                                        {item.change}
                                    </div>
                                </div>
                                <div className="mb-4">
                                    <span className="text-3xl font-bold text-gray-900 dark:text-white">{item.price}</span>
                                </div>
                                <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 pt-4 border-t border-gray-100 dark:border-gray-700">
                                    <span className="flex items-center gap-1">
                                        <span className="material-icons text-base">location_on</span>
                                        {item.market}
                                    </span>
                                    <span>{item.date}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default MandiPrices;
