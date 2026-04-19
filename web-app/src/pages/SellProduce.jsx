import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import MobileBottomNav from '../components/MobileBottomNav';
import { mandiAPI } from '../api';
import { useNavigate } from 'react-router-dom';

const SellProduce = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        cropName: '',
        variety: '', // Keep for frontend UI, backend relies on qualityGrade largely
        qualityGrade: 'A',
        quantity: '',
        unit: 'Quintal',
        expectedPrice: '',
        harvestDate: '',
        selectedMandiId: '',
        description: '',
        images: []
    });

    const [availableMandis, setAvailableMandis] = useState([]);
    const [loadingMandis, setLoadingMandis] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchMandis = async () => {
            if (!formData.cropName) {
                setAvailableMandis([]);
                return;
            }
            setLoadingMandis(true);
            try {
                const response = await mandiAPI.getNearestMandis(formData.cropName);
                if (response.data && response.data.length > 0) {
                    setAvailableMandis(response.data);
                    setFormData(prev => ({ ...prev, selectedMandiId: response.data[0].mandiId || response.data[0].id }));
                } else {
                    setAvailableMandis([]);
                    setFormData(prev => ({ ...prev, selectedMandiId: '' }));
                }
            } catch (err) {
                console.error("Failed to fetch nearest mandis:", err);
            } finally {
                setLoadingMandis(false);
            }
        };
        // Small debounce
        const to = setTimeout(fetchMandis, 500);
        return () => clearTimeout(to);
    }, [formData.cropName]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        
        if (!formData.selectedMandiId) {
            setError("Please select a target Mandi. (Ensure your crop is available in nearby Mandis)");
            return;
        }

        setSubmitting(true);
        try {
            const payload = {
                selectedMandiId: parseInt(formData.selectedMandiId),
                cropName: formData.cropName,
                quantity: parseFloat(formData.quantity),
                unit: formData.unit,
                expectedPricePerUnit: parseFloat(formData.expectedPrice),
                harvestDate: formData.harvestDate,
                qualityGrade: formData.qualityGrade
            };

            await mandiAPI.createSellRequest(payload);
            alert("Listing created successfully!");
            navigate('/dashboard'); // Go back to dashboard to see active requests
        } catch (err) {
            console.error("Failed to create sell request:", err);
            setError(err.response?.data?.message || "Failed to submit request.");
        } finally {
            setSubmitting(false);
        }
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

                    {error && (
                        <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-lg mb-6 font-medium">
                            {error}
                        </div>
                    )}

                    <div className="bg-card-light dark:bg-surface-dark rounded-xl md:rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                        <div className="p-5 md:p-8">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Crop Details Section */}
                                <div>
                                    <h3 className="text-base md:text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                        <span className="material-icons text-primary">spa</span>
                                        Crop Details & Mandi
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Crop Name</label>
                                            <select
                                                name="cropName"
                                                required
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
                                                <option value="Tomato">Tomato</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Target Mandi {loadingMandis && <span className="text-primary text-xs">(Loading...)</span>}</label>
                                            <select
                                                name="selectedMandiId"
                                                required
                                                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent text-sm md:text-base disabled:opacity-50"
                                                value={formData.selectedMandiId}
                                                onChange={handleChange}
                                                disabled={availableMandis.length === 0}
                                            >
                                                <option value="">{availableMandis.length === 0 ? "Select a crop first" : "Select Mandi"}</option>
                                                {availableMandis.map(mandi => (
                                                    <option key={mandi.mandiId || mandi.id} value={mandi.mandiId || mandi.id}>
                                                        {mandi.mandiName} - {mandi.district} ({mandi.distanceKm?.toFixed(1)}km away)
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
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
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Quality Grade</label>
                                            <select
                                                name="qualityGrade"
                                                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent text-sm md:text-base"
                                                value={formData.qualityGrade}
                                                onChange={handleChange}
                                            >
                                                <option value="A">Grade A (Premium)</option>
                                                <option value="B">Grade B (Good)</option>
                                                <option value="C">Grade C (Average)</option>
                                            </select>
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
                                                    required
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
                                                    required
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
                                                required
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
                                    <button type="button" onClick={() => navigate('/dashboard')} className="w-full sm:w-auto px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition order-2 sm:order-1">
                                        Cancel
                                    </button>
                                    <button type="submit" disabled={submitting} className={`w-full sm:w-auto px-8 py-2 text-white font-bold rounded-lg shadow-lg transition transform hover:-translate-y-0.5 order-1 sm:order-2 ${submitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-primary hover:bg-green-700 hover:shadow-xl'}`}>
                                        {submitting ? 'Submitting...' : 'List Produce'}
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
