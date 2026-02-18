
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { ElementItem, Discovery, RecipeResult, GameState, ElementGroup, GameStage } from './types';
import { INITIAL_ELEMENTS, STORAGE_KEY, DEFAULT_HINTS, GROUP_INFO, STAGE_THRESHOLDS } from './constants';
import { combineElements, getStarterElements } from './services/dataService';
import ElementCard from './components/ElementCard';
import CombinationArea from './components/CombinationArea';
import HistoryDrawer from './components/HistoryDrawer';
import GroupFilter from './components/GroupFilter';
import ElementStrip from './components/ElementStrip';

const App: React.FC = () => {
  // --- Game State ---
  const [unlocked, setUnlocked] = useState<ElementItem[]>(INITIAL_ELEMENTS);
  const [recipes, setRecipes] = useState<Record<string, RecipeResult>>({});
  const [history, setHistory] = useState<Discovery[]>([]);
  const [hints, setHints] = useState(DEFAULT_HINTS);
  const [currentStage, setCurrentStage] = useState<GameStage>('Beginning');
  
  // --- UI State ---
  const [slot1, setSlot1] = useState<ElementItem | null>(null);
  const [slot2, setSlot2] = useState<ElementItem | null>(null);
  const [resultElement, setResultElement] = useState<ElementItem | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGroup, setSelectedGroup] = useState<ElementGroup | 'All'>('All');
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [isBrowserOpen, setIsBrowserOpen] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error' | 'info', message: string } | null>(null);
  const [newlyUnlocked, setNewlyUnlocked] = useState<string[]>([]);
  const [showFailed, setShowFailed] = useState(false);

  // --- Initialization & Persistence ---
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as GameState;
        setUnlocked(parsed.unlockedElements);
        setRecipes(parsed.recipes);
        setHistory(parsed.discoveryHistory);
        setHints(parsed.hintsRemaining);
        setCurrentStage(parsed.currentStage || 'Beginning');
      } catch (e) {
        console.error("Failed to load save state", e);
      }
    }
  }, []);

  useEffect(() => {
    const state: GameState = {
      unlockedElements: unlocked,
      discoveryHistory: history,
      recipes: recipes,
      hintsRemaining: hints,
      currentStage: currentStage,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [unlocked, history, recipes, hints, currentStage]);

  // Auto-update stage based on element count
  useEffect(() => {
    const count = unlocked.length;
    if (count >= STAGE_THRESHOLDS['World of Magic'] && currentStage !== 'World of Magic') {
      setCurrentStage('World of Magic');
      showToast('success', '🎉 World of Magic unlocked!');
    } else if (count >= STAGE_THRESHOLDS['Modern Age'] && currentStage === 'Technology') {
      setCurrentStage('Modern Age');
      showToast('success', '🎉 Modern Age unlocked!');
    } else if (count >= STAGE_THRESHOLDS['Technology'] && currentStage === 'Beginning') {
      setCurrentStage('Technology');
      showToast('success', '🎉 Technology Era unlocked!');
    }
  }, [unlocked.length, currentStage]);

  // --- Logic ---
  // Calculate group counts
  const groupCounts = useMemo(() => {
    const counts: Record<ElementGroup, number> = {} as Record<ElementGroup, number>;
    unlocked.forEach(el => {
      const group = el.group || 'Custom';
      counts[group] = (counts[group] || 0) + 1;
    });
    return counts;
  }, [unlocked]);

  const filteredElements = useMemo(() => {
    let filtered = [...unlocked];
    
    // Filter by group
    if (selectedGroup !== 'All') {
      filtered = filtered.filter(e => (e.group || 'Custom') === selectedGroup);
    }
    
    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(e => e.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }
    
    // Sort alphabetically
    return filtered.sort((a, b) => a.name.localeCompare(b.name));
  }, [unlocked, searchTerm, selectedGroup]);

  const showToast = (type: 'success' | 'error' | 'info', message: string) => {
    setFeedback({ type, message });
    setTimeout(() => setFeedback(null), 3000);
  };

  // New selection logic for two-slot UI
  const handleSelectElement = (element: ElementItem) => {
    if (!slot1) {
      setSlot1(element);
      setResultElement(null);
      setShowFailed(false);
    } else if (!slot2) {
      setSlot2(element);
      // Auto-combine when both slots filled
      handleCombine(slot1, element);
    } else {
      // Both slots full, replace slot1
      setSlot1(element);
      setSlot2(null);
      setResultElement(null);
      setShowFailed(false);
    }
  };

  // Combine logic for slot-based UI
  const handleCombine = async (el1: ElementItem, el2: ElementItem) => {
    if (!el1 || !el2) return;
    const names = [el1.name, el2.name].sort();
    const recipeKey = names.join('+');
    const existingRecipe = recipes[recipeKey];
    if (existingRecipe) {
      processCombinationResult(existingRecipe, el1.name, el2.name);
    } else {
      setIsThinking(true);
      const result = combineElements(el1.name, el2.name);
      setIsThinking(false);
      setRecipes(prev => ({ ...prev, [recipeKey]: result }));
      processCombinationResult(result, el1.name, el2.name);
    }
  };

  const processCombinationResult = (res: RecipeResult, ingredient1: string, ingredient2: string) => {
    if (!res.result || !res.emoji) {
      setShowFailed(true);
      setResultElement(null);
      setTimeout(() => setShowFailed(false), 800);
      showToast('error', "❌ No combination found. Try different elements!");
      return;
    }

    const alreadyUnlocked = unlocked.some(e => e.name.toLowerCase() === res.result?.toLowerCase());
    
    if (alreadyUnlocked) {
      const existing = unlocked.find(e => e.name.toLowerCase() === res.result?.toLowerCase());
      if (existing) {
        setResultElement(existing);
        setTimeout(() => setResultElement(null), 2000);
      }
      showToast('info', `${res.emoji} You already discovered ${res.result}!`);
    } else {
      const newElement: ElementItem = { 
        name: res.result, 
        emoji: res.emoji,
        isCustom: false,
        group: res.group,
        stage: res.stage,
      };
      
      setUnlocked(prev => [...prev, newElement]);
      setHistory(prev => [{
        result: newElement,
        ingredients: [ingredient1, ingredient2],
        timestamp: Date.now()
      }, ...prev]);
      
      setNewlyUnlocked(prev => [...prev, newElement.name]);
      setTimeout(() => {
        setNewlyUnlocked(prev => prev.filter(name => name !== newElement.name));
      }, 3000);

      // Show result in result area
      setResultElement(newElement);
      setTimeout(() => setResultElement(null), 2500);

      showToast('success', `🎉 New discovery: ${res.emoji} ${newElement.name}!`);
    }
  };

  const handleHint = async () => {
    if (hints <= 0) {
      showToast('info', "No hints remaining this session.");
      return;
    }

    // Generate a simple hint from available data
    const undiscovered = unlocked.filter(el => !el.isCustom);
    if (undiscovered.length === 0) {
      showToast('info', "You've discovered everything in the database! Try experimenting!");
      return;
    }
    
    const randomEl = undiscovered[Math.floor(Math.random() * undiscovered.length)];
    setHints(prev => prev - 1);
    showToast('info', `Hint: Try combining elements to discover ${randomEl.name}!`);
  };

  const handleReset = () => {
    if (window.confirm("Are you sure? This will wipe all progress.")) {
      setUnlocked(INITIAL_ELEMENTS);
      setHistory([]);
      setRecipes({});
      const starters = getStarterElements();
      const initialElements = starters.map(el => ({
        name: el.name,
        emoji: el.emoji,
        isCustom: false,
        group: el.group,
        stage: el.stage
      }));
      
      setUnlocked(initialElements);
      setHistory([]);
      setRecipes({});
      setHints(DEFAULT_HINTS);
      setCurrentStage('Beginning');
      setSelectedGroup('All');
      setSlot1(null);
      setSlot2(null);
      setResultElement(null);
      localStorage.removeItem(STORAGE_KEY);
      showToast('info', "Game reset.");
    }
  }
  return (
    <div className="min-h-screen max-w-5xl mx-auto px-4 py-8 flex flex-col gap-6 h-screen">
      {/* Header */}
      <header className="flex items-center justify-between bg-gray-800/50 p-4 rounded-2xl border border-gray-700">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center text-xl shadow-lg shadow-indigo-500/20">
            🌍
          </div>
          <h1 className="text-xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
            INFINITE ALCHEMY
          </h1>
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={handleHint}
            title={`Hints: ${hints}`}
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-gray-700 hover:bg-gray-600 transition-colors relative"
          >
            <i className="fa-solid fa-lightbulb text-yellow-400"></i>
            {hints > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-[10px] flex items-center justify-center rounded-full">
                {hints}
              </span>
            )}
          </button>
          
          <button 
            onClick={() => setIsHistoryOpen(true)}
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-gray-700 hover:bg-gray-600 transition-colors"
          >
            <i className="fa-solid fa-book text-indigo-400"></i>
          </button>

          <button 
            onClick={() => setIsBrowserOpen(!isBrowserOpen)}
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-gray-700 hover:bg-gray-600 transition-colors"
            title="Toggle element browser"
          >
            <i className={`fa-solid ${isBrowserOpen ? 'fa-chevron-up' : 'fa-list'} text-blue-400`}></i>
          </button>

          <button 
            onClick={handleReset}
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-gray-700 hover:bg-gray-600 transition-colors"
          >
            <i className="fa-solid fa-rotate-right text-red-400"></i>
          </button>
        </div>
      </header>

      {/* Main Play Area */}
      <main className="flex-1 flex flex-col gap-0 overflow-hidden">
        {/* Top Zone - Element Strip */}
        <ElementStrip
          elements={unlocked}
          onSelect={handleSelectElement}
          selectedElement={slot1}
          compatibleNames={slot1 ? getCombinableElements(slot1, unlocked, recipes).map(e => e.name) : []}
          groupProgress={calculateGroupProgress(unlocked)}
        />

        {/* Bottom Zone - The Stage */}
        <div className="flex-1 flex items-center justify-center p-8">
          <CombinationArea
            slot1={slot1}
            slot2={slot2}
            result={resultElement}
            onClearSlot={(slot) => {
              if (slot === 1) {
                setSlot1(null);
                setResultElement(null);
                setShowFailed(false);
              } else {
                setSlot2(null);
                setResultElement(null);
                setShowFailed(false);
              }
            }}
            isProcessing={isThinking}
            showFailed={showFailed}
          />
        </div>

        {/* Optional Browser Area (hidden by default) */}
        {isBrowserOpen && (
          <div className="flex-1 flex flex-col gap-4 min-h-0 bg-gray-800/30 rounded-3xl p-6 border border-gray-800/50 animate-fadeIn">
          {/* Group Filter */}
          <GroupFilter 
            selectedGroup={selectedGroup}
            onSelectGroup={setSelectedGroup}
            groupCounts={groupCounts}
            currentStage={currentStage}
          />
          
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"></i>
              <input 
                type="text" 
                placeholder="Search elements..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-gray-900/50 border border-gray-700 rounded-full py-2.5 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
              />
            </div>
            <div className="text-xs text-gray-500 font-mono bg-gray-900/50 px-3 py-2 rounded-full border border-gray-700">
              {filteredElements.length} / {unlocked.length}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto scroll-smooth">
            <div className="flex flex-wrap gap-3 p-1">
              {/* Optionally keep list for reference, or hide in new UI */}
              {filteredElements.map((el) => (
                <ElementCard
                  key={el.name}
                  element={el}
                  isNew={newlyUnlocked.includes(el.name)}
                  isSelected={slot1?.name === el.name || slot2?.name === el.name}
                  selectionIndex={slot1?.name === el.name ? 1 : slot2?.name === el.name ? 2 : undefined}
                  onClick={() => handleSelectElement(el)}
                />
              ))}
              {filteredElements.length === 0 && (
                <div className="w-full text-center py-12 text-gray-600">
                  <i className="fa-solid fa-ghost text-3xl mb-3 opacity-20"></i>
                  <p>No elements match your search.</p>
                </div>
              )}
            </div>
          </div>
          </div>
        )}
      </main>

      {/* Feedback Toast */}
      {feedback && (
        <div className={`
          fixed bottom-8 left-1/2 -translate-x-1/2 z-[60] px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-bounce
          ${feedback.type === 'success' ? 'bg-green-600' : feedback.type === 'error' ? 'bg-red-600' : 'bg-indigo-600'}
        `}>
          <i className={`fa-solid ${
            feedback.type === 'success' ? 'fa-check-circle' : 
            feedback.type === 'error' ? 'fa-triangle-exclamation' : 'fa-circle-info'
          }`}></i>
          <span className="font-bold text-sm">{feedback.message}</span>
        </div>
      )}

      {/* Drawers */}
      <HistoryDrawer 
        isOpen={isHistoryOpen} 
        onClose={() => setIsHistoryOpen(false)} 
        history={history}
      />
      
      {/* Simple Footer/Credits */}
      <footer className="text-center text-[10px] text-gray-600 uppercase tracking-widest pb-4">
        Powered by Google Gemini 3 Pro & 2.5 Flash Lite
      </footer>
    </div>
  );
};

// Helper: get combinable elements for selected
function getCombinableElements(selected: ElementItem, unlocked: ElementItem[], recipes: Record<string, RecipeResult>) {
  // Show all elements as potentially combinable (player can try any combination)
  return unlocked.filter(el => el.name !== selected.name);
}

// Helper: calculate group progress
function calculateGroupProgress(unlocked: ElementItem[]): Record<ElementGroup, { current: number; total: number }> {
  const progress: any = {};
  
  // Get all unique groups from unlocked elements
  const allGroups = new Set(unlocked.map(e => e.group || 'Custom'));
  
  allGroups.forEach(group => {
    const count = unlocked.filter(e => (e.group || 'Custom') === group).length;
    // Estimate total based on current count (this is a placeholder - you can set actual totals)
    progress[group] = { current: count, total: Math.max(count, 20) };
  });
  
  return progress;
}

export default App;
