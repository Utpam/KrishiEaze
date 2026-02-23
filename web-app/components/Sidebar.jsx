import React from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
    return (
        <aside className="w-64 bg-card-light dark:bg-surface-dark border-r border-gray-200 dark:border-gray-800 hidden md:flex flex-col h-full shadow-sm z-10">
            <NavLink to="/" className="p-6 flex items-center gap-3 cursor-pointer">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                    <span className="material-icons-outlined">agriculture</span>
                </div>
                <h1 className="text-2xl font-bold text-primary tracking-tight">KrishiEaze</h1>
            </NavLink>
            <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
                <NavLink
                    to="/dashboard"
                    className={({ isActive }) => `w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive ? 'bg-primary text-white shadow-md' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-surface-dark-2'}`}
                >
                    <span className="material-icons-outlined">dashboard</span>
                    <span className="font-medium">Dashboard</span>
                </NavLink>
                <NavLink
                    to="/sell"
                    className={({ isActive }) => `w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive ? 'bg-primary text-white shadow-md' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-surface-dark-2'}`}
                >
                    <span className="material-icons-outlined">storefront</span>
                    <span className="font-medium">My Listings</span>
                </NavLink>
                <NavLink
                    to="/orders"
                    className={({ isActive }) => `w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive ? 'bg-primary text-white shadow-md' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-surface-dark-2'}`}
                >
                    <span className="material-icons-outlined">shopping_cart</span>
                    <span className="font-medium">Orders</span>
                    <span className="ml-auto bg-secondary text-white text-xs font-bold px-2 py-0.5 rounded-full">3</span>
                </NavLink>
                <NavLink
                    to="/mandi"
                    className={({ isActive }) => `w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive ? 'bg-primary text-white shadow-md' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-surface-dark-2'}`}
                >
                    <span className="material-icons-outlined">trending_up</span>
                    <span className="font-medium">Mandi Prices</span>
                </NavLink>
            </nav>
            <div className="p-4 border-t border-gray-200 dark:border-gray-800">
                <NavLink to="/" className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all mt-1">
                    <span className="material-icons-outlined">logout</span>
                    <span className="font-medium">Logout</span>
                </NavLink>
            </div>
        </aside>
    );
};

export default Sidebar;
