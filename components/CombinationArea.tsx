import React from 'react';
import { ElementItem } from '../types';
import { GROUP_INFO } from '../constants';

interface CombinationAreaProps {
  slot1: ElementItem | null;
  slot2: ElementItem | null;
  result: ElementItem | null;
  onClearSlot: (slot: 1 | 2) => void;
  isProcessing: boolean;
  showFailed: boolean;
}

const CombinationArea: React.FC<CombinationAreaProps> = ({
  slot1, slot2, result, onClearSlot, isProcessing, showFailed,
}) => {
  const slot1Color = slot1?.group ? (GROUP_INFO[slot1.group]?.color || 'var(--gold)') : 'var(--gold)';
  const slot2Color = slot2?.group ? (GROUP_INFO[slot2.group]?.color || 'var(--violet)') : 'var(--violet)';
  const bothFilled = slot1 && slot2;

  return (
    <div className="combo-zone">
      {/* Label */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        marginBottom: '10px', gap: '8px',
      }}>
        <div style={{
          height: '1px', flex: 1,
          background: 'linear-gradient(90deg, transparent, var(--border))',
        }} />
        <span style={{
          fontFamily: 'Cinzel, serif', fontSize: '9.5px',
          letterSpacing: '0.18em', color: 'var(--text-d)',
          textTransform: 'uppercase',
        }}>
          Combination Chamber
        </span>
        <div style={{
          height: '1px', flex: 1,
          background: 'linear-gradient(90deg, var(--border), transparent)',
        }} />
      </div>

      {/* Slots row */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '6px',
        justifyContent: 'center',
      }}>

        {/* ─── SLOT 1 ─── */}
        <div
          className={`slot-card${slot1 ? ' filled-1' : ''}`}
          onClick={slot1 ? () => onClearSlot(1) : undefined}
          style={slot1 ? {
            borderColor: slot1Color,
            boxShadow: `0 0 14px ${slot1Color}55, inset 0 0 12px rgba(0,0,0,0.4)`,
            background: `${slot1Color}18`,
          } : {}}
        >
          <span className="slot-label" style={{ color: slot1 ? slot1Color : 'var(--text-d)' }}>
            Element I
          </span>
          {slot1 ? (
            <>
              <div className="slot-emoji">{slot1.emoji}</div>
              <div className="slot-name" style={{ color: 'var(--text)' }}>{slot1.name}</div>
              <div className="slot-hint">tap to clear</div>
            </>
          ) : (
            <>
              <div className="slot-placeholder">?</div>
              <div className="slot-placeholder-text">tap an element below</div>
            </>
          )}
        </div>

        {/* ─── PLUS ─── */}
        <div className="combo-sep" style={{ opacity: bothFilled ? 1 : 0.3 }}>
          <span style={{ fontSize: '20px', fontWeight: 700 }}>+</span>
        </div>

        {/* ─── SLOT 2 ─── */}
        <div
          className={`slot-card${slot2 ? ' filled-2' : ''}`}
          onClick={slot2 ? () => onClearSlot(2) : undefined}
          style={slot2 ? {
            borderColor: slot2Color,
            boxShadow: `0 0 14px ${slot2Color}55, inset 0 0 12px rgba(0,0,0,0.4)`,
            background: `${slot2Color}18`,
          } : {}}
        >
          <span className="slot-label" style={{ color: slot2 ? slot2Color : 'var(--text-d)' }}>
            Element II
          </span>
          {slot2 ? (
            <>
              <div className="slot-emoji">{slot2.emoji}</div>
              <div className="slot-name" style={{ color: 'var(--text)' }}>{slot2.name}</div>
              <div className="slot-hint">tap to clear</div>
            </>
          ) : (
            <>
              <div className="slot-placeholder">?</div>
              <div className="slot-placeholder-text">
                {slot1 ? 'now pick second' : 'pick element first'}
              </div>
            </>
          )}
        </div>

        {/* ─── ARROW ─── */}
        <div className="combo-sep" style={{ opacity: bothFilled ? 1 : 0.25 }}>
          <span style={{ fontSize: '16px' }}>→</span>
        </div>

        {/* ─── RESULT ─── */}
        {isProcessing ? (
          <div className="result-card processing">
            <div style={{ position: 'relative', width: '44px', height: '44px', marginBottom: '6px' }}>
              <div className="anim-spin" style={{
                position: 'absolute', inset: 0,
                border: '2px solid rgba(155,93,229,0.3)',
                borderTopColor: 'var(--violet)',
                borderRadius: '50%',
              }} />
              <div className="anim-spinrev" style={{
                position: 'absolute', inset: '8px',
                border: '1px solid rgba(232,169,48,0.25)',
                borderBottomColor: 'var(--gold)',
                borderRadius: '50%',
              }} />
              <div style={{
                position: 'absolute', inset: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '18px',
              }}>⚗️</div>
            </div>
            <span style={{ fontFamily: 'Cinzel, serif', fontSize: '9px', letterSpacing: '0.18em', color: 'var(--violet)' }}>
              MIXING...
            </span>
          </div>
        ) : showFailed ? (
          <div className="result-card anim-shake" style={{
            border: '2px solid var(--border-b)',
            background: 'rgba(255,255,255,0.04)',
          }}>
            <div style={{ fontSize: '28px', marginBottom: '5px', opacity: 0.7 }}>💨</div>
            <div style={{ fontFamily: 'Nunito, sans-serif', fontSize: '11px', fontWeight: 700, color: 'var(--text-m)', textAlign: 'center', padding: '0 6px' }}>
              No reaction
            </div>
          </div>
        ) : result ? (
          <div className="result-card has-result anim-bloom">
            <span className="slot-label" style={{ color: 'var(--teal)' }}>Result</span>
            <div className="slot-emoji">{result.emoji}</div>
            <div className="slot-name" style={{ color: 'var(--teal)' }}>{result.name}</div>
            <div style={{ marginTop: '3px', fontFamily: 'Nunito, sans-serif', fontSize: '9px', fontWeight: 800, color: 'var(--teal)', letterSpacing: '0.1em' }}>
              ✦ FOUND
            </div>
          </div>
        ) : (
          <div className="result-card">
            <span className="slot-label" style={{ color: 'var(--text-d)' }}>Result</span>
            <div className="slot-placeholder">✦</div>
            <div className="slot-placeholder-text">
              {bothFilled ? 'combining...' : 'awaiting mix'}
            </div>
          </div>
        )}
      </div>

      {/* Instruction hint */}
      <div style={{
        textAlign: 'center', marginTop: '8px',
        fontFamily: 'Nunito, sans-serif', fontSize: '11px',
        color: 'var(--text-d)', fontWeight: 600,
        minHeight: '16px',
      }}>
        {!slot1 && !slot2 && 'Tap any element below to add it to slot I'}
        {slot1 && !slot2 && `${slot1.emoji} ${slot1.name} selected — now pick Element II`}
        {slot1 && slot2 && !result && !isProcessing && !showFailed && `Combining ${slot1.name} + ${slot2.name}...`}
      </div>
    </div>
  );
};

export default CombinationArea;
