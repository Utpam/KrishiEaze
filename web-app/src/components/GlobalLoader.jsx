import React from 'react';

const GlobalLoader = () => {
    return (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background-light dark:bg-background-dark transition-colors duration-300">
            <div className="relative flex items-center justify-center w-24 h-24">
                <div className="absolute inset-0 border-t-4 border-primary rounded-full animate-spin"></div>
                <div className="absolute inset-2 border-r-4 border-secondary rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
                <div className="absolute inset-4 border-b-4 border-primary rounded-full animate-spin" style={{ animationDuration: '2s' }}></div>
                <span className="material-symbols-outlined text-primary text-3xl absolute">agriculture</span>
            </div>
            <h2 className="mt-6 text-xl font-semibold text-text-light dark:text-text-dark font-sans tracking-widest animate-pulse">KrishiEaze</h2>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Loading resources...</p>
        </div>
    );
};

export default GlobalLoader;
