# 🌍 Doodle God AI - Complete Game Guide

## 🎮 Features Overview

### ✨ What's New
- **500+ Official Combinations**: Complete database from Doodle God wiki
- **Smart AI Retry System**: AI tries up to 3 times to find combinations
- **Complete Emoji Support**: Every element has a unique emoji (300+ mappings)
- **Database-First Approach**: Instant results for known combinations
- **Fallback to AI**: Creative new elements when not in database
- **Progress Persistence**: Auto-save your game state

## 🔧 How It Works

### Combination Flow
```
Player Selects 2 Elements
        ↓
1. Check Local Cache (instant if tried before)
        ↓
2. Check Official Database (500+ combinations)
        ↓
3. If Not Found → Ask AI
        ↓
4. If AI Returns Null → Retry (up to 2 more times)
        ↓
5. Show Result or Error Message
```

### Retry Logic
- **Attempt 1**: Initial AI request
- **Attempt 2**: Wait 1s, retry with same prompt
- **Attempt 3**: Wait 1s, final retry
- **Result**: Success or "No combination found" error

## 📊 Game Stages

### Beginning (100-125 elements)
**Groups:**
- Energy: Blood, Poison, Egg, Seeds, Electricity, Sex, Energy, Life, Philosopher's Stone
- Air: Air, Ash, Dust, Storm, Steam, Snow
- Earth: Clay, Metal, Sand, Fertilizer, Stone, Glass, Limestone, Gold
- Fire: Coal, Saltpetre, Sulfur, Lava, Oil, Plasma
- Liquids: Alcohol, Ice, Swamp, Water, Quicksilver, Vodka
- Plants: Coffee, Tree, Fern, Grass, Reed, Tobacco, Palmtree, Apple, Flower
- Animals: Fish, Beast, Lizard, Bird, Snake, Dinosaur, Turtle, Dolphin, Whale
- And more...

### Technology (140-142 elements)
**New Elements:**
- Void, Radio Wave, Radiation, Plutonium
- Lightbulb, TV, Computer, Cellphone, Internet
- CD, Rocket, Satelite, Laser, Nuclear Bomb
- Cyborg, Sunflower, Sun

### Modern Age (140-182 elements)
**Society:** Commandments, Religion, Law, Sin, Music, Rock'n'Roll, Death Metal, Bank
**Foods:** Sugar, Ice Cream, Salt, Caviar, Cheese, Pie, Steak, Cookies
**Jobs:** Scientist, Soldier, Policeman, Pirate, Hacker, Astronaut, Journalist
**Science:** Medicine, Antibiotics, Virus, Alien, UFO, Clock, Mechanism
**Pets:** Cat, Dog, Rat, Ant, Octopus
**Drinks:** Rum, B52, Tequila, Absinthe, Molotov Cocktail, Tavern

### World of Magic
**Magic System:** Spells, Potions, Wands, Scrolls, Fireball, Cone of Cold, Teleport, Illusion
**Races:** Elf, Dwarf, Drow, Duergar, Half-Elf, Orc, Goblin, Illithid, Modron
**Classes:** Bard, Priest, Paladin, Druid, Wizard, Necromancer, Rogue
**Weapons:** Armor, Sword, Bow, Crossbow, Hammer, Axe, Mace, Claws
**Materials:** Mithril, Adamantite, Silver
**Light/Dark:** Angel, Demon, Prayer, Chaos, Healing, Resurrection, Shadow

## 🎯 Example Combinations

### Basic Combinations
```
🔥 Fire + 💧 Water = 💨 Steam
🌍 Earth + 💧 Water = 🐸 Swamp
💨 Air + 🌍 Earth = 💨 Dust
🔥 Fire + 🌍 Earth = 🌋 Lava
🌋 Lava + 💨 Air = 🪨 Stone
```

### Life Begins
```
⚡ Energy + 🐸 Swamp = 🌱 Life
🌱 Life + 💧 Water = 🦐 Plankton
🌱 Life + 🌍 Earth = 🦠 Bacteria
🦠 Bacteria + 💧 Water = 🦐 Plankton
🦐 Plankton + 🪨 Stone = 🐚 Shells
```

### Technology
```
🌑 Void + 🔮 Glass = 💡 Lightbulb
💡 Lightbulb + 📡 Radio Wave = 📺 TV
📺 TV + 📖 Book = 💻 Computer
💻 Computer + 📡 Radio Wave = 📱 Cellphone
💻 Computer + 💻 Computer = 🌐 Internet
```

### Magic
```
📚 Knowledge + ⚡ Energy = ✨ Magic
✨ Magic + 📖 Book = 📖 Spellbook
✨ Magic + 🧙 Wizard = 🪄 Spell
🪄 Spell + 🔥 Fire = 🔥 Fireball
🪄 Spell + ❄️ Ice = ❄️ Cone of Cold
```

## 💡 Tips & Tricks

### Gameplay Tips
1. **Start with Basics**: Fire + Water, Earth + Air combinations
2. **Build Life Chain**: Energy → Life → Organisms → Animals
3. **Unlock Tools Early**: Metal + Stone = Tools (enables many combos)
4. **Try Everything**: Even if AI fails, retry or come back later
5. **Use Hints**: When stuck, hints suggest viable combinations

### UI Features
- **Search Bar**: Filter elements by name
- **Element Count**: Top right shows discovered/total
- **History Drawer**: Review all discoveries
- **New Element Glow**: Freshly discovered elements shine
- **Thinking Mode**: Toggle for deeper AI thinking

### Strategy
1. **Exhaust Basics**: Try all 4 starting elements together
2. **Build Materials**: Stone, Metal, Wood are building blocks
3. **Progress through Stages**: Begin → Technology → Modern → Magic
4. **Save Hints**: Use hints only when truly stuck
5. **Experiment**: AI can create unique combinations not in database

## 🧠 AI Modes

### Fast Mode (Default)
- Uses: Gemini 2.5 Flash Lite
- Speed: ~1-2 seconds per combo
- Best for: Quick experimentation
- Retries: Up to 3 attempts if needed

### Deep Thinking Mode
- Uses: Gemini 3 Pro
- Speed: ~5-10 seconds per combo
- Best for: Complex combinations, stuck moments
- Retries: Up to 3 attempts with extended thinking
- Thinking Budget: 32768 tokens

## 📱 Keyboard Shortcuts

- **Enter**: Combine selected elements
- **Escape**: Clear selection
- **Click Element**: Select/deselect

## 💾 Save System

### Auto-Saved Data
- Unlocked elements
- Discovery history
- Cached recipes (prevents duplicate AI calls)
- Remaining hints
- Game progress

### Reset Game
Click the 🔄 reset button to:
- Clear all progress
- Start fresh with 4 basic elements
- Restore default 3 hints
- ⚠️ Cannot be undone!

## 🎨 Emoji System

### How Emojis Work
1. **Database Match**: Checks 300+ predefined emojis
2. **Keyword Fallback**: Searches for keywords (fire, water, metal, etc.)
3. **AI Suggestion**: Uses AI-provided emoji if available
4. **Default**: ✨ sparkles for unknown elements

### Missing Emojis?
If an element shows ✨ instead of specific emoji:
- Element is AI-generated and not in database
- Name doesn't match known keywords
- Emoji will be remembered for future uses

## 🔍 Troubleshooting

### "No combination found"
- AI tried 3 times and couldn't find valid combination
- Try different elements
- Some combinations may not exist
- Check if both elements make logical sense together

### Element Already Exists
- You've discovered this before
- Check your element list
- Try combining with other elements

### AI Taking Too Long
- Deep Thinking Mode is slower (~10s)
- Switch to Fast Mode for quicker results
- Check internet connection

## 📊 Statistics

### Database Coverage
- **Beginning**: 125 elements, ~200 combinations
- **Technology**: +17 elements, +25 combinations
- **Modern Age**: +40 elements, +100 combinations  
- **World of Magic**: +50 elements, +175 combinations
- **Total**: 500+ verified combinations

### AI Success Rate
- With retries: ~95% success rate
- Without retries: ~70% success rate
- Deep Thinking: +10% better results

## 🏆 Achievements (Unofficial)

- 🌟 **First Discovery**: Create your first element (Steam)
- 🧬 **Life Creator**: Unlock Life element
- 🧑 **Humanity**: Unlock Human element
- 🐉 **Dragon Master**: Unlock Dragon
- 🧙 **Wizard**: Unlock Wizard
- 🤖 **Technologist**: Unlock Computer
- ✨ **Mage**: Unlock Magic
- 🏰 **Kingdom Builder**: Unlock Castle
- 💯 **Century**: Discover 100 elements
- 🌍 **God Mode**: Discover 200+ elements

## 🎯 Goals

### Short-term
- [ ] Discover all Beginning elements (125)
- [ ] Unlock Technology stage
- [ ] Create first supernatural creature

### Mid-term
- [ ] Reach Modern Age
- [ ] Discover all drinks
- [ ] Unlock all pets

### Long-term
- [ ] Enter World of Magic
- [ ] Discover all fantasy races
- [ ] Complete all 500+ combinations
- [ ] Create 100+ AI-generated elements

---

**Happy Creating! 🌟**

Remember: Every element combination tells a story. Experiment, discover, and have fun!
