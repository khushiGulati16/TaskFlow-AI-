import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../utils/api';
import { Bell, Clock, Info } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const NotificationsDropdown = ({ isOpen, onClose }) => {
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (isOpen) fetchActivities();
    }, [isOpen]);

    const fetchActivities = async () => {
        try {
            setLoading(true);
            const res = await api.get('/activities');
            setActivities(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <div className="fixed inset-0 z-[55]" onClick={onClose} />
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute right-0 top-14 w-80 bg-[#2a2a3c] rounded-3xl border border-white/10 shadow-2xl z-[56] overflow-hidden"
                    >
                        <div className="p-4 border-b border-white/5 flex items-center justify-between">
                            <h3 className="text-sm font-bold text-white flex items-center gap-2">
                                <Bell size={16} className="text-primary-500" /> Notifications
                            </h3>
                            <span className="text-[10px] bg-primary-500/10 text-primary-400 px-2 py-0.5 rounded-full border border-primary-500/20">
                                Recent
                            </span>
                        </div>

                        <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                            {loading ? (
                                <div className="p-8 text-center"><div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-500 mx-auto"></div></div>
                            ) : activities.length > 0 ? (
                                activities.map((activity) => (
                                    <div key={activity.id} className="p-4 border-b border-white/5 hover:bg-white/5 transition-colors flex gap-3">
                                        <img src={activity.User.avatar} className="w-8 h-8 rounded-full border border-white/10 flex-shrink-0" alt="User" />
                                        <div className="space-y-1">
                                            <p className="text-xs text-gray-300 leading-relaxed">
                                                <span className="font-bold text-white">{activity.User.name}</span> {activity.content}
                                            </p>
                                            <div className="flex items-center gap-1 text-[10px] text-gray-500">
                                                <Clock size={10} />
                                                {formatDistanceToNow(new Date(activity.createdAt), { addSuffix: true })}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="p-12 text-center space-y-3">
                                    <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center mx-auto text-gray-500">
                                        <Info size={24} />
                                    </div>
                                    <p className="text-sm text-gray-500">No recent activity</p>
                                </div>
                            )}
                        </div>

                        <div className="p-3 bg-white/5 text-center">
                            <button className="text-[10px] font-bold text-primary-400 hover:text-primary-300 uppercase tracking-wider">
                                View all activity
                            </button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default NotificationsDropdown;
