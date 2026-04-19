import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { mandiAPI } from '../api';

const TransactionTable = () => {
    const navigate = useNavigate();
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const response = await mandiAPI.getMySellRequests();
                // Filter requests or just take top 5
                setRequests(response.data.slice(0, 5));
            } catch (error) {
                console.error("Error fetching transactions:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchRequests();
    }, []);

    return (
        <div className="bg-card-light dark:bg-surface-dark-2 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-gray-800 dark:text-white flex items-center gap-2">
                    <span className="w-1.5 h-6 bg-primary rounded-full"></span>
                    Recent Transactions
                </h3>
                <button onClick={() => navigate('/orders')} className="text-primary hover:text-green-700 text-sm font-medium">View History</button>
            </div>
            <div className="overflow-x-auto">
                {loading ? (
                    <p className="text-sm text-gray-500">Loading transactions...</p>
                ) : requests.length === 0 ? (
                    <p className="text-sm text-gray-500">No recent transactions.</p>
                ) : (
                    <table className="w-full text-left text-sm text-gray-600 dark:text-gray-300">
                        <thead className="bg-gray-50 dark:bg-surface-dark text-xs uppercase font-medium text-gray-500 dark:text-gray-400">
                            <tr>
                                <th className="px-4 py-3 rounded-l-lg">Date</th>
                                <th className="px-4 py-3">Buyer (Mandi)</th>
                                <th className="px-4 py-3">Produce</th>
                                <th className="px-4 py-3">Amount</th>
                                <th className="px-4 py-3 rounded-r-lg">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                            {requests.map((req) => {
                                const amount = req.quantity * req.expectedPricePerUnit;
                                return (
                                    <tr key={req.id} className="hover:bg-gray-50 dark:hover:bg-surface-dark transition-colors cursor-pointer" onClick={() => navigate('/orders')}>
                                        <td className="px-4 py-3 whitespace-nowrap">{new Date(req.requestDate).toLocaleDateString()}</td>
                                        <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">{req.mandi?.name || 'Local Mandi'}</td>
                                        <td className="px-4 py-3 whitespace-nowrap">{req.quantity} {req.unit} {req.cropName}</td>
                                        <td className="px-4 py-3 whitespace-nowrap">₹{amount.toLocaleString()}</td>
                                        <td className="px-4 py-3 whitespace-nowrap">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium 
                                                ${req.status === 'CONFIRMED' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' 
                                                : req.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' 
                                                : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'}`}>
                                                {req.status}
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default TransactionTable;
