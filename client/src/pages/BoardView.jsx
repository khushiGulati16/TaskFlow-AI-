import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable } from '@hello-pangea/dnd';
import api from '../utils/api';
import List from '../components/List';
import AddCardModal from '../components/AddCardModal';
import AddListModal from '../components/AddListModal';
import CardDetailModal from '../components/CardDetailModal';
import ShareBoardModal from '../components/ShareBoardModal';
import NotificationsDropdown from '../components/NotificationsDropdown';
import SettingsModal from '../components/SettingsModal';
import { Search, Filter, Plus, Layout, Bell, Settings, Share2 } from 'lucide-react';
import { motion } from 'framer-motion';

const BoardView = () => {
    const [board, setBoard] = useState(null);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    
    // Modal states
    const [isAddCardOpen, setIsAddCardOpen] = useState(false);
    const [activeListId, setActiveListId] = useState(null);
    const [isAddListOpen, setIsAddListOpen] = useState(false);
    const [selectedCardId, setSelectedCardId] = useState(null);
    const [isShareOpen, setIsShareOpen] = useState(false);
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    useEffect(() => { fetchBoard(); }, []);

    const fetchBoard = async () => {
        try {
            setLoading(true);
            // 1. Fetch list of user's boards
            const boardsRes = await api.get('/boards');
            
            if (boardsRes.data.length > 0) {
                // 2. Fetch the full detail for the first board
                const firstBoardId = boardsRes.data[0].id;
                const boardDetailRes = await api.get(`/boards/${firstBoardId}`);
                setBoard(boardDetailRes.data);
            } else {
                setBoard(null);
            }
            setLoading(false);
        } catch (err) {
            console.error(err);
            setBoard(null);
            setLoading(false);
        }
    };

    const onDragEnd = async (result) => {
        const { destination, source, type } = result;
        if (!destination) return;
        if (destination.droppableId === source.droppableId && destination.index === source.index) return;

        if (type === 'list') {
            const newListOrder = Array.from(board.Lists);
            const [removed] = newListOrder.splice(source.index, 1);
            newListOrder.splice(destination.index, 0, removed);
            setBoard({ ...board, Lists: newListOrder });
            await api.post('/lists/reorder', { lists: newListOrder.map((l, i) => ({ id: l.id, position: i })) });
            return;
        }

        const sourceList = board.Lists.find(l => String(l.id) === source.droppableId);
        const destList = board.Lists.find(l => String(l.id) === destination.droppableId);
        
        if (sourceList === destList) {
            const newCards = Array.from(sourceList.Cards);
            const [removed] = newCards.splice(source.index, 1);
            newCards.splice(destination.index, 0, removed);
            setBoard({ ...board, Lists: board.Lists.map(l => l.id === sourceList.id ? { ...l, Cards: newCards } : l) });
            await api.post('/cards/reorder', { cards: newCards.map((c, i) => ({ id: c.id, position: i, list_id: sourceList.id })) });
        } else {
            const sourceCards = Array.from(sourceList.Cards);
            const [removed] = sourceCards.splice(source.index, 1);
            const destCards = Array.from(destList.Cards);
            destCards.splice(destination.index, 0, { ...removed, list_id: destList.id });
            setBoard({ ...board, Lists: board.Lists.map(l => {
                if (l.id === sourceList.id) return { ...l, Cards: sourceCards };
                if (l.id === destList.id) return { ...l, Cards: destCards };
                return l;
            }) });
            await api.put(`/cards/${removed.id}`, { list_id: destList.id });
        }
    };

    const handleAddCard = (listId) => {
        setActiveListId(listId);
        setIsAddCardOpen(true);
    };

    const onCardAdded = (newCard) => {
        setBoard({
            ...board,
            Lists: board.Lists.map(l => 
                l.id === newCard.list_id ? { ...l, Cards: [...l.Cards, newCard] } : l
            )
        });
    };

    const onListAdded = (newList) => {
        setBoard({
            ...board,
            Lists: [...board.Lists, { ...newList, Cards: [] }]
        });
    };

    const handleCardUpdate = (cardId, updates) => {
        setBoard({
            ...board,
            Lists: board.Lists.map(l => ({
                ...l,
                Cards: l.Cards.map(c => c.id === cardId ? { ...c, ...updates } : c)
            }))
        });
    };

    const handleCardDelete = async (cardId) => {
        try {
            await api.delete(`/cards/${cardId}`);
            setBoard({
                ...board,
                Lists: board.Lists.map(l => ({
                    ...l,
                    Cards: l.Cards.filter(c => c.id !== cardId)
                }))
            });
            setSelectedCardId(null);
        } catch (err) {
            console.error(err);
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center h-screen bg-[#1e1e2d]">
            <motion.div 
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                className="h-12 w-12 border-4 border-primary-500 border-t-transparent rounded-full"
            />
        </div>
    );

    if (!board) return (
        <div className="flex-1 flex flex-col items-center justify-center bg-[#1e1e2d] text-white p-8">
            <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center space-y-6 max-w-md"
            >
                <div className="w-24 h-24 bg-primary-600/10 rounded-3xl flex items-center justify-center mx-auto border border-primary-500/20 shadow-2xl shadow-primary-500/10">
                    <Layout className="text-primary-500" size={48} />
                </div>
                <h1 className="text-3xl font-bold">No Board Found</h1>
                <p className="text-gray-400">Welcome to TaskFlow AI! You haven't created any boards yet. Create your first board to start managing tasks.</p>
                <button 
                    onClick={() => {/* I'll implement AddBoardModal later or just a placeholder */}}
                    className="bg-primary-600 hover:bg-primary-500 text-white px-8 py-3 rounded-2xl font-bold shadow-lg shadow-primary-500/20 transition-all transform hover:scale-105"
                >
                    Create Your First Board
                </button>
            </motion.div>
        </div>
    );

    const filteredLists = board.Lists.map(list => ({
        ...list,
        Cards: list.Cards.filter(card => 
            card.title.toLowerCase().includes(searchTerm.toLowerCase())
        )
    }));

    return (
        <div className="h-screen flex flex-col bg-[#1e1e2d] text-white overflow-hidden font-inter">
            {/* Header Redesigned */}
            <div className="p-4 px-8 glass mb-4 flex items-center justify-between border-b border-white/5">
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/20">
                            <Layout className="text-white" size={24} />
                        </div>
                        <h1 className="text-xl font-black tracking-tight text-white uppercase italic">
                            TaskFlow <span className="text-primary-500">AI</span>
                        </h1>
                    </div>
                    <div className="h-8 w-[1px] bg-white/10" />
                    <h2 className="text-lg font-medium text-gray-300">{board.title}</h2>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                        <input 
                            type="text" 
                            placeholder="Search tasks..." 
                            className="bg-white/5 border border-white/10 rounded-2xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/50 w-64 transition-all" 
                            value={searchTerm} 
                            onChange={(e) => setSearchTerm(e.target.value)} 
                        />
                    </div>
                </div>

                <div className="flex items-center gap-4 relative">
                    <div className="relative">
                        <button 
                            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                            className={`p-2.5 rounded-xl border transition-all ${isNotificationsOpen ? 'bg-primary-500/10 border-primary-500 text-primary-500' : 'bg-white/5 border-white/10 text-gray-400 hover:text-white hover:bg-white/10'}`}
                        >
                            <Bell size={20} />
                        </button>
                        <NotificationsDropdown isOpen={isNotificationsOpen} onClose={() => setIsNotificationsOpen(false)} />
                    </div>

                    <button 
                        onClick={() => setIsSettingsOpen(true)}
                        className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition-all"
                    >
                        <Settings size={20} />
                    </button>

                    <button 
                        onClick={() => setIsShareOpen(true)}
                        className="flex items-center gap-2 bg-primary-600 hover:bg-primary-500 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-primary-500/20 transition-all"
                    >
                        <Share2 size={18} /> Share
                    </button>
                </div>
            </div>

            {/* Kanban Content */}
            <div className="flex-1 overflow-x-auto overflow-y-hidden px-8 pb-8 pt-2">
                <DragDropContext onDragEnd={onDragEnd}>
                    <Droppable droppableId="board" type="list" direction="horizontal">
                        {(provided) => (
                            <div ref={provided.innerRef} {...provided.droppableProps} className="flex items-start h-full">
                                {filteredLists.sort((a,b) => a.position - b.position).map((list, idx) => (
                                    <List 
                                        key={list.id} 
                                        list={list} 
                                        index={idx} 
                                        onCardClick={(c) => setSelectedCardId(c.id)} 
                                        onAddCard={handleAddCard} 
                                    />
                                ))}
                                {provided.placeholder}
                                
                                <button 
                                    onClick={() => setIsAddListOpen(true)}
                                    className="w-72 flex-shrink-0 bg-white/5 hover:bg-white/10 border-2 border-white/5 border-dashed rounded-2xl h-14 flex items-center justify-center gap-3 text-gray-400 hover:text-white transition-all font-medium"
                                >
                                    <Plus size={22} className="text-primary-500" /> 
                                    Add New List
                                </button>
                            </div>
                        )}
                    </Droppable>
                </DragDropContext>
            </div>

            {/* Modals */}
            <AddCardModal 
                isOpen={isAddCardOpen} 
                onClose={() => setIsAddCardOpen(false)} 
                listId={activeListId}
                onCardAdded={onCardAdded}
            />
            <AddListModal 
                isOpen={isAddListOpen} 
                onClose={() => setIsAddListOpen(false)} 
                boardId={board.id}
                onListAdded={onListAdded}
            />
            <CardDetailModal 
                isOpen={!!selectedCardId} 
                onClose={() => setSelectedCardId(null)}
                cardId={selectedCardId}
                onUpdate={handleCardUpdate}
                onDelete={handleCardDelete}
            />
            <ShareBoardModal 
                isOpen={isShareOpen} 
                onClose={() => setIsShareOpen(false)} 
                boardTitle={board.title} 
            />
            <SettingsModal 
                isOpen={isSettingsOpen} 
                onClose={() => setIsSettingsOpen(false)} 
            />
        </div>
    );
};

export default BoardView;
