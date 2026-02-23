import React from 'react';

const StatCard = ({ title, value, subtext, icon, colorClass, type = 'default' }) => {
    if (type === 'primary') {
        return (
            <div className="bg-primary/90 dark:bg-primary/20 p-6 rounded-2xl text-white dark:text-primary border border-transparent dark:border-primary/30 shadow-lg relative overflow-hidden group">
                <div className="absolute right-0 top-0 opacity-10 transform translate-x-4 -translate-y-4">
                    <span className="material-icons-outlined text-9xl">{icon}</span>
                </div>
                <div className="relative z-10">
                    <p className="text-sm font-medium opacity-90 dark:text-gray-300">{title}</p>
                    <h4 className="text-3xl font-bold mt-2">{value}</h4>
                    {subtext && (
                        <div className="mt-4 flex items-center text-xs bg-white/20 dark:bg-primary/20 w-max px-2 py-1 rounded-md backdrop-blur-sm">
                            <span className="material-icons-outlined text-sm mr-1">trending_up</span>
                            <span>{subtext}</span>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="bg-card-light dark:bg-surface-dark-2 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
                    <h4 className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{value}</h4>
                </div>
                <div className={`p-3 rounded-xl ${colorClass}`}>
                    <span className="material-icons-outlined">{icon}</span>
                </div>
            </div>
            {subtext && (
                <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700/50 flex items-center justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400">{subtext.label}</span>
                    <span className={`font-semibold ${subtext.colorClass}`}>{subtext.value}</span>
                </div>
            )}
        </div>
    );
};

export default StatCard;
