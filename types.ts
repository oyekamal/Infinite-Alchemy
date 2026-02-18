
export type ElementGroup = 
  | 'Energy' | 'Air' | 'Earth' | 'Fire' | 'Liquids' 
  | 'Invertebrates' | 'Plants' | 'Animals' | 'Tools'
  | 'Ingredients' | 'Resources' | 'Human' | 'Transport'
  | 'Supernatural' | 'Technology' | 'Society' | 'Foods'
  | 'Jobs' | 'Science' | 'Pets' | 'Drinks' | 'Beings'
  | 'Arming' | 'Bewitchment' | 'Obscurity' | 'Luminosity'
  | 'Custom';

export type GameStage = 'Beginning' | 'Technology' | 'Modern Age' | 'World of Magic';

export interface ElementItem {
  name: string;
  emoji: string;
  isCustom?: boolean;
  group?: ElementGroup;
  stage?: GameStage;
}

export interface Discovery {
  result: ElementItem;
  ingredients: [string, string];
  timestamp: number;
}

export interface RecipeResult {
  result: string | null;
  emoji: string | null;
  group?: ElementGroup;
  stage?: GameStage;
}

export interface ElementData {
  name: string;
  emoji: string;
  group: ElementGroup;
  stage: GameStage;
}

export interface CombinationData {
  element1: string;
  element2: string;
  result: string;
}

export interface CombinationResult {
  result: string | null;
  emoji: string | null;
  group?: ElementGroup;
  stage?: GameStage;
}

export interface GameState {
  unlockedElements: ElementItem[];
  discoveryHistory: Discovery[];
  recipes: Record<string, RecipeResult>;
  hintsRemaining: number;
  currentStage: GameStage;
}

export interface GroupInfo {
  name: ElementGroup;
  color: string;
  icon: string;
  maxElements: number;
  stage: GameStage;
  description: string;
}
