import React from 'react';
import Navbar from '../components/Navbar';
import { ViewState } from '../../constants.js';
import { useNavigate } from 'react-router-dom';

const Landing = () => {
    const navigate = useNavigate();
    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />

            <main className="flex-grow">
                {/* Hero Section */}
                <div className="relative overflow-hidden pt-10 pb-20 md:pt-16 md:pb-32 lg:pt-32 lg:pb-40">
                    <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 md:w-96 md:h-96 rounded-full bg-secondary/10 dark:bg-secondary/10 blur-3xl "></div>
                    <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-48 h-48 md:w-80 md:h-80 rounded-full bg-primary/10 dark:bg-primary/10 blur-3xl"></div>

                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                        <div className="lg:grid lg:grid-cols-12 lg:gap-16 items-center">
                            <div className="lg:col-span-12 xl:col-span-6 text-center xl:text-left mb-10 md:mb-12 xl:mb-0">
                                <div className="inline-flex items-center px-4 py-2 rounded-full bg-green-100 dark:bg-green-900/60 text-primary dark:text-green-300 text-xs md:text-sm font-semibold mb-6 ring-1 ring-inset ring-green-600/20 dark:ring-green-500/30 mx-auto xl:mx-0">
                                    <span className="material-icons text-base mr-2">eco</span> Empowering Indian Agriculture
                                </div>
                                <h1 className="text-3xl sm:text-4xl md:text-6xl font-extrabold tracking-tight mb-6 text-gray-900 dark:text-white leading-tight">
                                    Fresh from the Farm,<br className="hidden sm:block" />
                                    <span className="text-primary dark:text-green-400"> Direct to You.</span>
                                </h1>
                                <p className="text-base md:text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto xl:mx-0">
                                    Connecting farmers directly with consumers and businesses. Eliminate middlemen, get fair prices, and access real-time Mandi rates effortlessly.
                                </p>
                                <div className="flex flex-col sm:flex-row gap-4 justify-center xl:justify-start">
                                    <button
                                        onClick={() => navigate('/dashboard')}
                                        className="inline-flex items-center justify-center px-6 py-3 md:px-8 md:py-4 text-base md:text-lg font-bold rounded-full text-white bg-primary hover:bg-green-700 dark:bg-primary dark:hover:bg-green-600 shadow-lg hover:shadow-green-500/30 transition-all transform hover:-translate-y-1"
                                    >
                                        Get Started
                                        <span className="material-icons ml-2">arrow_forward</span>
                                    </button>
                                    <button className="inline-flex items-center justify-center px-6 py-3 md:px-8 md:py-4 text-base md:text-lg font-bold rounded-full text-primary bg-white border-2 border-primary/20 hover:border-primary hover:bg-green-50 dark:bg-transparent dark:text-white dark:border-gray-600 dark:hover:border-green-400 dark:hover:text-green-400 transition-all">
                                        <span className="material-icons mr-2">play_circle_filled</span> Watch Demo
                                    </button>
                                </div>
                                <div className="mt-10 md:mt-12 grid grid-cols-3 gap-4 md:gap-6 border-t border-gray-200 dark:border-gray-700 pt-8 max-w-lg mx-auto xl:mx-0">
                                    <div>
                                        <p className="text-xl md:text-3xl font-bold text-gray-900 dark:text-white">10k+</p>
                                        <p className="text-[10px] md:text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wider">Farmers</p>
                                    </div>
                                    <div>
                                        <p className="text-xl md:text-3xl font-bold text-gray-900 dark:text-white">₹5Cr</p>
                                        <p className="text-[10px] md:text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wider">Transactions</p>
                                    </div>
                                    <div>
                                        <p className="text-xl md:text-3xl font-bold text-gray-900 dark:text-white">50+</p>
                                        <p className="text-[10px] md:text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wider">Mandis</p>
                                    </div>
                                </div>
                            </div>
                            <div className="lg:col-span-12 xl:col-span-6 relative mt-12 xl:mt-0">
                                <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-br from-green-50 to-orange-50 dark:from-gray-800 dark:to-gray-900 p-4 md:p-8 border border-white/20 dark:border-gray-700">
                                    <img
                                        alt="Happy farmer"
                                        className="rounded-xl w-full h-auto object-cover shadow-lg transform transition hover:scale-[1.02] duration-500 relative z-10"
                                        src="https://picsum.photos/id/85/800/600?random=1"
                                    />
                                    {/* Floating Cards - Hidden on very small screens or adjusted */}
                                    <div className="absolute -bottom-4 md:-bottom-6 -left-2 md:-left-6 bg-white dark:bg-card-dark p-3 md:p-4 rounded-xl shadow-xl border border-gray-100 dark:border-gray-600 z-20 max-w-[140px] md:max-w-xs animate-bounce" style={{ animationDuration: '3s' }}>
                                        <div className="flex items-center space-x-2 md:space-x-3 mb-1 md:mb-2">
                                            <div className="bg-green-100 dark:bg-green-900/50 p-1.5 md:p-2 rounded-full text-primary dark:text-green-300">
                                                <span className="material-icons text-xs md:text-sm">trending_up</span>
                                            </div>
                                            <div>
                                                <p className="text-[8px] md:text-xs text-gray-500 dark:text-gray-400">Earnings Today</p>
                                                <p className="text-xs md:text-base font-bold text-gray-800 dark:text-white">₹5,200</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Feature Grid */}
                <section className="py-16 md:py-20 bg-white dark:bg-card-dark transition-colors duration-300">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-12 md:mb-16">
                            <h2 className="text-primary dark:text-green-400 font-semibold tracking-wide uppercase text-xs md:text-sm">Why Choose Us</h2>
                            <p className="mt-2 text-2xl md:text-3xl leading-8 font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl">Everything a Farmer Needs</p>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
                            {[{ title: 'Sell Produce', icon: 'storefront', color: 'green' }, { title: 'Mandi Prices', icon: 'analytics', color: 'orange' }, { title: 'Secure Payments', icon: 'verified_user', color: 'blue' }].map((feature) => (
                                <div key={feature.title} className="bg-background-light dark:bg-background-dark rounded-2xl p-6 md:p-8 hover:shadow-lg transition duration-300 border border-transparent dark:border-gray-700 hover:border-primary/20">
                                    <div className={`w-12 h-12 md:w-14 md:h-14 bg-${feature.color}-100 dark:bg-${feature.color}-900/40 rounded-xl flex items-center justify-center text-${feature.color}-600 dark:text-${feature.color}-400 mb-6`}>
                                        <span className="material-icons text-2xl md:text-3xl">{feature.icon}</span>
                                    </div>
                                    <h3 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white mb-3">{feature.title}</h3>
                                    <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 leading-relaxed">
                                        Connecting you directly to the market with tools that empower your growth and secure your profits.
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </main>

            <footer className="bg-white dark:bg-card-dark border-t border-gray-200 dark:border-gray-800 py-6 md:py-8 transition-colors duration-300">
                <div className="max-w-7xl mx-auto px-4 text-center text-gray-500 dark:text-gray-400 text-xs md:text-sm">
                    © 2023 KrishiEaze. Connecting Farmers to Consumers. All rights reserved.
                </div>
            </footer>
        </div>
    );
};

export default Landing;
