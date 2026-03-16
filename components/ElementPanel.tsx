import React, { useMemo } from 'react';
import { ElementItem, ElementGroup, GameStage } from '../types';
import { GROUP_INFO } from '../constants';

interface ElementPanelProps {
  side: 'left' | 'right';
  selectedGroup: ElementGroup | 'All';
  onGroupChange: (g: ElementGroup | 'All') => void;
  unlocked: ElementItem[];
  activeSlot: ElementItem | null;
  newlyUnlocked: string[];
  groupCounts: Record<ElementGroup, number>;
  currentStage: GameStage;
  onSelect: (el: ElementItem) => void;
}

const stageOrder: GameStage[] = ['Beginning', 'Technology', 'Modern Age', 'World of Magic'];

function hexToRgba(hex: string, alpha: number): string {
  const h = hex.replace('#', '');
  const r = parseInt(h.substring(0, 2), 16);
  const g = parseInt(h.substring(2, 4), 16);
  const b = parseInt(h.substring(4, 6), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

const SLOT_COLORS = {
  left:  { main: '#9956DE', light: '#C49AEF', dark: '#6B2FAF', label: 'Element I',  num: '1' },
  right: { main: '#FF9A2E', light: '#FFD09E', dark: '#C06010', label: 'Element II', num: '2' },
};

const ElementPanel: React.FC<ElementPanelProps> = ({
  side, selectedGroup, onGroupChange,
  unlocked, activeSlot, newlyUnlocked,
  groupCounts, currentStage, onSelect,
}) => {
  const colors = SLOT_COLORS[side];
  const currentIdx = stageOrder.indexOf(currentStage);
  const totalCount = (Object.values(groupCounts) as number[]).reduce((a, b) => a + b, 0);

  const availableGroups = useMemo(() =>
    (Object.keys(GROUP_INFO) as ElementGroup[]).filter(g => {
      if (g === 'Custom') return (groupCounts[g] || 0) > 0;
      return stageOrder.indexOf(GROUP_INFO[g].stage) <= currentIdx;
    }),
    [groupCounts, currentIdx]
  );

  const displayElements = useMemo(() => {
    let list = [...unlocked];
    if (selectedGroup !== 'All') {
      list = list.filter(e => (e.group || 'Custom') === selectedGroup);
    }
    return list.sort((a, b) => {
      const aNew = newlyUnlocked.includes(a.name);
      const bNew = newlyUnlocked.includes(b.name);
      if (aNew && !bNew) return -1;
      if (!aNew && bNew) return 1;
      return a.name.localeCompare(b.name);
    });
  }, [unlocked, selectedGroup, newlyUnlocked]);

  return (
    <div className={`el-panel ${side}-panel`}>
      {/* Slot indicator header */}
      <div className="panel-header" style={{ borderBottom: `2px solid ${colors.main}` }}>
        <div className="panel-slot-num" style={{ background: colors.main }}>
          {colors.num}
        </div>
        <div className="panel-slot-info">
          <span className="panel-slot-label" style={{ color: colors.dark }}>
            {colors.label}
          </span>
          {activeSlot ? (
            <span className="panel-slot-active" style={{ color: colors.main }}>
              {activeSlot.emoji} {activeSlot.name}
            </span>
          ) : (
            <span className="panel-slot-hint">tap to select</span>
          )}
        </div>
      </div>

      {/* Group tabs */}
      <div className="panel-group-tabs">
        <button
          className={`panel-g-tab${selectedGroup === 'All' ? ' active' : ''}`}
          onClick={() => onGroupChange('All')}
          style={selectedGroup === 'All' ? {
            borderColor: colors.main,
            color: colors.dark,
            background: hexToRgba(colors.main, 0.08),
          } : {}}
        >
          ✦ All
          <span className="panel-g-count">{totalCount}</span>
        </button>

        {availableGroups.map(g => {
          const info = GROUP_INFO[g];
          const count = groupCounts[g] || 0;
          const isActive = selectedGroup === g;
          return (
            <button
              key={g}
              className={`panel-g-tab${isActive ? ' active' : ''}`}
              onClick={() => onGroupChange(g)}
              disabled={count === 0}
              style={isActive ? {
                borderColor: colors.main,
                color: colors.dark,
                background: hexToRgba(colors.main, 0.08),
              } : { opacity: count === 0 ? 0.38 : 1 }}
            >
              {info.icon} {info.name}
              {count > 0 && <span className="panel-g-count">{count}</span>}
            </button>
          );
        })}
      </div>

      {/* Element grid */}
      <div className="panel-grid-wrap">
        {displayElements.length === 0 ? (
          <div className="panel-empty">
            <span style={{ fontSize: '34px', opacity: 0.15 }}>🔮</span>
            <span style={{ fontFamily: 'Nunito, sans-serif', fontSize: '13px', fontWeight: 700, color: 'var(--text-m)' }}>
              Nothing here yet
            </span>
            <span style={{ fontSize: '11px', color: 'var(--text-d)', textAlign: 'center' }}>
              Explore different groups or discover more elements
            </span>
          </div>
        ) : (
          <div className="panel-grid">
            {displayElements.map(el => {
              const groupColor = el.group ? (GROUP_INFO[el.group]?.color || '#888888') : '#888888';
              const isSelected = activeSlot?.name === el.name;
              const isNew = newlyUnlocked.includes(el.name);

              return (
                <div
                  key={el.name}
                  className={`panel-el-card${isSelected ? ' selected' : ''}${isNew && !isSelected ? ' is-new' : ''}`}
                  onClick={() => onSelect(el)}
                  style={isSelected ? {
                    borderColor: colors.main,
                    background: hexToRgba(colors.main, 0.10),
                    boxShadow: `0 0 0 2px ${hexToRgba(colors.main, 0.3)}, 0 2px 8px ${hexToRgba(colors.main, 0.2)}`,
                  } : isNew ? {
                    borderColor: '#4E8E6A',
                    background: hexToRgba(groupColor, 0.08),
                  } : {
                    borderColor: hexToRgba(groupColor, 0.3),
                    background: hexToRgba(groupColor, 0.06),
                  }}
                >
                  {isNew && !isSelected && (
                    <span className="panel-new-badge">new</span>
                  )}
                  {isSelected && (
                    <span className="panel-sel-badge" style={{ background: colors.main }}>
                      {colors.num}
                    </span>
                  )}
                  <div className="panel-el-emoji">{el.emoji}</div>
                  <div className="panel-el-name">{el.name}</div>
                  <div className="panel-el-bar" style={{ background: hexToRgba(groupColor, 0.65) }} />
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ElementPanel;
