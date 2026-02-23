import React from 'react';

const OrderRequestCard = () => {
    return (
        <div className="bg-card-light dark:bg-surface-dark-2 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">Latest Order Request</h3>
            <div className="bg-gray-50 dark:bg-surface-dark rounded-xl p-4 border border-gray-100 dark:border-gray-600">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                        <img alt="Buyer" className="w-full h-full object-cover" src="https://picsum.photos/100/100?random=20" />
                    </div>
                    <div>
                        <p className="font-semibold text-gray-900 dark:text-white">Rajesh Kumar</p>
                        <p className="text-xs text-orange-500 font-medium">Pending Approval</p>
                    </div>
                </div>
                <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm"><span className="text-gray-500 dark:text-gray-400">Requirement:</span><span className="font-medium text-gray-800 dark:text-gray-200">20 Qtls (Wheat)</span></div>
                    <div className="flex justify-between text-sm"><span className="text-gray-500 dark:text-gray-400">Proposed:</span><span className="font-medium text-gray-800 dark:text-gray-200">₹1,750/Qtl</span></div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                    <button className="px-4 py-2 border border-gray-300 dark:border-gray-500 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">Decline</button>
                    <button className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors">Accept</button>
                </div>
            </div>
        </div>
    );
};

export default OrderRequestCard;
