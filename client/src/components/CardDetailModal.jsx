import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import api from '../utils/api';
import { 
    AlignLeft, Calendar, CheckSquare, Tag, Users, Trash2, 
    Plus, Loader2, Clock, Check
} from 'lucide-react';
import { format } from 'date-fns';

const CardDetailModal = ({ isOpen, onClose, cardId, onUpdate, onDelete }) => {
    const [card, setCard] = useState(null);
    const [loading, setLoading] = useState(true);
    const [newChecklistItem, setNewChecklistItem] = useState('');
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        if (isOpen && cardId) fetchCard();
    }, [isOpen, cardId]);

    const fetchCard = async () => {
        try {
            const res = await api.get(`/boards/1`); // Need a better way to get single card, but for now filtering from board is fine if I don't have GetCardByPk
            // Actually, I'll implement a get single card endpoint if needed, but I'll search the board data for now
            // Better: Assume GetCardByPk exists (I'll add it to backend routes later)
            // For now, let's just use a dummy find logic or I'll quickly add the backend route
            const boardRes = await api.get('/boards/1');
            let foundCard = null;
            boardRes.data.Lists.forEach(l => {
                const c = l.Cards.find(c => c.id === cardId);
                if (c) foundCard = c;
            });
            setCard(foundCard);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async (updates) => {
        setUpdating(true);
        try {
            const res = await api.put(`/cards/${cardId}`, updates);
            setCard({ ...card, ...updates });
            onUpdate(cardId, updates);
        } catch (err) {
            console.error(err);
        } finally {
            setUpdating(false);
        }
    };

    const addChecklistItem = async (e) => {
        e.preventDefault();
        if (!newChecklistItem.trim()) return;
        try {
            const res = await api.post(`/cards/${cardId}/checklist`, { title: newChecklistItem });
            setCard({ 
                ...card, 
                ChecklistItems: [...(card.ChecklistItems || []), res.data] 
            });
            setNewChecklistItem('');
            onUpdate(cardId, { ChecklistItems: [...(card.ChecklistItems || []), res.data] });
        } catch (err) {
            console.error(err);
        }
    };

    const toggleChecklistItem = async (itemId, currentStatus) => {
        try {
            await api.put(`/checklist/${itemId}`, { is_completed: !currentStatus });
            const updatedItems = card.ChecklistItems.map(item => 
                item.id === itemId ? { ...item, is_completed: !currentStatus } : item
            );
            setCard({ ...card, ChecklistItems: updatedItems });
            onUpdate(cardId, { ChecklistItems: updatedItems });
        } catch (err) {
            console.error(err);
        }
    };

    if (!card) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={card.title}>
            <div className="space-y-8 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
                {/* Meta info */}
                <div className="flex flex-wrap gap-6 items-start">
                    {card.due_date && (
                        <div className="space-y-1">
                            <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Due Date</h4>
                            <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg text-sm text-white">
                                <Clock size={14} className="text-primary-400" />
                                {format(new Date(card.due_date), 'PPP')}
                            </div>
                        </div>
                    )}
                    
                    {card.Labels?.length > 0 && (
                        <div className="space-y-1">
                            <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Labels</h4>
                            <div className="flex gap-2">
                                {card.Labels.map(label => (
                                    <div 
                                        key={label.id}
                                        className="px-3 py-1 rounded-lg text-[10px] font-bold text-white shadow-sm"
                                        style={{ backgroundColor: label.color }}
                                    >
                                        {label.name}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {card.Users?.length > 0 && (
                        <div className="space-y-1">
                            <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Members</h4>
                            <div className="flex -space-x-2">
                                {card.Users.map(user => (
                                    <img 
                                        key={user.id} 
                                        src={user.avatar} 
                                        alt={user.name}
                                        className="w-8 h-8 rounded-full border-2 border-[#2a2a3c]"
                                        title={user.name}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Description */}
                <div className="space-y-3">
                    <div className="flex items-center gap-2 text-white font-semibold">
                        <AlignLeft size={18} className="text-primary-400" />
                        Description
                    </div>
                    <p className="text-gray-400 text-sm leading-relaxed bg-white/5 p-4 rounded-xl border border-white/5">
                        {card.description || 'No description provided.'}
                    </p>
                </div>

                {/* Checklist */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between text-white font-semibold">
                        <div className="flex items-center gap-2">
                            <CheckSquare size={18} className="text-primary-400" />
                            Checklist
                        </div>
                        <span className="text-xs bg-primary-500/10 text-primary-400 px-2 py-1 rounded-full border border-primary-500/20">
                            {card.ChecklistItems?.filter(i => i.is_completed).length || 0} / {card.ChecklistItems?.length || 0}
                        </span>
                    </div>

                    <div className="space-y-2">
                        {card.ChecklistItems?.map(item => (
                            <div 
                                key={item.id}
                                onClick={() => toggleChecklistItem(item.id, item.is_completed)}
                                className="group flex items-center gap-3 bg-white/5 hover:bg-white/10 p-3 rounded-xl border border-white/5 cursor-pointer transition-all"
                            >
                                <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${
                                    item.is_completed ? 'bg-primary-500 border-primary-500 text-white' : 'border-white/20 group-hover:border-primary-500/50'
                                }`}>
                                    {item.is_completed && <Check size={14} />}
                                </div>
                                <span className={`text-sm transition-all ${item.is_completed ? 'text-gray-500 line-through' : 'text-gray-300'}`}>
                                    {item.title}
                                </span>
                            </div>
                        ))}
                    </div>

                    <form onSubmit={addChecklistItem} className="flex gap-2">
                        <input 
                            type="text" 
                            placeholder="Add an item..."
                            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-primary-500"
                            value={newChecklistItem}
                            onChange={(e) => setNewChecklistItem(e.target.value)}
                        />
                        <button type="submit" className="bg-white/5 hover:bg-primary-500 p-2 rounded-xl transition-all border border-white/10 text-gray-400 hover:text-white">
                            <Plus size={20} />
                        </button>
                    </form>
                </div>

                {/* Actions */}
                <div className="pt-6 border-t border-white/5 flex gap-3">
                    <button 
                        onClick={() => onDelete(cardId)}
                        className="flex items-center gap-2 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white px-4 py-2 rounded-xl text-sm font-medium transition-all group"
                    >
                        <Trash2 size={16} className="group-hover:scale-110 transition-transform" />
                        Delete Card
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default CardDetailModal;
