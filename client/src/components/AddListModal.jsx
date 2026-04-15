import React, { useState } from 'react';
import Modal from './Modal';
import api from '../utils/api';
import { Layout, Loader2 } from 'lucide-react';

const AddListModal = ({ isOpen, onClose, boardId, onListAdded }) => {
    const [title, setTitle] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await api.post('/lists', {
                title,
                board_id: boardId,
                position: 999 
            });
            onListAdded(res.data);
            setTitle('');
            onClose();
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Add New List">
            <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-400 flex items-center gap-2">
                        <Layout size={16} /> List Title
                    </label>
                    <input 
                        type="text" 
                        required
                        autoFocus
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary-500/50"
                        placeholder="e.g., In Progress, QA, Blocked..."
                    />
                </div>

                <div className="flex justify-end gap-3 pt-4">
                    <button 
                        type="button" 
                        onClick={onClose}
                        className="px-6 py-2.5 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-all text-sm font-medium"
                    >
                        Cancel
                    </button>
                    <button 
                        type="submit" 
                        disabled={loading}
                        className="bg-primary-600 hover:bg-primary-500 text-white px-8 py-2.5 rounded-xl font-bold shadow-lg shadow-primary-500/20 transition-all flex items-center gap-2"
                    >
                        {loading ? <Loader2 className="animate-spin" size={18} /> : 'Create List'}
                    </button>
                </div>
            </form>
        </Modal>
    );
};

export default AddListModal;
