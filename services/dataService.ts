import elementsData from '../data/elements.json';
import combinationsData from '../data/combinations.json';
import { ElementData, CombinationData, CombinationResult } from '../types';

const elements = elementsData.elements as ElementData[];
const combinations = combinationsData.combinations as CombinationData[];

// Create a map for quick element lookup
const elementMap = new Map<string, ElementData>();
elements.forEach(el => {
  elementMap.set(el.name.toLowerCase().trim(), el);
});

// Create a map for quick combination lookup
const combinationMap = new Map<string, string>();
combinations.forEach(combo => {
  const key1 = `${combo.element1.toLowerCase()}|${combo.element2.toLowerCase()}`;
  const key2 = `${combo.element2.toLowerCase()}|${combo.element1.toLowerCase()}`;
  combinationMap.set(key1, combo.result);
  combinationMap.set(key2, combo.result);
});

/**
 * Get element data by name
 */
export function getElementData(name: string): ElementData | undefined {
  return elementMap.get(name.toLowerCase().trim());
}

/**
 * Try to combine two elements
 */
export function combineElements(element1: string, element2: string): CombinationResult {
  const key = `${element1.toLowerCase().trim()}|${element2.toLowerCase().trim()}`;
  const result = combinationMap.get(key);

  if (!result) {
    return {
      result: null,
      emoji: '❌'
    };
  }

  const resultData = getElementData(result);
  
  return {
    result: resultData?.name || result,
    emoji: resultData?.emoji || '✨',
    group: resultData?.group,
    stage: resultData?.stage
  };
}

/**
 * Get all available elements
 */
export function getAllElements(): ElementData[] {
  return elements;
}

/**
 * Get starter elements (4 basic elements)
 */
export function getStarterElements(): ElementData[] {
  return elements.filter(el => 
    ['Fire', 'Water', 'Earth', 'Air'].includes(el.name)
  );
}

/**
 * Search for possible combinations with a given element
 */
export function getPossibleCombinations(elementName: string): CombinationData[] {
  const normalizedName = elementName.toLowerCase().trim();
  return combinations.filter(
    combo => 
      combo.element1.toLowerCase() === normalizedName || 
      combo.element2.toLowerCase() === normalizedName
  );
}
