import React, { useState, useEffect, useMemo, useRef } from 'react';
import { ElementItem, Discovery, RecipeResult, GameState, ElementGroup, GameStage } from './types';
import { INITIAL_ELEMENTS, STORAGE_KEY, DEFAULT_HINTS, GROUP_INFO, STAGE_THRESHOLDS } from './constants';
import { combineElements, getStarterElements } from './services/dataService';
import CombinationArea from './components/CombinationArea';
import HistoryDrawer from './components/HistoryDrawer';
import ElementPanel from './components/ElementPanel';

const App: React.FC = () => {
  // ── Game state ──────────────────────────────
  const [unlocked, setUnlocked] = useState<ElementItem[]>(INITIAL_ELEMENTS);
  const [recipes, setRecipes] = useState<Record<string, RecipeResult>>({});
  const [history, setHistory] = useState<Discovery[]>([]);
  const [hints, setHints] = useState(DEFAULT_HINTS);
  const [currentStage, setCurrentStage] = useState<GameStage>('Beginning');

  // ── UI state ─────────────────────────────────
  const [slot1, setSlot1] = useState<ElementItem | null>(null);
  const [slot2, setSlot2] = useState<ElementItem | null>(null);
  const [resultElement, setResultElement] = useState<ElementItem | null>(null);
  const [leftGroup, setLeftGroup] = useState<ElementGroup | 'All'>('All');
  const [rightGroup, setRightGroup] = useState<ElementGroup | 'All'>('All');
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error' | 'info'; message: string; key: number } | null>(null);
  const [newlyUnlocked, setNewlyUnlocked] = useState<string[]>([]);
  const [showFailed, setShowFailed] = useState(false);
  const feedbackKey = useRef(0);

  // ── Persistence ──────────────────────────────
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return;
    try {
      const p = JSON.parse(saved) as GameState;
      setUnlocked(p.unlockedElements);
      setRecipes(p.recipes);
      setHistory(p.discoveryHistory);
      setHints(p.hintsRemaining);
      setCurrentStage(p.currentStage || 'Beginning');
    } catch { /* ignore */ }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      unlockedElements: unlocked, discoveryHistory: history,
      recipes, hintsRemaining: hints, currentStage,
    } as GameState));
  }, [unlocked, history, recipes, hints, currentStage]);

  // ── Stage progression ────────────────────────
  useEffect(() => {
    const n = unlocked.length;
    if (n >= STAGE_THRESHOLDS['World of Magic'] && currentStage !== 'World of Magic') {
      setCurrentStage('World of Magic');
      toast('success', '✦ World of Magic unlocked!');
    } else if (n >= STAGE_THRESHOLDS['Modern Age'] && currentStage === 'Technology') {
      setCurrentStage('Modern Age');
      toast('success', '✦ Modern Age unlocked!');
    } else if (n >= STAGE_THRESHOLDS['Technology'] && currentStage === 'Beginning') {
      setCurrentStage('Technology');
      toast('success', '✦ Technology Era unlocked!');
    }
  }, [unlocked.length]);

  // ── Derived ───────────────────────────────────
  const groupCounts = useMemo(() => {
    const c: Record<ElementGroup, number> = {} as any;
    unlocked.forEach(el => { const g = (el.group || 'Custom') as ElementGroup; c[g] = (c[g] || 0) + 1; });
    return c;
  }, [unlocked]);

  // ── Helpers ───────────────────────────────────
  const toast = (type: 'success' | 'error' | 'info', message: string) => {
    feedbackKey.current += 1;
    setFeedback({ type, message, key: feedbackKey.current });
    setTimeout(() => setFeedback(null), 3000);
  };

  const handleCombine = async (el1: ElementItem, el2: ElementItem) => {
    const key = [el1.name, el2.name].sort().join('+');
    const cached = recipes[key];
    if (cached) {
      processResult(cached, el1.name, el2.name);
    } else {
      setIsThinking(true);
      const res = combineElements(el1.name, el2.name);
      setIsThinking(false);
      setRecipes(prev => ({ ...prev, [key]: res }));
      processResult(res, el1.name, el2.name);
    }
  };

  const processResult = (res: RecipeResult, i1: string, i2: string) => {
    if (!res.result || !res.emoji) {
      setShowFailed(true); setResultElement(null);
      // auto-reset center after failed combo
      setTimeout(() => {
        setShowFailed(false);
        setSlot1(null);
        setSlot2(null);
      }, 1400);
      toast('error', 'No reaction — try different elements');
      return;
    }
    const already = unlocked.find(e => e.name.toLowerCase() === res.result?.toLowerCase());
    if (already) {
      setResultElement(already);
      // auto-reset after showing known result
      setTimeout(() => {
        setResultElement(null);
        setSlot1(null);
        setSlot2(null);
      }, 2000);
      toast('info', `${res.emoji} ${res.result} already known`);
    } else {
      const newEl: ElementItem = { name: res.result, emoji: res.emoji, isCustom: false, group: res.group, stage: res.stage };
      setUnlocked(prev => [...prev, newEl]);
      setHistory(prev => [{ result: newEl, ingredients: [i1, i2], timestamp: Date.now() }, ...prev]);
      setNewlyUnlocked(prev => [...prev, newEl.name]);
      setTimeout(() => setNewlyUnlocked(prev => prev.filter(n => n !== newEl.name)), 3500);
      setResultElement(newEl);
      // auto-reset after showing new discovery
      setTimeout(() => {
        setResultElement(null);
        setSlot1(null);
        setSlot2(null);
      }, 2600);
      toast('success', `✦ New discovery: ${res.emoji} ${newEl.name}!`);
    }
  };

  // Left panel → slot 1
  const handleSelectLeft = (el: ElementItem) => {
    setResultElement(null); setShowFailed(false);
    setSlot1(el);
    if (slot2) handleCombine(el, slot2);
  };

  // Right panel → slot 2
  const handleSelectRight = (el: ElementItem) => {
    setResultElement(null); setShowFailed(false);
    setSlot2(el);
    if (slot1) handleCombine(slot1, el);
  };

  const handleHint = () => {
    if (hints <= 0) { toast('info', 'No hints left this session'); return; }
    const el = unlocked[Math.floor(Math.random() * unlocked.length)];
    setHints(h => h - 1);
    toast('info', `Hint: try combining things with ${el.emoji} ${el.name}`);
  };

  const handleReset = () => {
    if (!window.confirm('Reset all progress? This cannot be undone.')) return;
    const starters = getStarterElements().map(e => ({ name: e.name, emoji: e.emoji, isCustom: false, group: e.group, stage: e.stage }));
    setUnlocked(starters); setHistory([]); setRecipes({});
    setHints(DEFAULT_HINTS); setCurrentStage('Beginning');
    setLeftGroup('All'); setRightGroup('All');
    setSlot1(null); setSlot2(null); setResultElement(null);
    localStorage.removeItem(STORAGE_KEY);
    toast('info', 'Progress reset');
  };

  const clearSlot = (slot: 1 | 2) => {
    if (slot === 1) { setSlot1(null); setResultElement(null); setShowFailed(false); }
    else { setSlot2(null); setResultElement(null); setShowFailed(false); }
  };

  // ═══════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════
  return (
    <>
      {/* ─── HEADER ─── */}
      <header className="app-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '9px', minWidth: 0 }}>
          <span style={{ fontSize: '22px', flexShrink: 0 }}>⚗️</span>
          <div style={{ minWidth: 0 }}>
            <div className="title-text">INFINITE ALCHEMY</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginTop: '2px' }}>
              <span className="stage-pill">{currentStage}</span>
              <span style={{ fontFamily: 'Nunito, sans-serif', fontSize: '10px', color: 'rgba(255,255,255,0.75)', fontWeight: 700 }}>
                {unlocked.length} elements
              </span>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          {/* Hint */}
          <button className="act-btn" onClick={handleHint} title={`${hints} hints remaining`}>
            <i className="fa-solid fa-lightbulb" />
            {hints > 0 && (
              <span style={{
                position: 'absolute', top: '-4px', right: '-4px',
                background: '#FFD700', color: '#2A1800',
                borderRadius: '50%', width: '15px', height: '15px',
                fontSize: '8.5px', fontWeight: 900,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'Nunito, sans-serif',
                boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
              }}>{hints}</span>
            )}
          </button>

          {/* History */}
          <button className="act-btn" onClick={() => setIsHistoryOpen(true)} title="Open Grimoire">
            <i className="fa-solid fa-book-open" />
            {history.length > 0 && (
              <span style={{
                position: 'absolute', top: '-4px', right: '-4px',
                background: '#9956DE', color: '#fff',
                borderRadius: '8px', padding: '0 3px', height: '15px',
                fontSize: '8px', fontWeight: 900,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'Nunito, sans-serif', minWidth: '15px',
                boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
              }}>{history.length}</span>
            )}
          </button>

          {/* Reset */}
          <button className="act-btn" onClick={handleReset} title="Reset game">
            <i className="fa-solid fa-rotate-right" style={{ opacity: 0.8 }} />
          </button>
        </div>
      </header>

      {/* ─── DUAL PANEL LAYOUT ─── */}
      <div className="dual-layout">
        {/* Left panel → Element I / slot1 */}
        <ElementPanel
          side="left"
          selectedGroup={leftGroup}
          onGroupChange={setLeftGroup}
          unlocked={unlocked}
          activeSlot={slot1}
          newlyUnlocked={newlyUnlocked}
          groupCounts={groupCounts}
          currentStage={currentStage}
          onSelect={handleSelectLeft}
        />

        {/* Center: combination */}
        <CombinationArea
          slot1={slot1} slot2={slot2} result={resultElement}
          onClearSlot={clearSlot}
          isProcessing={isThinking}
          showFailed={showFailed}
        />

        {/* Right panel → Element II / slot2 */}
        <ElementPanel
          side="right"
          selectedGroup={rightGroup}
          onGroupChange={setRightGroup}
          unlocked={unlocked}
          activeSlot={slot2}
          newlyUnlocked={newlyUnlocked}
          groupCounts={groupCounts}
          currentStage={currentStage}
          onSelect={handleSelectRight}
        />
      </div>

      {/* ─── OVERLAYS ─── */}
      {feedback && (
        <div key={feedback.key} className={`toast anim-toast ${feedback.type}`}>
          <i className={`fa-solid ${
            feedback.type === 'success' ? 'fa-wand-magic-sparkles' :
            feedback.type === 'error'   ? 'fa-circle-xmark' : 'fa-circle-info'
          }`} style={{ fontSize: '14px' }} />
          <span>{feedback.message}</span>
        </div>
      )}

      <HistoryDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
      />
    </>
  );
};

export default App;
