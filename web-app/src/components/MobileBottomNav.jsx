import React from 'react';
import { NavLink } from 'react-router-dom';

const MobileBottomNav = () => {
    return (
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/90 dark:bg-card-dark/90 glass-effect border-t border-gray-200 dark:border-gray-800 flex justify-around items-center h-16 z-50">
            <NavLink
                to="/dashboard"
                className={({ isActive }) => `flex flex-col items-center justify-center w-full h-full space-y-1 ${isActive ? 'text-primary' : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'}`}
            >
                <span className="material-icons-outlined text-xl mb-0.5">dashboard</span>
                <span className="text-[10px] font-medium">Dashboard</span>
            </NavLink>
            <NavLink
                to="/sell"
                className={({ isActive }) => `flex flex-col items-center justify-center w-full h-full space-y-1 ${isActive ? 'text-primary' : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'}`}
            >
                <span className="material-icons-outlined text-xl mb-0.5">storefront</span>
                <span className="text-[10px] font-medium">Sell</span>
            </NavLink>
            <NavLink
                to="/orders"
                className={({ isActive }) => `flex flex-col items-center justify-center w-full h-full space-y-1 ${isActive ? 'text-primary' : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'}`}
            >
                <div className="relative mb-0.5">
                    <span className="material-icons-outlined text-xl">shopping_cart</span>
                    <span className="absolute -top-1 -right-2 bg-secondary text-white text-[8px] font-bold px-1 rounded-full border border-white dark:border-gray-800">3</span>
                </div>
                <span className="text-[10px] font-medium">Orders</span>
            </NavLink>
            <NavLink
                to="/mandi"
                className={({ isActive }) => `flex flex-col items-center justify-center w-full h-full space-y-1 ${isActive ? 'text-primary' : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'}`}
            >
                <span className="material-icons-outlined text-xl mb-0.5">trending_up</span>
                <span className="text-[10px] font-medium">Prices</span>
            </NavLink>
            <NavLink
                to="/profile"
                className={({ isActive }) => `flex flex-col items-center justify-center w-full h-full space-y-1 ${isActive ? 'text-primary' : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'}`}
            >
                <span className="material-icons-outlined text-xl mb-0.5">person</span>
                <span className="text-[10px] font-medium">Profile</span>
            </NavLink>
        </div>
    );
};

export default MobileBottomNav;
