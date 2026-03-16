import React, { useState, useEffect, useMemo, useRef } from 'react';
import { ElementItem, Discovery, RecipeResult, GameState, ElementGroup, GameStage } from './types';
import { INITIAL_ELEMENTS, STORAGE_KEY, DEFAULT_HINTS, GROUP_INFO, STAGE_THRESHOLDS } from './constants';
import { combineElements, getStarterElements } from './services/dataService';
import CombinationArea from './components/CombinationArea';
import HistoryDrawer from './components/HistoryDrawer';
import GroupFilter from './components/GroupFilter';
import ElementStrip from './components/ElementStrip';

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
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGroup, setSelectedGroup] = useState<ElementGroup | 'All'>('All');
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

  const filteredElements = useMemo(() => {
    let list = [...unlocked];
    if (selectedGroup !== 'All') list = list.filter(e => (e.group || 'Custom') === selectedGroup);
    if (searchTerm) list = list.filter(e => e.name.toLowerCase().includes(searchTerm.toLowerCase()));
    return list.sort((a, b) => a.name.localeCompare(b.name));
  }, [unlocked, searchTerm, selectedGroup]);

  // ── Helpers ───────────────────────────────────
  const toast = (type: 'success' | 'error' | 'info', message: string) => {
    feedbackKey.current += 1;
    setFeedback({ type, message, key: feedbackKey.current });
    setTimeout(() => setFeedback(null), 3000);
  };

  const handleSelectElement = (el: ElementItem) => {
    if (!slot1) {
      setSlot1(el); setResultElement(null); setShowFailed(false);
    } else if (!slot2) {
      setSlot2(el); handleCombine(slot1, el);
    } else {
      setSlot1(el); setSlot2(null); setResultElement(null); setShowFailed(false);
    }
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
      setTimeout(() => setShowFailed(false), 900);
      toast('error', 'No reaction — try different elements');
      return;
    }
    const already = unlocked.find(e => e.name.toLowerCase() === res.result?.toLowerCase());
    if (already) {
      setResultElement(already);
      setTimeout(() => setResultElement(null), 2200);
      toast('info', `${res.emoji} ${res.result} already known`);
    } else {
      const newEl: ElementItem = { name: res.result, emoji: res.emoji, isCustom: false, group: res.group, stage: res.stage };
      setUnlocked(prev => [...prev, newEl]);
      setHistory(prev => [{ result: newEl, ingredients: [i1, i2], timestamp: Date.now() }, ...prev]);
      setNewlyUnlocked(prev => [...prev, newEl.name]);
      setTimeout(() => setNewlyUnlocked(prev => prev.filter(n => n !== newEl.name)), 3500);
      setResultElement(newEl);
      setTimeout(() => setResultElement(null), 2800);
      toast('success', `✦ New discovery: ${res.emoji} ${newEl.name}!`);
    }
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
    setSelectedGroup('All'); setSlot1(null); setSlot2(null); setResultElement(null);
    localStorage.removeItem(STORAGE_KEY);
    toast('info', 'Progress reset');
  };

  const clearSlot = (slot: 1 | 2) => {
    if (slot === 1) { setSlot1(null); setResultElement(null); setShowFailed(false); }
    else { setSlot2(null); setResultElement(null); setShowFailed(false); }
  };

  // ═══════════════════════════════════════════
  // Header (shared by both layouts)
  // ═══════════════════════════════════════════
  const Header = () => (
    <header className="app-header">
      <div style={{ display: 'flex', alignItems: 'center', gap: '9px', minWidth: 0 }}>
        <span style={{ fontSize: '22px', filter: 'drop-shadow(0 0 8px rgba(244,98,42,0.6))', flexShrink: 0 }}>⚗️</span>
        <div style={{ minWidth: 0 }}>
          <div className="title-text">INFINITE ALCHEMY</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginTop: '1px' }}>
            <span className="stage-pill">{currentStage}</span>
            <span style={{ fontFamily: 'Nunito, sans-serif', fontSize: '10px', color: 'var(--text-d)', fontWeight: 600 }}>
              {unlocked.length} elements
            </span>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        {/* Hint */}
        <button className="act-btn" onClick={handleHint} title={`${hints} hints remaining`}>
          <i className="fa-solid fa-lightbulb" style={{ color: 'var(--gold)' }} />
          {hints > 0 && (
            <span style={{
              position: 'absolute', top: '-4px', right: '-4px',
              background: 'var(--gold)', color: '#000',
              borderRadius: '50%', width: '14px', height: '14px',
              fontSize: '8.5px', fontWeight: 800,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: 'Nunito, sans-serif',
            }}>{hints}</span>
          )}
        </button>

        {/* History */}
        <button className="act-btn" onClick={() => setIsHistoryOpen(true)} title="Open Grimoire">
          <i className="fa-solid fa-book-open" style={{ color: 'var(--gold)' }} />
          {history.length > 0 && (
            <span style={{
              position: 'absolute', top: '-4px', right: '-4px',
              background: 'var(--violet)', color: '#fff',
              borderRadius: '8px', padding: '0 3px', height: '14px',
              fontSize: '8px', fontWeight: 800,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: 'Nunito, sans-serif', minWidth: '14px',
            }}>{history.length}</span>
          )}
        </button>

        {/* Reset */}
        <button className="act-btn" onClick={handleReset} title="Reset game">
          <i className="fa-solid fa-rotate-right" style={{ color: 'var(--error)', opacity: 0.7 }} />
        </button>
      </div>
    </header>
  );

  // ═══════════════════════════════════════════
  // Browser panel (groups + search + grid)
  // ═══════════════════════════════════════════
  const BrowserPanel = () => (
    <>
      <GroupFilter
        selectedGroup={selectedGroup}
        onSelectGroup={setSelectedGroup}
        groupCounts={groupCounts}
        currentStage={currentStage}
      />
      <div className="search-wrap" style={{ position: 'relative' }}>
        <span className="search-icon"><i className="fa-solid fa-magnifying-glass" /></span>
        <input
          type="text"
          className="search-input"
          placeholder={`Search ${unlocked.length} elements…`}
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm('')}
            style={{
              background: 'none', border: 'none', color: 'var(--text-d)',
              cursor: 'pointer', fontSize: '12px', padding: '0 4px',
            }}
          >
            <i className="fa-solid fa-xmark" />
          </button>
        )}
      </div>
      <ElementStrip
        elements={filteredElements}
        onSelect={handleSelectElement}
        slot1={slot1}
        slot2={slot2}
        newlyUnlocked={newlyUnlocked}
        selectedGroup={selectedGroup}
      />
    </>
  );

  // ═══════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════
  return (
    <>
      {/* ─── HEADER (always on top, full width) ─── */}
      <Header />

      {/* ─── DESKTOP LAYOUT (≥720px) ─── */}
      {/* Left: browser panel */}
      <aside className="browser-panel">
        <BrowserPanel />
      </aside>

      {/* Right: combination workspace */}
      <section className="workspace-panel">
        {/* Big atmospheric combo UI for desktop */}
        <div style={{
          width: '100%', maxWidth: '520px',
          background: 'rgba(26,21,40,0.7)',
          border: '1px solid var(--border)',
          borderRadius: '20px',
          overflow: 'hidden',
          boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
        }}>
          <CombinationArea
            slot1={slot1} slot2={slot2} result={resultElement}
            onClearSlot={clearSlot}
            isProcessing={isThinking}
            showFailed={showFailed}
          />
        </div>

        {/* Desktop stats row */}
        <div style={{
          display: 'flex', gap: '24px', marginTop: '20px',
          fontFamily: 'Cinzel, serif',
        }}>
          {[
            { label: 'Discovered', value: history.length },
            { label: 'Elements', value: unlocked.length },
            { label: 'Stage', value: currentStage },
          ].map(({ label, value }) => (
            <div key={label} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '9px', letterSpacing: '0.15em', color: 'var(--text-d)', textTransform: 'uppercase', marginBottom: '2px' }}>{label}</div>
              <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--gold)' }}>{value}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── MOBILE LAYOUT (<720px) ─── */}
      <div className="mobile-only" style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, overflow: 'hidden' }}>
        {/* Combination zone */}
        <CombinationArea
          slot1={slot1} slot2={slot2} result={resultElement}
          onClearSlot={clearSlot}
          isProcessing={isThinking}
          showFailed={showFailed}
        />
        {/* Browser */}
        <BrowserPanel />
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
