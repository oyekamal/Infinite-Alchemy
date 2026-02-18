
import { ElementItem, GroupInfo, GameStage } from './types';

export const INITIAL_ELEMENTS: ElementItem[] = [
  { name: 'Fire', emoji: '🔥', group: 'Fire', stage: 'Beginning' },
  { name: 'Water', emoji: '💧', group: 'Liquids', stage: 'Beginning' },
  { name: 'Earth', emoji: '🌍', group: 'Earth', stage: 'Beginning' },
  { name: 'Air', emoji: '💨', group: 'Air', stage: 'Beginning' }
];

export const STORAGE_KEY = 'infinite_alchemy_save';

export const DEFAULT_HINTS = 3;

// Group definitions with visual styling
export const GROUP_INFO: Record<string, GroupInfo> = {
  Energy: { name: 'Energy', color: '#FFD700', icon: '⚡', maxElements: 10, stage: 'Beginning', description: 'Power and vitality' },
  Air: { name: 'Air', color: '#87CEEB', icon: '💨', maxElements: 10, stage: 'Beginning', description: 'Wind and atmosphere' },
  Earth: { name: 'Earth', color: '#8B4513', icon: '🌍', maxElements: 10, stage: 'Beginning', description: 'Ground and minerals' },
  Fire: { name: 'Fire', color: '#FF4500', icon: '🔥', maxElements: 10, stage: 'Beginning', description: 'Heat and combustion' },
  Liquids: { name: 'Liquids', color: '#4169E1', icon: '💧', maxElements: 10, stage: 'Beginning', description: 'Fluids and water' },
  Invertebrates: { name: 'Invertebrates', color: '#9370DB', icon: '🦋', maxElements: 10, stage: 'Beginning', description: 'Small creatures' },
  Plants: { name: 'Plants', color: '#32CD32', icon: '🌿', maxElements: 10, stage: 'Beginning', description: 'Flora and vegetation' },
  Animals: { name: 'Animals', color: '#FF6347', icon: '🦁', maxElements: 10, stage: 'Beginning', description: 'Living creatures' },
  Tools: { name: 'Tools', color: '#A9A9A9', icon: '🔧', maxElements: 10, stage: 'Beginning', description: 'Equipment and items' },
  Ingredients: { name: 'Ingredients', color: '#DEB887', icon: '🌾', maxElements: 10, stage: 'Beginning', description: 'Raw materials' },
  Resources: { name: 'Resources', color: '#CD853F', icon: '📦', maxElements: 10, stage: 'Beginning', description: 'Materials and goods' },
  Human: { name: 'Human', color: '#FFB6C1', icon: '🧑', maxElements: 10, stage: 'Beginning', description: 'People and characters' },
  Transport: { name: 'Transport', color: '#696969', icon: '🚗', maxElements: 10, stage: 'Beginning', description: 'Vehicles and travel' },
  Supernatural: { name: 'Supernatural', color: '#9400D3', icon: '🐉', maxElements: 10, stage: 'Beginning', description: 'Magical beings' },
  Technology: { name: 'Technology', color: '#00CED1', icon: '💻', maxElements: 10, stage: 'Technology', description: 'Modern innovations' },
  Society: { name: 'Society', color: '#DAA520', icon: '⚖️', maxElements: 10, stage: 'Modern Age', description: 'Culture and law' },
  Foods: { name: 'Foods', color: '#FF69B4', icon: '🍰', maxElements: 10, stage: 'Modern Age', description: 'Cuisine and dishes' },
  Jobs: { name: 'Jobs', color: '#4682B4', icon: '💼', maxElements: 10, stage: 'Modern Age', description: 'Professions and work' },
  Science: { name: 'Science', color: '#20B2AA', icon: '🔬', maxElements: 10, stage: 'Modern Age', description: 'Research and discovery' },
  Pets: { name: 'Pets', color: '#F4A460', icon: '🐱', maxElements: 10, stage: 'Modern Age', description: 'Domestic animals' },
  Drinks: { name: 'Drinks', color: '#BA55D3', icon: '🍸', maxElements: 10, stage: 'Modern Age', description: 'Beverages and cocktails' },
  Beings: { name: 'Beings', color: '#FF8C00', icon: '🧝', maxElements: 10, stage: 'World of Magic', description: 'Fantasy races' },
  Arming: { name: 'Arming', color: '#708090', icon: '⚔️', maxElements: 10, stage: 'World of Magic', description: 'Weapons and armor' },
  Bewitchment: { name: 'Bewitchment', color: '#8A2BE2', icon: '✨', maxElements: 10, stage: 'World of Magic', description: 'Spells and magic' },
  Obscurity: { name: 'Obscurity', color: '#2F4F4F', icon: '🌑', maxElements: 10, stage: 'World of Magic', description: 'Darkness and shadow' },
  Luminosity: { name: 'Luminosity', color: '#FFFACD', icon: '💡', maxElements: 10, stage: 'World of Magic', description: 'Light and holiness' },
  Custom: { name: 'Custom', color: '#FF1493', icon: '✨', maxElements: 999, stage: 'Beginning', description: 'Custom elements' },
};

// Stage unlock thresholds
export const STAGE_THRESHOLDS = {
  'Beginning': 0,
  'Technology': 100,
  'Modern Age': 140,
  'World of Magic': 180,
};
