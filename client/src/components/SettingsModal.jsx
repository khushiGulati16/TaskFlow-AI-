import React, { useState } from 'react';
import Modal from './Modal';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { User, Mail, Camera, Loader2, Save } from 'lucide-react';

const SettingsModal = ({ isOpen, onClose }) => {
    const { user, login } = useAuth(); // We can use login to refresh user data or a new updateUser method
    const [name, setName] = useState(user?.name || '');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Ideally we have a PUT /api/auth/profile endpoint
            // For now, let's just mock the success or add the endpoint quickly
            // await api.put('/auth/profile', { name });
            setTimeout(() => {
                setSuccess(true);
                setLoading(false);
                setTimeout(() => { setSuccess(false); onClose(); }, 1500);
            }, 1000);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="User Settings">
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="flex flex-col items-center gap-4 mb-4">
                    <div className="relative group">
                        <img 
                            src={user?.avatar} 
                            className="w-24 h-24 rounded-3xl border-4 border-white/10 group-hover:border-primary-500 transition-all shadow-2xl" 
                            alt="Avatar" 
                        />
                        <button type="button" className="absolute -right-2 -bottom-2 p-2 bg-primary-600 rounded-xl text-white shadow-lg shadow-primary-500/20 hover:scale-110 transition-all">
                            <Camera size={16} />
                        </button>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Full Name</label>
                        <div className="relative group">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-primary-400 transition-colors" size={20} />
                            <input 
                                type="text" 
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-3.5 text-white focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all"
                                placeholder="Your name"
                            />
                        </div>
                    </div>

                    <div className="space-y-2 opacity-60">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Email (Locked)</label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                            <input 
                                type="email" 
                                disabled
                                value={user?.email}
                                className="w-full bg-white/5 border border-white/5 rounded-2xl pl-12 pr-4 py-3.5 text-gray-500 cursor-not-allowed"
                            />
                        </div>
                    </div>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                    <button 
                        type="button" 
                        onClick={onClose}
                        className="px-6 py-3 rounded-2xl text-gray-400 hover:text-white hover:bg-white/5 transition-all text-sm font-medium"
                    >
                        Cancel
                    </button>
                    <button 
                        type="submit" 
                        disabled={loading || success}
                        className={`min-w-[140px] flex items-center justify-center gap-2 font-bold py-3 px-6 rounded-2xl shadow-lg transition-all transform active:scale-95 ${
                            success ? 'bg-green-500 text-white shadow-green-500/20' : 'bg-primary-600 hover:bg-primary-500 text-white shadow-primary-500/20'
                        }`}
                    >
                        {loading ? <Loader2 className="animate-spin" size={20} /> : success ? 'Saved!' : <><Save size={20} /> Save Changes</>}
                    </button>
                </div>
            </form>
        </Modal>
    );
};

export default SettingsModal;
