
import React from 'react';
import { Discovery } from '../types';

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  history: Discovery[];
}

const HistoryDrawer: React.FC<HistoryDrawerProps> = ({ isOpen, onClose, history }) => {
  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm transition-opacity" 
          onClick={onClose}
        ></div>
      )}
      
      {/* Drawer */}
      <div className={`
        fixed top-0 right-0 h-full w-80 bg-gray-800 z-50 shadow-2xl transition-transform duration-300 transform
        ${isOpen ? 'translate-x-0' : 'translate-x-full'}
      `}>
        <div className="p-6 h-full flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold flex items-center gap-3">
              <i className="fa-solid fa-book-open text-indigo-400"></i>
              Library
            </h2>
            <button onClick={onClose} className="p-2 hover:bg-gray-700 rounded-lg">
              <i className="fa-solid fa-xmark text-xl"></i>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto space-y-4">
            {history.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <i className="fa-solid fa-hourglass-start text-4xl mb-4 opacity-20"></i>
                <p>No discoveries yet.</p>
                <p className="text-sm">Combine elements to fill your book!</p>
              </div>
            ) : (
              history.map((item, idx) => (
                <div key={idx} className="bg-gray-900/50 p-3 rounded-xl border border-gray-700 flex items-center gap-4">
                  <span className="text-3xl">{item.result.emoji}</span>
                  <div className="flex-1">
                    <div className="font-bold text-gray-100">{item.result.name}</div>
                    <div className="text-xs text-gray-500">
                      Created by {item.ingredients[0]} + {item.ingredients[1]}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default HistoryDrawer;
