
import React from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { Move } from 'lucide-react';

export interface DraggableVariantItemProps {
  id: string;
  index: number;
  name: string;
  groupName?: string;
  moveItem: (dragIndex: number, hoverIndex: number) => void;
  onRemove: (id: string) => void;
}

const DraggableVariantItem: React.FC<DraggableVariantItemProps> = ({ 
  id, index, name, groupName, moveItem, onRemove 
}) => {
  const [{ isDragging }, drag] = useDrag({
    type: 'VARIANT_ITEM',
    item: { id, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: 'VARIANT_ITEM',
    hover: (item: { id: string; index: number }, monitor) => {
      if (!monitor.isOver({ shallow: true })) return;
      const dragIndex = item.index;
      const hoverIndex = index;
      
      // Don't replace items with themselves
      if (dragIndex === hoverIndex) return;
      
      moveItem(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  return (
    <div 
      ref={(node) => drag(drop(node))}
      className={`flex items-center justify-between p-2 mb-2 rounded-md border ${
        isDragging ? 'opacity-50 bg-secondary' : 'bg-white'
      }`}
    >
      <div className="flex items-center">
        <Move className="h-4 w-4 mr-2 cursor-move text-gray-400" />
        <div>
          <div className="font-medium">{name}</div>
          {groupName && <div className="text-xs text-gray-500">{groupName}</div>}
        </div>
      </div>
      <button 
        onClick={() => onRemove(id)} 
        className="ml-2 text-red-500 hover:text-red-700"
      >
        &times;
      </button>
    </div>
  );
};

export default DraggableVariantItem;
