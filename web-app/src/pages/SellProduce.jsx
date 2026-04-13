import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import MobileBottomNav from '../components/MobileBottomNav';

const SellProduce = () => {
    const [formData, setFormData] = useState({
        cropName: '',
        variety: '',
        quantity: '',
        unit: 'Quintal',
        expectedPrice: '',
        harvestDate: '',
        description: '',
        images: [] // In a real app, this would be File[]
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Submitting Listing:", formData);
        alert("Listing created successfully!");
    };

    return (
        <div className="flex h-screen overflow-hidden bg-background-light dark:bg-background-dark transition-colors duration-300">
            <Sidebar />
            <main className="flex-1 overflow-y-auto flex flex-col relative w-full">
                <Navbar />
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8 w-full pb-24 md:pb-8">
                    <div className="mb-6 md:mb-8">
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">Sell Produce</h1>
                        <p className="text-sm md:text-base text-gray-600 dark:text-gray-400">List your harvest for thousands of potential buyers.</p>
                    </div>

                    <div className="bg-card-light dark:bg-surface-dark rounded-xl md:rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                        <div className="p-5 md:p-8">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Crop Details Section */}
                                <div>
                                    <h3 className="text-base md:text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                        <span className="material-icons text-primary">spa</span>
                                        Crop Details
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Crop Name</label>
                                            <select
                                                name="cropName"
                                                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent text-sm md:text-base"
                                                value={formData.cropName}
                                                onChange={handleChange}
                                            >
                                                <option value="">Select Crop</option>
                                                <option value="Wheat">Wheat</option>
                                                <option value="Rice">Rice</option>
                                                <option value="Cotton">Cotton</option>
                                                <option value="Soybean">Soybean</option>
                                                <option value="Onion">Onion</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Variety</label>
                                            <input
                                                type="text"
                                                name="variety"
                                                placeholder="e.g., Lokwan, Basmati"
                                                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent text-sm md:text-base"
                                                value={formData.variety}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <hr className="border-gray-200 dark:border-gray-700" />

                                {/* Quantity & Price Section */}
                                <div>
                                    <h3 className="text-base md:text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                        <span className="material-icons text-primary">scale</span>
                                        Quantity & Price
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                                        <div className="md:col-span-1">
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Quantity</label>
                                            <div className="flex">
                                                <input
                                                    type="number"
                                                    name="quantity"
                                                    className="w-full px-4 py-2 rounded-l-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent text-sm md:text-base"
                                                    value={formData.quantity}
                                                    onChange={handleChange}
                                                />
                                                <select
                                                    name="unit"
                                                    className="px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-r-lg text-gray-700 dark:text-gray-300 text-sm md:text-base"
                                                    value={formData.unit}
                                                    onChange={handleChange}
                                                >
                                                    <option>Quintal</option>
                                                    <option>Kg</option>
                                                    <option>Ton</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="md:col-span-1">
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Expected Price (per unit)</label>
                                            <div className="relative">
                                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm md:text-base">₹</span>
                                                <input
                                                    type="number"
                                                    name="expectedPrice"
                                                    className="w-full pl-8 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent text-sm md:text-base"
                                                    value={formData.expectedPrice}
                                                    onChange={handleChange}
                                                />
                                            </div>
                                        </div>
                                        <div className="md:col-span-1">
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Harvest Date</label>
                                            <input
                                                type="date"
                                                name="harvestDate"
                                                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent text-sm md:text-base"
                                                value={formData.harvestDate}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <hr className="border-gray-200 dark:border-gray-700" />

                                {/* Image Upload */}
                                <div>
                                    <h3 className="text-base md:text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                        <span className="material-icons text-primary">image</span>
                                        Photos
                                    </h3>
                                    <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-6 md:p-8 text-center hover:bg-gray-50 dark:hover:bg-gray-800/50 transition cursor-pointer">
                                        <span className="material-icons text-3xl md:text-4xl text-gray-400 mb-2">cloud_upload</span>
                                        <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 font-medium">Click to upload photos of your produce</p>
                                        <p className="text-[10px] md:text-xs text-gray-500 mt-1">PNG, JPG up to 5MB</p>
                                    </div>
                                </div>

                                <div className="pt-4 flex flex-col sm:flex-row justify-end gap-3 md:gap-4">
                                    <button type="button" className="w-full sm:w-auto px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition order-2 sm:order-1">
                                        Cancel
                                    </button>
                                    <button type="submit" className="w-full sm:w-auto px-8 py-2 bg-primary text-white font-bold rounded-lg shadow-lg hover:bg-green-700 hover:shadow-xl transition transform hover:-translate-y-0.5 order-1 sm:order-2">
                                        List Produce
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </main>
            <MobileBottomNav />
        </div>
    );
};

export default SellProduce;
