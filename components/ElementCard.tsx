import React from 'react';
import { ElementItem } from '../types';
import { GROUP_INFO } from '../constants';

interface ElementCardProps {
  element: ElementItem;
  isSelected?: boolean;
  selectionIndex?: 1 | 2;
  onClick?: () => void;
  className?: string;
  isNew?: boolean;
}

// Parse a hex color to rgba string
function hexToRgba(hex: string, alpha: number): string {
  const h = hex.replace('#', '');
  const r = parseInt(h.substring(0, 2), 16);
  const g = parseInt(h.substring(2, 4), 16);
  const b = parseInt(h.substring(4, 6), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

const ElementCard: React.FC<ElementCardProps> = ({
  element, isSelected, selectionIndex, onClick, className = '', isNew,
}) => {
  const groupColor = element.group ? (GROUP_INFO[element.group]?.color || '#5A5068') : '#5A5068';

  // Build tile styles based on state
  let extraStyle: React.CSSProperties = {};
  let extraClass = '';

  if (isSelected && selectionIndex === 1) {
    extraStyle = {
      background: `rgba(232,169,48,0.18)`,
      borderColor: 'var(--gold)',
    };
    extraClass = ' sel-1';
  } else if (isSelected && selectionIndex === 2) {
    extraStyle = {
      background: `rgba(155,93,229,0.18)`,
      borderColor: 'var(--violet)',
    };
    extraClass = ' sel-2';
  } else if (isNew) {
    extraStyle = {
      background: hexToRgba(groupColor, 0.18),
      borderColor: 'var(--teal)',
    };
    extraClass = ' is-new';
  } else {
    // Normal state: tint with group color for visual variety
    extraStyle = {
      background: hexToRgba(groupColor, 0.10),
      borderColor: hexToRgba(groupColor, 0.28),
    };
  }

  return (
    <div
      className={`el-tile${extraClass}${className ? ' ' + className : ''}`}
      style={extraStyle}
      onClick={onClick}
      title={element.name}
    >
      {isNew && !isSelected && (
        <span className="new-badge">✦ new</span>
      )}
      {isSelected && (
        <span
          className="sel-badge"
          style={{
            color: selectionIndex === 1 ? 'var(--gold-b)' : '#c090ff',
            background: selectionIndex === 1 ? 'rgba(232,169,48,0.18)' : 'rgba(155,93,229,0.18)',
          }}
        >
          {selectionIndex}
        </span>
      )}

      <div className="el-emoji">{element.emoji}</div>
      <div className="el-name">{element.name}</div>

      {/* Group color bar at bottom */}
      <div
        className="group-bar"
        style={{ background: hexToRgba(groupColor, 0.75) }}
      />
    </div>
  );
};

export default ElementCard;
