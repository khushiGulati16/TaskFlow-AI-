import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Layout, PieChart, Bell, Settings, HelpCircle, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import NotificationsDropdown from './NotificationsDropdown';
import SettingsModal from './SettingsModal';

const Navbar = () => {
    const { logout, user } = useAuth();
    const navigate = useNavigate();
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="h-screen w-20 bg-[#181824] border-r border-white/5 flex flex-col items-center py-8 gap-8 text-gray-500 z-40">
            <div 
                onClick={() => navigate('/')}
                className="w-12 h-12 bg-primary-600 rounded-2xl flex items-center justify-center text-white font-black shadow-xl shadow-primary-500/20 mb-6 hover:scale-110 transition-transform cursor-pointer"
            >
                TF
            </div>
            
            <div className="flex flex-col gap-4">
                <NavLink 
                    to="/" 
                    className={({isActive}) => `p-3.5 rounded-2xl transition-all relative group ${isActive ? 'bg-primary-500/10 text-primary-500' : 'hover:bg-white/5 hover:text-white'}`}
                >
                    <Layout size={24} />
                    <motion.div className="absolute left-[-20px] top-1/2 -translate-y-1/2 w-1.5 h-6 bg-primary-500 rounded-r-full opacity-0 group-hover:opacity-100" />
                </NavLink>

                <NavLink 
                    to="/dashboard" 
                    className={({isActive}) => `p-3.5 rounded-2xl transition-all relative group ${isActive ? 'bg-primary-500/10 text-primary-500' : 'hover:bg-white/5 hover:text-white'}`}
                >
                    <PieChart size={24} />
                    <motion.div className="absolute left-[-20px] top-1/2 -translate-y-1/2 w-1.5 h-6 bg-primary-500 rounded-r-full opacity-0 group-hover:opacity-100" />
                </NavLink>
            </div>

            <div className="mt-auto flex flex-col gap-6 items-center relative">
                <button 
                    onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                    className={`p-3.5 hover:text-white transition-all hover:bg-white/5 rounded-2xl group relative ${isNotificationsOpen ? 'text-white bg-white/5' : 'text-gray-400'}`}
                >
                    <Bell size={24} />
                    <span className="absolute top-3.5 right-3.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-[#181824] animate-pulse" />
                </button>
                
                <NotificationsDropdown isOpen={isNotificationsOpen} onClose={() => setIsNotificationsOpen(false)} />

                <button 
                    onClick={() => setIsSettingsOpen(true)}
                    className="p-3.5 hover:text-white transition-all hover:bg-white/5 rounded-2xl text-gray-400"
                >
                    <Settings size={24} />
                </button>

                <div className="h-[1px] w-8 bg-white/10" />

                <button 
                    onClick={handleLogout}
                    className="p-3.5 hover:text-red-400 transition-all hover:bg-red-400/10 rounded-2xl text-gray-400 mb-2"
                    title="Logout"
                >
                    <LogOut size={24} />
                </button>

                <div className="relative group cursor-pointer">
                    <img 
                        src={user?.avatar || 'https://ui-avatars.com/api/?name=Guest&background=random'} 
                        className="w-10 h-10 rounded-2xl border-2 border-white/10 group-hover:border-primary-500 transition-all shadow-lg"
                        alt="Profile"
                    />
                    <div className="absolute left-14 bottom-0 bg-[#2a2a3c] border border-white/10 px-3 py-1.5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap text-xs font-bold text-white shadow-2xl z-50">
                        {user?.name || 'Guest User'}
                    </div>
                </div>
            </div>

            <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
        </nav>
    );
};

export default Navbar;
