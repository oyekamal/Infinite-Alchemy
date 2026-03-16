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

const SKY   = { main: '#9956DE', light: '#C49AEF', dark: '#6B2FAF' };
const ROSE  = { main: '#FF9A2E', light: '#FFD09E', dark: '#C06010' };
const SAGE  = { main: '#5BC94E', light: '#A8E89E', dark: '#2E8A24' };

const CombinationArea: React.FC<CombinationAreaProps> = ({
  slot1, slot2, result, onClearSlot, isProcessing, showFailed,
}) => {
  const slot1Color = slot1?.group ? (GROUP_INFO[slot1.group]?.color || SKY.main) : SKY.main;
  const slot2Color = slot2?.group ? (GROUP_INFO[slot2.group]?.color || ROSE.main) : ROSE.main;
  const bothFilled = slot1 && slot2;

  return (
    <div className="combo-center">
      {/* Title */}
      <div style={{
        fontFamily: 'Cinzel, serif',
        fontSize: '9px',
        letterSpacing: '0.18em',
        textTransform: 'uppercase',
        color: 'var(--text-d)',
        textAlign: 'center',
        marginBottom: '4px',
      }}>
        Combine
      </div>

      {/* Slot 1 */}
      <div
        className={`v-slot-card${slot1 ? ' filled' : ''}`}
        onClick={slot1 ? () => onClearSlot(1) : undefined}
        style={slot1 ? {
          borderColor: SKY.main,
          background: `rgba(153,86,222,0.08)`,
          boxShadow: `0 0 0 2.5px rgba(153,86,222,0.25), 0 3px 14px rgba(153,86,222,0.15)`,
        } : {}}
      >
        <span className="v-slot-label" style={{ color: slot1 ? SKY.dark : 'var(--text-d)' }}>
          Element I
        </span>
        {slot1 ? (
          <>
            <div style={{ fontSize: '26px', lineHeight: 1, marginBottom: '3px' }}>{slot1.emoji}</div>
            <div style={{ fontFamily: 'Nunito, sans-serif', fontSize: '11px', fontWeight: 700, textAlign: 'center', color: 'var(--text)', lineHeight: 1.2 }}>
              {slot1.name}
            </div>
            <div style={{ fontSize: '9px', color: SKY.main, marginTop: '2px', fontWeight: 600 }}>tap to clear</div>
          </>
        ) : (
          <>
            <div style={{ fontSize: '20px', opacity: 0.12 }}>?</div>
            <div style={{ fontSize: '10px', color: 'var(--text-d)', textAlign: 'center', padding: '0 6px', lineHeight: 1.3, fontWeight: 600 }}>
              pick from left
            </div>
          </>
        )}
      </div>

      {/* Plus */}
      <div className="v-sep" style={{ opacity: bothFilled ? 0.8 : 0.25 }}>
        <span style={{ fontSize: '16px', color: 'var(--text-d)', fontWeight: 700 }}>+</span>
      </div>

      {/* Slot 2 */}
      <div
        className={`v-slot-card${slot2 ? ' filled' : ''}`}
        onClick={slot2 ? () => onClearSlot(2) : undefined}
        style={slot2 ? {
          borderColor: ROSE.main,
          background: `rgba(255,154,46,0.08)`,
          boxShadow: `0 0 0 2.5px rgba(255,154,46,0.25), 0 3px 14px rgba(255,154,46,0.15)`,
        } : {}}
      >
        <span className="v-slot-label" style={{ color: slot2 ? ROSE.dark : 'var(--text-d)' }}>
          Element II
        </span>
        {slot2 ? (
          <>
            <div style={{ fontSize: '26px', lineHeight: 1, marginBottom: '3px' }}>{slot2.emoji}</div>
            <div style={{ fontFamily: 'Nunito, sans-serif', fontSize: '11px', fontWeight: 700, textAlign: 'center', color: 'var(--text)', lineHeight: 1.2 }}>
              {slot2.name}
            </div>
            <div style={{ fontSize: '9px', color: ROSE.main, marginTop: '2px', fontWeight: 600 }}>tap to clear</div>
          </>
        ) : (
          <>
            <div style={{ fontSize: '20px', opacity: 0.12 }}>?</div>
            <div style={{ fontSize: '10px', color: 'var(--text-d)', textAlign: 'center', padding: '0 6px', lineHeight: 1.3, fontWeight: 600 }}>
              {slot1 ? 'pick from right' : 'pick from right'}
            </div>
          </>
        )}
      </div>

      {/* Arrow */}
      <div className="v-sep" style={{ opacity: bothFilled ? 0.7 : 0.2 }}>
        <span style={{ fontSize: '14px', color: 'var(--text-d)' }}>↓</span>
      </div>

      {/* Result */}
      {isProcessing ? (
        <div className="v-result-card" style={{ borderColor: 'rgba(78,142,106,0.5)', background: 'rgba(78,142,106,0.06)' }}>
          <div style={{ position: 'relative', width: '40px', height: '40px', marginBottom: '5px' }}>
            <div className="anim-spin" style={{
              position: 'absolute', inset: 0,
              border: '2px solid rgba(78,142,106,0.2)',
              borderTopColor: SAGE.main,
              borderRadius: '50%',
            }} />
            <div className="anim-spinrev" style={{
              position: 'absolute', inset: '8px',
              border: '1px solid rgba(74,127,193,0.2)',
              borderBottomColor: SKY.main,
              borderRadius: '50%',
            }} />
            <div style={{
              position: 'absolute', inset: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '16px',
            }}>⚗️</div>
          </div>
          <span style={{ fontFamily: 'Cinzel, serif', fontSize: '8px', letterSpacing: '0.18em', color: SAGE.dark }}>
            MIXING...
          </span>
        </div>
      ) : showFailed ? (
        <div className="v-result-card anim-shake" style={{
          borderColor: 'rgba(194,98,79,0.4)',
          background: 'rgba(194,98,79,0.06)',
        }}>
          <div style={{ fontSize: '24px', marginBottom: '4px', opacity: 0.5 }}>💨</div>
          <div style={{ fontFamily: 'Nunito, sans-serif', fontSize: '10px', fontWeight: 700, color: 'var(--text-m)', textAlign: 'center' }}>
            No reaction
          </div>
        </div>
      ) : result ? (
        <div className="v-result-card anim-bloom" style={{
          borderColor: SAGE.main,
          background: `rgba(91,201,78,0.08)`,
          boxShadow: `0 0 0 2.5px rgba(91,201,78,0.3), 0 4px 16px rgba(91,201,78,0.2)`,
        }}>
          <span className="v-slot-label" style={{ color: SAGE.dark }}>Result</span>
          <div style={{ fontSize: '28px', lineHeight: 1, marginBottom: '4px' }}>{result.emoji}</div>
          <div style={{ fontFamily: 'Nunito, sans-serif', fontSize: '11px', fontWeight: 700, color: SAGE.dark, textAlign: 'center' }}>
            {result.name}
          </div>
          <div style={{ fontSize: '9px', fontWeight: 800, color: SAGE.main, letterSpacing: '0.08em', marginTop: '2px' }}>
            ✦ FOUND
          </div>
        </div>
      ) : (
        <div className="v-result-card">
          <span className="v-slot-label" style={{ color: 'var(--text-d)' }}>Result</span>
          <div style={{ fontSize: '20px', opacity: 0.1 }}>✦</div>
          <div style={{ fontSize: '10px', color: 'var(--text-d)', textAlign: 'center', padding: '0 6px', lineHeight: 1.3, fontWeight: 600 }}>
            awaiting mix
          </div>
        </div>
      )}

      {/* Divider + stats */}
      <div style={{
        width: '100%',
        borderTop: '1px solid var(--border)',
        marginTop: '8px',
        paddingTop: '10px',
        display: 'flex',
        flexDirection: 'column',
        gap: '4px',
        alignItems: 'center',
      }}>
        {/* Hint text */}
        <div style={{
          fontFamily: 'Nunito, sans-serif',
          fontSize: '10px',
          color: 'var(--text-d)',
          fontWeight: 600,
          textAlign: 'center',
          lineHeight: 1.4,
          minHeight: '14px',
        }}>
          {!slot1 && !slot2 && 'Select from left & right panels'}
          {slot1 && !slot2 && `${slot1.emoji} ready — pick element II →`}
          {slot1 && slot2 && !result && !isProcessing && !showFailed && `Combining…`}
        </div>
      </div>
    </div>
  );
};

export default CombinationArea;
