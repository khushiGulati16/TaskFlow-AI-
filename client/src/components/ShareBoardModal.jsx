import React, { useState } from 'react';
import Modal from './Modal';
import { Copy, Check, Share2, Globe, Lock, Mail, Send } from 'lucide-react';

const ShareBoardModal = ({ isOpen, onClose, boardTitle }) => {
    const [copied, setCopied] = useState(false);
    const [inviteEmail, setInviteEmail] = useState('');
    const shareUrl = window.location.href;

    const copyToClipboard = () => {
        navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={`Share "${boardTitle}"`}>
            <div className="space-y-8">
                {/* Invite Members */}
                <div className="space-y-3">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Invite Members</label>
                    <div className="flex gap-2">
                        <div className="relative flex-1 group">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-primary-400 transition-colors" size={18} />
                            <input 
                                type="email" 
                                value={inviteEmail}
                                onChange={(e) => setInviteEmail(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all"
                                placeholder="Enter email address..."
                            />
                        </div>
                        <button className="bg-primary-600 hover:bg-primary-500 text-white px-5 rounded-2xl flex items-center gap-2 transition-all active:scale-95 font-bold text-sm">
                            <Send size={16} /> Send
                        </button>
                    </div>
                </div>

                {/* Share Link */}
                <div className="space-y-3">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Share via link</label>
                    <div className="flex items-center gap-3 bg-white/5 p-4 rounded-2xl border border-white/5">
                        <div className="w-10 h-10 bg-primary-600/10 rounded-xl flex items-center justify-center text-primary-500">
                            <Globe size={20} />
                        </div>
                        <div className="flex-1 overflow-hidden">
                            <p className="text-xs font-bold text-white mb-1">Anyone with the link</p>
                            <p className="text-[10px] text-gray-500 truncate">{shareUrl}</p>
                        </div>
                        <button 
                            onClick={copyToClipboard}
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all transform active:scale-95 ${
                                copied ? 'bg-green-500 text-white shadow-lg shadow-green-500/20' : 'bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white border border-white/10'
                            }`}
                        >
                            {copied ? <><Check size={14} /> Copied!</> : <><Copy size={14} /> Copy</>}
                        </button>
                    </div>
                </div>

                {/* Permissions Preview */}
                <div className="bg-white/5 rounded-2xl p-4 flex items-center justify-between border border-white/5">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-yellow-500/10 rounded-lg text-yellow-500">
                            <Lock size={16} />
                        </div>
                        <p className="text-xs text-gray-400 font-medium italic">Only invited members can edit</p>
                    </div>
                    <button className="text-[10px] font-bold text-primary-400 hover:underline">Change Permissions</button>
                </div>
            </div>
        </Modal>
    );
};

export default ShareBoardModal;
