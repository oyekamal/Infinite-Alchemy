
import React from 'react';
import { ElementItem } from '../types';

interface ElementCardProps {
  element: ElementItem;
  isSelected?: boolean;
  selectionIndex?: 1 | 2;
  onClick?: () => void;
  className?: string;
  isNew?: boolean;
}

const ElementCard: React.FC<ElementCardProps> = ({ 
  element, 
  isSelected, 
  selectionIndex, 
  onClick, 
  className = "",
  isNew 
}) => {
  const selectionStyles = isSelected 
    ? selectionIndex === 1 
      ? "ring-2 ring-yellow-400 bg-yellow-900/40 shadow-[0_0_15px_rgba(250,204,21,0.5)]" 
      : "ring-2 ring-blue-400 bg-blue-900/40 shadow-[0_0_15px_rgba(96,165,250,0.5)]"
    : "bg-gray-800 hover:bg-gray-700 active:scale-95 border border-gray-700";

  return (
    <div 
      onClick={onClick}
      className={`
        ${selectionStyles}
        ${isNew ? "animate-pulse border-green-500" : ""}
        relative flex items-center gap-2 px-4 py-2 rounded-full cursor-pointer transition-all duration-200 
        group ${className}
      `}
    >
      <span className="text-xl group-hover:scale-125 transition-transform duration-200">
        {element.emoji}
      </span>
      <span className="text-sm font-medium whitespace-nowrap">
        {element.name}
      </span>
      {element.isCustom && (
        <span className="absolute -top-1 -right-1 text-[10px] bg-indigo-600 text-white rounded-full px-1 py-0.5 shadow">
          ✨
        </span>
      )}
    </div>
  );
};

export default ElementCard;
