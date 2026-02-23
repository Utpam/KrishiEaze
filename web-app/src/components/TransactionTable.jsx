import React from 'react';
import { ViewState } from '../../constants';

const TransactionTable = ({ onNavigate }) => {
    return (
        <div className="bg-card-light dark:bg-surface-dark-2 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-gray-800 dark:text-white flex items-center gap-2">
                    <span className="w-1.5 h-6 bg-primary rounded-full"></span>
                    Recent Transactions
                </h3>
                <button className="text-primary hover:text-green-700 text-sm font-medium">View History</button>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-gray-600 dark:text-gray-300">
                    <thead className="bg-gray-50 dark:bg-surface-dark text-xs uppercase font-medium text-gray-500 dark:text-gray-400">
                        <tr>
                            <th className="px-4 py-3 rounded-l-lg">Date</th>
                            <th className="px-4 py-3">Buyer</th>
                            <th className="px-4 py-3">Produce</th>
                            <th className="px-4 py-3">Amount</th>
                            <th className="px-4 py-3 rounded-r-lg">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                        <tr className="hover:bg-gray-50 dark:hover:bg-surface-dark transition-colors cursor-pointer" onClick={() => onNavigate(ViewState.ORDER_DETAILS)}>
                            <td className="px-4 py-3">Oct 24, 2023</td>
                            <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">Sneha Traders</td>
                            <td className="px-4 py-3">30 Qtls Wheat</td>
                            <td className="px-4 py-3">₹54,000</td>
                            <td className="px-4 py-3"><span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">Completed</span></td>
                        </tr>
                        <tr className="hover:bg-gray-50 dark:hover:bg-surface-dark transition-colors">
                            <td className="px-4 py-3">Oct 22, 2023</td>
                            <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">Rajesh Kumar</td>
                            <td className="px-4 py-3">15 Qtls Onion</td>
                            <td className="px-4 py-3">₹24,000</td>
                            <td className="px-4 py-3"><span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300">In Progress</span></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default TransactionTable;
