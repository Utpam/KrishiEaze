import React from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import StatCard from '../components/StatCard';
import TransactionTable from '../components/TransactionTable';
import OrderRequestCard from '../components/OrderRequestCard';
import { useSelector } from 'react-redux';

const Dashboard = () => {
    const { user } = useSelector((state) => state.auth);

    return (
        <div className="flex h-screen overflow-hidden bg-background-light dark:bg-background-dark transition-colors duration-300">
            {/* Sidebar */}
            <Sidebar />

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto flex flex-col relative w-full">
                <Navbar />

                <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto w-full">
                    {/* Welcome Section */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h2>
                            <p className="text-gray-500 dark:text-gray-400 mt-1">Welcome back, <span className="text-primary font-semibold">{user?.name || 'Farmer'}</span>! Here's what's happening today.</p>
                        </div>
                        <button className="flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-xl hover:bg-green-700 transition shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 font-medium">
                            <span className="material-icons">add_circle</span>
                            <span>New Listing</span>
                        </button>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <StatCard
                            title="Total Sales"
                            value="₹1,24,500"
                            trend="+15%"
                            trendUp={true}
                            icon="payments"
                            color="text-green-600"
                            bg="bg-green-100 dark:bg-green-900/30"
                        />
                        <StatCard
                            title="Active Listings"
                            value="8"
                            trend="2 New"
                            trendUp={true}
                            icon="inventory_2"
                            color="text-blue-600"
                            bg="bg-blue-100 dark:bg-blue-900/30"
                        />
                        <StatCard
                            title="Pending Orders"
                            value="3"
                            trend="Action Req."
                            trendUp={false}
                            icon="hourglass_empty"
                            color="text-orange-600"
                            bg="bg-orange-100 dark:bg-orange-900/30"
                        />
                        <StatCard
                            title="Market Trends"
                            value="Wheat Up"
                            trend="+5%"
                            trendUp={true}
                            icon="trending_up"
                            color="text-purple-600"
                            bg="bg-purple-100 dark:bg-purple-900/30"
                        />
                    </div>

                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Recent Transactions */}
                        <div className="lg:col-span-2">
                            <TransactionTable />
                        </div>

                        {/* Side Widgets */}
                        <div className="space-y-6">
                            <OrderRequestCard />
                            {/* Weather Widget (Placeholder) */}
                            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg p-6 text-white relative overflow-hidden">
                                <div className="relative z-10">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h3 className="font-bold text-lg">Weather Outlook</h3>
                                            <p className="text-blue-100 text-sm">Nagpur, Maharashtra</p>
                                        </div>
                                        <span className="material-icons text-4xl text-yellow-300 animate-spin-slow">wb_sunny</span>
                                    </div>
                                    <div className="text-4xl font-bold mb-2">32°C</div>
                                    <p className="text-blue-100 mb-4">Sunny with clear skies. Perfect for harvesting.</p>
                                    <div className="flex gap-4 text-sm font-medium text-blue-100">
                                        <span className="flex items-center gap-1"><span className="material-icons text-sm">water_drop</span> 12%</span>
                                        <span className="flex items-center gap-1"><span className="material-icons text-sm">air</span> 8 km/h</span>
                                    </div>
                                </div>
                                {/* Decorative circles */}
                                <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
