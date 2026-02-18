import React from 'react';
import { ElementGroup, GameStage } from '../types';
import { GROUP_INFO } from '../constants';

interface GroupFilterProps {
  selectedGroup: ElementGroup | 'All';
  onSelectGroup: (group: ElementGroup | 'All') => void;
  groupCounts: Record<ElementGroup, number>;
  currentStage: GameStage;
}

const GroupFilter: React.FC<GroupFilterProps> = ({ 
  selectedGroup, 
  onSelectGroup, 
  groupCounts,
  currentStage 
}) => {
  const allGroups = Object.keys(GROUP_INFO) as ElementGroup[];
  
  // Filter groups by current stage
  const availableGroups = allGroups.filter(group => {
    const info = GROUP_INFO[group];
    if (group === 'Custom') return true; // Always show custom
    
    // Show if group belongs to current or earlier stages
    const stageOrder: GameStage[] = ['Beginning', 'Technology', 'Modern Age', 'World of Magic'];
    const currentIndex = stageOrder.indexOf(currentStage);
    const groupIndex = stageOrder.indexOf(info.stage);
    return groupIndex <= currentIndex;
  });

  const totalCount = Object.values(groupCounts).reduce((a, b) => a + b, 0);

  return (
    <div className="flex flex-col gap-3">
      {/* All Elements Button */}
      <button
        onClick={() => onSelectGroup('All')}
        className={`
          group relative px-4 py-2.5 rounded-xl font-bold text-sm transition-all
          ${selectedGroup === 'All' 
            ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg scale-105' 
            : 'bg-gray-800/50 text-gray-400 hover:bg-gray-700/50 border border-gray-700'}
        `}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg">🌟</span>
            <span>All Elements</span>
          </div>
          <span className={`text-xs font-mono px-2 py-0.5 rounded-full ${
            selectedGroup === 'All' 
              ? 'bg-white/20' 
              : 'bg-gray-700'
          }`}>
            {totalCount}
          </span>
        </div>
      </button>

      {/* Group Scroll Area */}
      <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900">
        {availableGroups.map((group) => {
          const info = GROUP_INFO[group];
          const count = groupCounts[group] || 0;
          const isSelected = selectedGroup === group;
          const hasElements = count > 0;

          return (
            <button
              key={group}
              onClick={() => onSelectGroup(group)}
              disabled={!hasElements && group !== 'Custom'}
              className={`
                relative px-3 py-1.5 rounded-lg text-xs font-bold transition-all
                ${isSelected
                  ? 'ring-2 ring-offset-2 ring-offset-gray-900 scale-105 shadow-lg'
                  : hasElements
                  ? 'hover:scale-105 opacity-90 hover:opacity-100'
                  : 'opacity-40 cursor-not-allowed'}
              `}
              style={{
                backgroundColor: isSelected ? info.color : `${info.color}40`,
                color: isSelected ? '#000' : '#fff',
                ringColor: isSelected ? info.color : undefined,
              }}
              title={info.description}
            >
              <div className="flex items-center gap-1.5">
                <span className="text-base">{info.icon}</span>
                <span className="whitespace-nowrap">{info.name}</span>
                {count > 0 && (
                  <span className={`ml-1 px-1.5 py-0.5 rounded-full text-[10px] font-mono ${
                    isSelected ? 'bg-black/20' : 'bg-white/20'
                  }`}>
                    {count}
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Stage Indicator */}
      <div className="text-[10px] text-gray-500 font-mono uppercase tracking-wider text-center py-1 bg-gray-900/50 rounded-lg">
        Stage: {currentStage}
      </div>
    </div>
  );
};

export default GroupFilter;
