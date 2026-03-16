import React from 'react';
import { ElementGroup, GameStage } from '../types';
import { GROUP_INFO } from '../constants';

interface GroupFilterProps {
  selectedGroup: ElementGroup | 'All';
  onSelectGroup: (group: ElementGroup | 'All') => void;
  groupCounts: Record<ElementGroup, number>;
  currentStage: GameStage;
}

const stageOrder: GameStage[] = ['Beginning', 'Technology', 'Modern Age', 'World of Magic'];

const GroupFilter: React.FC<GroupFilterProps> = ({
  selectedGroup, onSelectGroup, groupCounts, currentStage,
}) => {
  const currentIdx = stageOrder.indexOf(currentStage);
  const totalCount = (Object.values(groupCounts) as number[]).reduce((a, b) => a + b, 0);

  const availableGroups = (Object.keys(GROUP_INFO) as ElementGroup[]).filter(g => {
    if (g === 'Custom') return (groupCounts[g] || 0) > 0;
    return stageOrder.indexOf(GROUP_INFO[g].stage) <= currentIdx;
  });

  return (
    <div className="group-tabs">
      {/* All tab */}
      <button
        className={`g-tab${selectedGroup === 'All' ? ' active' : ''}`}
        onClick={() => onSelectGroup('All')}
      >
        <span>✦</span>
        <span>All</span>
        <span className="g-tab-count">{totalCount}</span>
      </button>

      {availableGroups.map(g => {
        const info = GROUP_INFO[g];
        const count = groupCounts[g] || 0;
        const isActive = selectedGroup === g;
        return (
          <button
            key={g}
            className={`g-tab${isActive ? ' active' : ''}`}
            onClick={() => onSelectGroup(g)}
            disabled={count === 0}
            style={{ opacity: count === 0 ? 0.35 : 1 }}
          >
            <span>{info.icon}</span>
            <span>{info.name}</span>
            {count > 0 && <span className="g-tab-count">{count}</span>}
          </button>
        );
      })}
    </div>
  );
};

export default GroupFilter;
