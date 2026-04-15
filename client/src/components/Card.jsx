import React from 'react';
import { Draggable } from '@hello-pangea/dnd';
import { Calendar, CheckSquare, AlertCircle } from 'lucide-react';
import { format, differenceInDays, isPast } from 'date-fns';

const Card = ({ card, index, onClick }) => {
    const getRiskColor = (dueDate) => {
        if (!dueDate) return 'border-transparent';
        const date = new Date(dueDate);
        const daysLeft = differenceInDays(date, new Date());
        if (isPast(date)) return 'border-red-500';
        if (daysLeft <= 2) return 'border-orange-500';
        if (daysLeft <= 5) return 'border-yellow-500';
        return 'border-green-500';
    };

    const isAtRisk = () => {
        if (!card.due_date) return false;
        const daysLeft = differenceInDays(new Date(card.due_date), new Date());
        const hasIncompleteChecklist = card.ChecklistItems?.some(item => !item.is_completed);
        return daysLeft <= 2 && hasIncompleteChecklist;
    };

    const completedItems = card.ChecklistItems?.filter(i => i.is_completed).length || 0;
    const totalItems = card.ChecklistItems?.length || 0;

    return (
        <Draggable draggableId={String(card.id)} index={index}>
            {(provided, snapshot) => (
                <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    onClick={() => onClick(card)}
                    className={`bg-[#2a2a3c] p-3 mb-3 rounded-lg shadow-lg border-l-4 transition-all hover:scale-[1.02] cursor-pointer ${
                        getRiskColor(card.due_date)
                    } ${snapshot.isDragging ? 'shadow-2xl ring-2 ring-primary-500' : ''}`}
                >
                    <div className="flex flex-wrap gap-1 mb-2">
                        {card.Labels?.map(label => (
                            <span key={label.id} className="h-2 w-8 rounded-full" style={{ backgroundColor: label.color }} />
                        ))}
                    </div>
                    <h4 className="text-white font-medium mb-2">{card.title}</h4>
                    <div className="flex items-center justify-between text-gray-400 text-xs mt-3">
                        <div className="flex items-center gap-3">
                            {card.due_date && (
                                <div className={`flex items-center gap-1 ${isPast(new Date(card.due_date)) ? 'text-red-400' : ''}`}>
                                    <Calendar size={14} />
                                    <span>{format(new Date(card.due_date), 'MMM d')}</span>
                                </div>
                            )}
                            {totalItems > 0 && (
                                <div className={`flex items-center gap-1 ${completedItems === totalItems ? 'text-green-400' : ''}`}>
                                    <CheckSquare size={14} />
                                    <span>{completedItems}/{totalItems}</span>
                                </div>
                            )}
                        </div>
                        <div className="flex items-center gap-2">
                            {isAtRisk() && (
                                <div className="text-orange-500 flex items-center gap-1 animate-pulse" title="At Risk">
                                    <AlertCircle size={14} />
                                    <span className="font-bold text-[10px]">AT RISK</span>
                                </div>
                            )}
                            <div className="flex -space-x-2">
                                {card.Users?.map(user => (
                                    <img key={user.id} src={user.avatar} className="w-5 h-5 rounded-full border border-[#1e1e2d]" />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </Draggable>
    );
};

export default Card;
