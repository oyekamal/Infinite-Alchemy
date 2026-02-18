import React from 'react';
import { ElementItem } from '../types';

interface CombinationAreaProps {
  slot1: ElementItem | null;
  slot2: ElementItem | null;
  result: ElementItem | null;
  onClearSlot: (slot: 1 | 2) => void;
  isProcessing: boolean;
  showFailed: boolean;
}

const CombinationArea: React.FC<CombinationAreaProps> = ({
  slot1,
  slot2,
  result,
  onClearSlot,
  isProcessing,
  showFailed,
}) => {
  return (
    <div className="w-full bg-gray-900/30 border border-gray-800/50 rounded-2xl p-8">
      <div className="flex items-center justify-center gap-6 max-w-4xl mx-auto">
        {/* Left Slot */}
        <div className="flex-1 max-w-[200px]">
          {slot1 ? (
            <button
              onClick={() => onClearSlot(1)}
              className="w-full bg-gradient-to-br from-indigo-600/20 to-purple-600/20 border-2 border-indigo-500 rounded-2xl p-6 hover:scale-105 active:scale-95 transition-all shadow-lg shadow-indigo-500/30"
            >
              <div className="text-5xl mb-2">{slot1.emoji}</div>
              <div className="text-sm font-bold text-white">{slot1.name}</div>
              <div className="text-xs text-gray-400 mt-1">Tap to clear</div>
            </button>
          ) : (
            <div className="w-full border-2 border-dashed border-gray-700 rounded-2xl p-6 flex flex-col items-center justify-center h-[140px]">
              <div className="text-3xl text-gray-700 mb-2">?</div>
              <div className="text-xs text-gray-600 font-medium">Select from above</div>
            </div>
          )}
        </div>

        {/* Plus Sign */}
        <div className="text-4xl text-gray-600">
          <i className="fa-solid fa-plus"></i>
        </div>

        {/* Right Slot */}
        <div className="flex-1 max-w-[200px]">
          {slot2 ? (
            <button
              onClick={() => onClearSlot(2)}
              className="w-full bg-gradient-to-br from-purple-600/20 to-pink-600/20 border-2 border-purple-500 rounded-2xl p-6 hover:scale-105 active:scale-95 transition-all shadow-lg shadow-purple-500/30"
            >
              <div className="text-5xl mb-2">{slot2.emoji}</div>
              <div className="text-sm font-bold text-white">{slot2.name}</div>
              <div className="text-xs text-gray-400 mt-1">Tap to clear</div>
            </button>
          ) : (
            <div className="w-full border-2 border-dashed border-gray-700 rounded-2xl p-6 flex flex-col items-center justify-center h-[140px]">
              <div className="text-3xl text-gray-700 mb-2">?</div>
              <div className="text-xs text-gray-600 font-medium">Select from above</div>
            </div>
          )}
        </div>

        {/* Arrow */}
        <div className="text-3xl text-gray-600">
          <i className="fa-solid fa-arrow-right"></i>
        </div>

        {/* Result Area */}
        <div className="flex-1 max-w-[200px]">
          {isProcessing ? (
            <div className="w-full bg-gray-800/50 border-2 border-gray-700 rounded-2xl p-6 flex flex-col items-center justify-center h-[140px]">
              <i className="fa-solid fa-circle-notch fa-spin text-3xl text-indigo-400 mb-2"></i>
              <div className="text-xs text-gray-500">Processing...</div>
            </div>
          ) : showFailed ? (
            <div className="w-full bg-red-900/20 border-2 border-red-700 rounded-2xl p-6 flex flex-col items-center justify-center h-[140px] animate-shake">
              <i className="fa-solid fa-xmark text-4xl text-red-500 mb-2"></i>
              <div className="text-xs text-red-400 font-medium">No combination</div>
            </div>
          ) : result ? (
            <div className="w-full bg-gradient-to-br from-green-600/20 to-emerald-600/20 border-2 border-green-500 rounded-2xl p-6 flex flex-col items-center justify-center h-[140px] animate-bloom shadow-lg shadow-green-500/50">
              <div className="text-5xl mb-2">{result.emoji}</div>
              <div className="text-sm font-bold text-white">{result.name}</div>
              <div className="text-xs text-green-400 mt-1">✨ Discovered!</div>
            </div>
          ) : (
            <div className="w-full border-2 border-dashed border-gray-700 rounded-2xl p-6 flex flex-col items-center justify-center h-[140px]">
              <div className="text-3xl text-gray-700 mb-2">?</div>
              <div className="text-xs text-gray-600 font-medium">Result appears here</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CombinationArea;
