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
          onClick={onClose}
          style={{
            position: 'fixed', inset: 0, zIndex: 90,
            background: 'rgba(0,0,0,0.7)',
            backdropFilter: 'blur(4px)',
          }}
        />
      )}

      {/* Drawer */}
      <div
        className="grimoire"
        style={{ transform: isOpen ? 'translateX(0)' : 'translateX(100%)' }}
      >
        {/* Header */}
        <div style={{
          padding: '14px 16px',
          borderBottom: '1px solid var(--border)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          background: 'var(--card)',
          flexShrink: 0,
        }}>
          <div>
            <div style={{
              fontFamily: 'Cinzel, serif', fontSize: '14px', fontWeight: 700,
              color: 'var(--sky-d)', letterSpacing: '0.08em',
            }}>
              📜 Grimoire
            </div>
            <div style={{
              fontFamily: 'Nunito, sans-serif', fontSize: '12px',
              color: 'var(--text-m)', marginTop: '2px',
            }}>
              {history.length} {history.length === 1 ? 'discovery' : 'discoveries'}
            </div>
          </div>
          <button className="act-btn" onClick={onClose}>
            <i className="fa-solid fa-xmark" />
          </button>
        </div>

        {/* Entries */}
        <div style={{
          flex: 1, overflowY: 'auto', padding: '10px 12px',
          display: 'flex', flexDirection: 'column', gap: '6px',
        }}>
          {history.length === 0 ? (
            <div style={{
              flex: 1, display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              gap: '12px', paddingTop: '60px',
              color: 'var(--text-d)', textAlign: 'center',
            }}>
              <span style={{ fontSize: '44px', opacity: 0.12 }}>📜</span>
              <div style={{ fontFamily: 'Cinzel, serif', fontSize: '12px', letterSpacing: '0.1em' }}>
                GRIMOIRE EMPTY
              </div>
              <div style={{ fontFamily: 'Nunito, sans-serif', fontSize: '13px', fontWeight: 600 }}>
                Combine elements to record<br />your discoveries here
              </div>
            </div>
          ) : (
            history.map((item, idx) => (
              <div key={idx} className="disc-entry">
                <span style={{ fontSize: '28px', flexShrink: 0 }}>{item.result.emoji}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontFamily: 'Nunito, sans-serif', fontSize: '13px', fontWeight: 800,
                    color: 'var(--text)', letterSpacing: '0.01em',
                    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                  }}>
                    {item.result.name}
                  </div>
                  <div style={{
                    fontFamily: 'Nunito, sans-serif', fontSize: '11px', fontWeight: 600,
                    color: 'var(--text-d)', marginTop: '2px',
                  }}>
                    {item.ingredients[0]} + {item.ingredients[1]}
                  </div>
                </div>
                <span style={{
                  fontFamily: 'Cinzel, serif', fontSize: '9px',
                  color: 'var(--text-d)', flexShrink: 0,
                }}>
                  #{history.length - idx}
                </span>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div style={{
          padding: '8px 16px', borderTop: '1px solid var(--border)',
          textAlign: 'center', flexShrink: 0,
        }}>
          <div style={{
            fontFamily: 'Cinzel, serif', fontSize: '9px',
            letterSpacing: '0.2em', color: 'var(--text-d)',
          }}>
            ✦ &nbsp; INFINITE ALCHEMY &nbsp; ✦
          </div>
        </div>
      </div>
    </>
  );
};

export default HistoryDrawer;
