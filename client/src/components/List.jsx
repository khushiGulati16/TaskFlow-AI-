import React from 'react';
import { Droppable, Draggable } from '@hello-pangea/dnd';
import { MoreHorizontal, Plus } from 'lucide-react';
import Card from './Card';

const List = ({ list, index, onCardClick, onAddCard }) => {
    return (
        <Draggable draggableId={`list-${list.id}`} index={index}>
            {(provided) => (
                <div ref={provided.innerRef} {...provided.draggableProps} className="w-72 flex-shrink-0 mr-4">
                    <div className="bg-[#1e1e2d] rounded-xl flex flex-col max-h-[calc(100vh-150px)] shadow-xl border border-white/5">
                        <div {...provided.dragHandleProps} className="p-3 flex items-center justify-between">
                            <h3 className="text-gray-200 font-semibold px-2">{list.title}</h3>
                            <button className="text-gray-500 hover:text-white p-1 rounded-md hover:bg-white/5"><MoreHorizontal size={18} /></button>
                        </div>
                        <Droppable droppableId={String(list.id)} type="card">
                            {(provided, snapshot) => (
                                <div ref={provided.innerRef} {...provided.droppableProps} className={`flex-1 overflow-y-auto px-2 p-2 min-h-[50px] transition-colors ${snapshot.isDraggingOver ? 'bg-white/5' : ''}`}>
                                    {list.Cards?.sort((a,b) => a.position - b.position).map((card, idx) => (
                                        <Card key={card.id} card={card} index={idx} onClick={onCardClick} />
                                    ))}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                        <div className="p-2">
                            <button onClick={() => onAddCard(list.id)} className="w-full flex items-center gap-2 text-gray-400 hover:text-white hover:bg-white/5 p-2 rounded-lg transition-all text-sm group">
                                <Plus size={18} className="text-primary-500 group-hover:scale-110 transition-transform" /> Add a card
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </Draggable>
    );
};

export default List;
