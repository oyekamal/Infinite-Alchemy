import React from 'react';
import { ElementItem, ElementGroup } from '../types';
import { GROUP_INFO } from '../constants';
import ElementCard from './ElementCard';

interface ElementStripProps {
  elements: ElementItem[];
  onSelect: (element: ElementItem) => void;
  slot1: ElementItem | null;
  slot2: ElementItem | null;
  newlyUnlocked: string[];
  selectedGroup: ElementGroup | 'All';
  // legacy compat
  selectedElement?: ElementItem | null;
  compatibleNames?: string[];
  groupProgress?: any;
}

const SectionHeader: React.FC<{ color: string; icon: string; label: string; count: number }> = ({
  color, icon, label, count,
}) => (
  <div className="group-section-header">
    <span style={{ color, fontSize: '15px' }}>{icon}</span>
    <span style={{ color, fontWeight: 700 }}>{label}</span>
    <span style={{ fontSize: '10px', color: 'var(--text-d)', fontWeight: 600 }}>{count}</span>
    <div className="bar" style={{ background: `linear-gradient(90deg, ${color}50, transparent)` }} />
  </div>
);

const ElementStrip: React.FC<ElementStripProps> = ({
  elements, onSelect, slot1, slot2, newlyUnlocked, selectedGroup,
}) => {
  if (elements.length === 0) {
    return (
      <div className="element-grid-wrap">
        <div className="element-grid">
          <div className="empty-state">
            <span style={{ fontSize: '38px', opacity: 0.15 }}>🔮</span>
            <span style={{ fontFamily: 'Nunito, sans-serif', fontSize: '14px', fontWeight: 700, color: 'var(--text-m)' }}>
              Nothing found
            </span>
            <span style={{ fontSize: '12px', color: 'var(--text-d)' }}>
              Try a different group or clear your search
            </span>
          </div>
        </div>
      </div>
    );
  }

  // Helper: determine if an element is selected
  const selectionIndex = (el: ElementItem): 1 | 2 | undefined =>
    slot1?.name === el.name ? 1 : slot2?.name === el.name ? 2 : undefined;

  const renderCard = (el: ElementItem) => (
    <ElementCard
      key={el.name}
      element={el}
      isSelected={slot1?.name === el.name || slot2?.name === el.name}
      selectionIndex={selectionIndex(el)}
      isNew={newlyUnlocked.includes(el.name)}
      onClick={() => onSelect(el)}
    />
  );

  // ── Single group view ────────────────────────────────────────────────────
  if (selectedGroup !== 'All') {
    // Sort: newly unlocked first, then alphabetical
    const sorted = [...elements].sort((a, b) => {
      const aNew = newlyUnlocked.includes(a.name);
      const bNew = newlyUnlocked.includes(b.name);
      if (aNew && !bNew) return -1;
      if (!aNew && bNew) return 1;
      return a.name.localeCompare(b.name);
    });

    const info = GROUP_INFO[selectedGroup];
    return (
      <div className="element-grid-wrap">
        <div className="element-grid">
          {info && (
            <SectionHeader
              color={info.color}
              icon={info.icon}
              label={info.name}
              count={sorted.length}
            />
          )}
          {sorted.map(renderCard)}
        </div>
      </div>
    );
  }

  // ── All elements view ────────────────────────────────────────────────────
  // 1. If there are newly unlocked elements, show them first in a "Recent" section
  const recentEls = elements.filter(el => newlyUnlocked.includes(el.name));

  // 2. Group remaining elements by their group
  const grouped: Record<string, ElementItem[]> = {};
  elements.forEach(el => {
    const g = el.group || 'Custom';
    if (!grouped[g]) grouped[g] = [];
    grouped[g].push(el);
  });

  const groupOrder = Object.keys(GROUP_INFO) as ElementGroup[];
  const sortedGroups = groupOrder.filter(g => grouped[g]?.length > 0);

  return (
    <div className="element-grid-wrap">
      <div className="element-grid">
        {/* Recent discoveries section */}
        {recentEls.length > 0 && (
          <>
            <SectionHeader
              color="var(--teal)"
              icon="✦"
              label="Recently Discovered"
              count={recentEls.length}
            />
            {recentEls.map(renderCard)}
          </>
        )}

        {/* Elements by group */}
        {sortedGroups.map(group => {
          const info = GROUP_INFO[group];
          const els = grouped[group];
          return (
            <React.Fragment key={group}>
              <SectionHeader
                color={info.color}
                icon={info.icon}
                label={info.name}
                count={els.length}
              />
              {[...els]
                .sort((a, b) => a.name.localeCompare(b.name))
                .map(renderCard)}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default ElementStrip;
