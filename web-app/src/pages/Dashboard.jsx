import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import StatCard from '../components/StatCard';
import TransactionTable from '../components/TransactionTable';
import OrderRequestCard from '../components/OrderRequestCard';
import WeatherWidget from '../components/WeatherWidget';
import MobileBottomNav from '../components/MobileBottomNav';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom'; 
import { mandiAPI } from '../api';
import { useTranslation } from 'react-i18next';

const Dashboard = () => {
    const { user } = useSelector((state) => state.auth);
    const navigate = useNavigate();
    const { t } = useTranslation();

    const [stats, setStats] = useState({
        totalSales: 0,
        activeListings: 0,
        pendingOrders: 0
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await mandiAPI.getMySellRequests();
                const requests = response.data;
                
                let sales = 0;
                let active = requests.length;
                let pending = 0;

                requests.forEach(req => {
                    if (req.status === 'CONFIRMED') {
                        sales += (req.quantity * req.expectedPricePerUnit);
                    }
                    if (req.status === 'PENDING') {
                        pending += 1;
                    }
                });

                setStats({
                    totalSales: sales,
                    activeListings: active,
                    pendingOrders: pending
                });
            } catch (err) {
                console.error("Failed to fetch stats", err);
            }
        };
        fetchStats();
    }, []);

    return (
        <div className="flex h-screen overflow-hidden bg-background-light dark:bg-background-dark transition-colors duration-300">
            {/* Sidebar */}
            <Sidebar />

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto flex flex-col relative w-full">
                <Navbar />

                <div className="p-4 md:p-8 space-y-6 md:space-y-8 max-w-7xl mx-auto w-full pb-24 md:pb-8">
                    {/* Welcome Section */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">{t('dashboard.title', 'Dashboard')}</h2>
                            <p className="text-sm md:text-base text-gray-500 dark:text-gray-400 mt-1">{t('dashboard.welcome', 'Welcome back, ')}<span className="text-primary font-semibold">{user?.name || 'Farmer'}</span>!</p>
                        </div>
                        <button className="flex items-center justify-center gap-2 bg-primary text-white px-5 py-2.5 rounded-xl hover:bg-green-700 transition shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 font-medium w-full md:w-auto" onClick={() => navigate('/sell')}>
                            <span className="material-icons">add_circle</span>
                            <span>{t('dashboard.newListing', 'New Listing')}</span>
                        </button>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                        <StatCard
                            title={t('dashboard.totalSales', 'Total Sales')}
                            value={`₹${stats.totalSales.toLocaleString()}`}
                            trend={t('dashboard.confirmed', 'Confirmed')}
                            trendUp={true}
                            icon="payments"
                            color="text-green-600"
                            bg="bg-green-100 dark:bg-green-900/30"
                        />
                        <StatCard
                            title={t('dashboard.activeListings', 'Active Listings')}
                            value={stats.activeListings.toString()}
                            trend={t('dashboard.total', 'Total')}
                            trendUp={true}
                            icon="inventory_2"
                            color="text-blue-600"
                            bg="bg-blue-100 dark:bg-blue-900/30"
                        />
                        <StatCard
                            title={t('dashboard.pendingOrders', 'Pending Orders')}
                            value={stats.pendingOrders.toString()}
                            trend={t('dashboard.actionReq', 'Action Req.')}
                            trendUp={stats.pendingOrders === 0}
                            icon="hourglass_empty"
                            color="text-orange-600"
                            bg="bg-orange-100 dark:bg-orange-900/30"
                        />
                        <StatCard
                            title={t('dashboard.marketTrends', 'Market Trends')}
                            value={t('dashboard.stable', 'Stable')}
                            trend="+0%"
                            trendUp={true}
                            icon="trending_up"
                            color="text-purple-600"
                            bg="bg-purple-100 dark:bg-purple-900/30"
                        />
                    </div>

                    <div className="grid lg:grid-cols-3 gap-6 md:gap-8">
                        {/* Recent Transactions */}
                        <div className="lg:col-span-2 overflow-x-auto">
                            <TransactionTable />
                        </div>

                        {/* Side Widgets */}
                        <div className="space-y-6">
                            <OrderRequestCard />
                            <WeatherWidget />
                        </div>
                    </div>
                </div>
            </main>
            
            {/* Mobile Bottom Navigation */}
            <MobileBottomNav />
        </div>
    );
};

export default Dashboard;
