import React from 'react';
import { ElementItem, ElementGroup } from '../types';

interface ElementStripProps {
  elements: ElementItem[];
  onSelect: (element: ElementItem) => void;
  selectedElement: ElementItem | null;
  compatibleNames: string[];
  groupProgress: Record<ElementGroup, { current: number; total: number }>;
}

const GROUP_COLORS: Record<string, string> = {
  'Basic': '#6b7280',
  'Fire': '#ef4444',
  'Water': '#3b82f6',
  'Liquids': '#3b82f6',
  'Earth': '#22c55e',
  'Air': '#fbbf24',
  'Energy': '#a855f7',
  'Life': '#10b981',
  'Plants': '#22c55e',
  'Animals': '#f59e0b',
  'Invertebrates': '#9333ea',
  'Technology': '#06b6d4',
  'Magic': '#8b5cf6',
  'Custom': '#6366f1',
};

// Get color for any group (with fallback)
const getGroupColor = (group: string): string => {
  return GROUP_COLORS[group] || '#6b7280';
};

const ElementStrip: React.FC<ElementStripProps> = ({
  elements,
  onSelect,
  selectedElement,
  compatibleNames,
  groupProgress,
}) => {
  // Group elements by their group
  const groupedElements: Record<string, ElementItem[]> = {};
  elements.forEach(el => {
    const group = el.group || 'Custom';
    if (!groupedElements[group]) {
      groupedElements[group] = [];
    }
    groupedElements[group].push(el);
  });

  // Get all groups that actually exist in the data
  const allGroups = Object.keys(groupedElements);
  
  // Preferred order (groups will appear in this order if they exist, others will follow)
  const preferredOrder = ['Basic', 'Fire', 'Liquids', 'Water', 'Earth', 'Air', 'Energy', 'Life', 'Plants', 'Animals', 'Invertebrates', 'Technology', 'Magic', 'Custom'];
  
  // Sort: preferred groups first (in order), then alphabetically for others
  const sortedGroups = allGroups.sort((a, b) => {
    const aIndex = preferredOrder.indexOf(a);
    const bIndex = preferredOrder.indexOf(b);
    
    if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
    if (aIndex !== -1) return -1;
    if (bIndex !== -1) return 1;
    return a.localeCompare(b);
  });

  return (
    <div className="w-full bg-gray-900/50 border-b border-gray-800 overflow-x-auto overflow-y-hidden">
      <div className="flex items-stretch min-w-max p-4 gap-2">
        {sortedGroups.map((group) => {
          const groupElements = groupedElements[group];
          const color = getGroupColor(group);
          const progress = groupProgress[group as ElementGroup];
          const progressPercent = progress ? (progress.current / progress.total) * 100 : 0;

          return (
            <div key={group} className="flex items-stretch gap-2">
              {/* Group Divider with Progress */}
              <div className="flex flex-col items-center justify-center px-2">
                <div className="writing-mode-vertical text-xs font-bold tracking-wider uppercase opacity-60 mb-2" style={{ color }}>
                  {group}
                </div>
                <div className="w-1 flex-1 bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className="w-full transition-all duration-500"
                    style={{
                      height: `${progressPercent}%`,
                      backgroundColor: color,
                    }}
                  />
                </div>
                <div className="text-[10px] text-gray-600 mt-2">
                  {progress?.current || 0}/{progress?.total || 0}
                </div>
              </div>

              {/* Elements in this group */}
              <div className="flex gap-2">
                {groupElements.map((el) => {
                  const isSelected = selectedElement?.name === el.name;
                  const isCompatible = compatibleNames.includes(el.name);
                  const isDimmed = selectedElement && !isCompatible && !isSelected;

                  return (
                    <button
                      key={el.name}
                      onClick={() => onSelect(el)}
                      className={`
                        relative flex flex-col items-center justify-center px-4 py-3 rounded-xl
                        transition-all duration-200 hover:scale-105 active:scale-95
                        ${isSelected 
                          ? 'bg-gradient-to-br from-indigo-600 to-purple-600 shadow-lg shadow-indigo-500/50 ring-2 ring-white/50' 
                          : isCompatible
                          ? 'bg-gray-700 ring-2 ring-green-500/50 shadow-lg shadow-green-500/20'
                          : 'bg-gray-800 hover:bg-gray-700'
                        }
                        ${isDimmed ? 'opacity-30' : 'opacity-100'}
                      `}
                      style={{
                        borderLeft: `3px solid ${color}`,
                      }}
                    >
                      <span className="text-3xl mb-1">{el.emoji}</span>
                      <span className="text-xs font-medium whitespace-nowrap">{el.name}</span>
                      {el.isCustom && (
                        <span className="absolute -top-1 -right-1 text-[10px] bg-indigo-600 rounded-full px-1.5 py-0.5">
                          ✨
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ElementStrip;
