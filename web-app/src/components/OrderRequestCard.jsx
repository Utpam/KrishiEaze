import React, { useState, useEffect } from 'react';
import { mandiAPI } from '../api';

const OrderRequestCard = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const response = await mandiAPI.getMySellRequests();
                setRequests(response.data);
            } catch (error) {
                console.error("Error fetching sell requests:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchRequests();
    }, []);

    return (
        <div className="bg-card-light dark:bg-surface-dark-2 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 max-h-[500px] overflow-y-auto">
            <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">My Sell Requests</h3>
            
            {loading ? (
                <p className="text-sm text-gray-500 dark:text-gray-400">Loading requests...</p>
            ) : requests.length === 0 ? (
                <p className="text-sm text-gray-500 dark:text-gray-400">No active sell requests found.</p>
            ) : (
                <div className="space-y-4">
                    {requests.map(req => (
                        <div key={req.id} className="bg-gray-50 dark:bg-surface-dark rounded-xl p-4 border border-gray-100 dark:border-gray-600">
                            <div className="flex items-center justify-between mb-3">
                                <div>
                                    <p className="font-semibold text-gray-900 dark:text-white">{req.cropName}</p>
                                    <p className={`text-xs font-medium ${req.status === 'PENDING' ? 'text-orange-500' : 'text-green-500'}`}>{req.status}</p>
                                </div>
                                <span className="text-xs text-gray-500 bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded-md">
                                    {new Date(req.requestDate).toLocaleDateString()}
                                </span>
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500 dark:text-gray-400">Quantity:</span>
                                    <span className="font-medium text-gray-800 dark:text-gray-200">{req.quantity} {req.unit}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500 dark:text-gray-400">Expected:</span>
                                    <span className="font-medium text-gray-800 dark:text-gray-200">₹{req.expectedPricePerUnit}/{req.unit}</span>
                                </div>
                                {req.mandi && (
                                    <div className="flex justify-between text-sm mt-1">
                                        <span className="text-gray-500 dark:text-gray-400">Mandi:</span>
                                        <span className="font-medium text-gray-800 dark:text-gray-200">{req.mandi.name}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default OrderRequestCard;
