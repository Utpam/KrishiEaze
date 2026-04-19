import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import MobileBottomNav from '../components/MobileBottomNav';
import { mandiAPI } from '../api';

const OrderDetails = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const response = await mandiAPI.getMySellRequests();
                setRequests(response.data);
            } catch (error) {
                console.error("Error fetching transactions:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchRequests();
    }, []);

    return (
        <div className="flex h-screen overflow-hidden bg-background-light dark:bg-background-dark transition-colors duration-300">
            <Sidebar />
            <main className="flex-1 overflow-y-auto flex flex-col relative w-full">
                <Navbar />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8 w-full pb-24 md:pb-8">
                    <div className="mb-6 md:mb-8">
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">Order History</h1>
                        <p className="text-sm md:text-base text-gray-600 dark:text-gray-400">Track and manage your past and current orders.</p>
                    </div>

                    <div className="bg-card-light dark:bg-surface-dark rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                        <div className="overflow-x-auto no-scrollbar">
                            <table className="w-full min-w-[600px] md:min-w-full">
                                <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                                    <tr>
                                        <th className="px-4 md:px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Order ID</th>
                                        <th className="px-4 md:px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Buyer</th>
                                        <th className="px-4 md:px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Item & Qty</th>
                                        <th className="px-4 md:px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Amount</th>
                                        <th className="px-4 md:px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                                        <th className="px-4 md:px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
                                        <th className="px-4 md:px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                    {loading ? (
                                        <tr><td colSpan="7" className="text-center py-8 text-gray-500">Loading...</td></tr>
                                    ) : requests.length === 0 ? (
                                        <tr><td colSpan="7" className="text-center py-8 text-gray-500">No order history found.</td></tr>
                                    ) : requests.map((order) => {
                                        const amount = order.quantity * order.expectedPricePerUnit;
                                        return (
                                        <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition">
                                            <td className="px-4 md:px-6 py-4 whitespace-nowrap text-sm font-medium text-primary">#ORD-{order.id.toString().padStart(4, '0')}</td>
                                            <td className="px-4 md:px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white font-medium">{order.mandi?.name || 'Local Mandi'}</td>
                                            <td className="px-4 md:px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                                                <div>{order.cropName}</div>
                                                <div className="text-xs text-gray-400">{order.quantity} {order.unit}</div>
                                            </td>
                                            <td className="px-4 md:px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white font-bold">₹{amount.toLocaleString()}</td>
                                            <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${order.status === 'CONFIRMED' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                                                        order.status === 'PENDING' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' :
                                                            'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                                                    }`}>
                                                    {order.status}
                                                </span>
                                            </td>
                                            <td className="px-4 md:px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{new Date(order.requestDate).toLocaleDateString()}</td>
                                            <td className="px-4 md:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                <button className="text-primary hover:text-green-700 font-medium">View</button>
                                            </td>
                                        </tr>
                                    )})}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </main>
            <MobileBottomNav />
        </div>
    );
};

export default OrderDetails;
