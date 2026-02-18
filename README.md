# Infinite Alchemy

An alchemy puzzle game where you combine elements to discover new ones. All combinations and elements are defined in JSON files, making it easy to customize and extend!

## 🎮 Features

- **200+ Official Elements** from all game stages
- **500+ Combinations** from the original Doodle God wiki
- **26 Element Groups** with color-coded badges
- **4 Game Stages**: Beginning → Technology → Modern Age → World of Magic
- **Auto-save Progress** using localStorage
- **Combination History** tracking
- **Smart Filtering** by group and search
- **100% Offline** - No AI or internet required!
- **Easy to Customize** - All data in JSON files

## 🚀 Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

### Build

```bash
npm run build
```

## ✨ Customization

All game data is stored in JSON files for easy customization!

### Adding New Elements

Edit `data/elements.json`:

```json
{
  "elements": [
    {
      "name": "Your Element",
      "emoji": "🎨",
      "group": "Energy",
      "stage": "Beginning"
    }
  ]
}
```

**Available Groups:**
- Energy, Air, Earth, Fire, Liquids
- Invertebrates, Plants, Animals
- Tools, Ingredients, Resources, Human
- Transport, Supernatural, Technology
- Society, Foods, Jobs, Science, Pets, Drinks
- Beings, Arming, Bewitchment, Obscurity, Luminosity

**Available Stages:**
- Beginning
- Technology  
- Modern Age
- World of Magic

### Adding New Combinations

Edit `data/combinations.json`:

```json
{
  "combinations": [
    {
      "element1": "Fire",
      "element2": "Water",
      "result": "Steam"
    }
  ]
}
```

**Important Notes:**
- Element names must match exactly (case-sensitive)
- Order doesn't matter (Fire + Water = Water + Fire)
- The result must exist in `elements.json`
- You can use any emoji from the Unicode standard

## 📈 Game Stages

The game unlocks stages as you discover more elements:

- **Beginning** (0 elements): Start with Fire, Water, Earth, Air
- **Technology** (100 elements): Unlocks tech-related groups
- **Modern Age** (140 elements): Unlocks society and modern items
- **World of Magic** (180 elements): Unlocks magical elements and beings

## 📁 Project Structure

```
/
├── data/
│   ├── elements.json       # All element definitions
│   └── combinations.json   # All combination rules
├── services/
│   └── dataService.ts      # Data loading and lookup
├── components/
│   ├── CombinationArea.tsx
│   ├── ElementCard.tsx
│   ├── GroupFilter.tsx
│   └── HistoryDrawer.tsx
├── constants.ts            # Group configs and thresholds
├── types.ts               # TypeScript interfaces
└── App.tsx                # Main game logic
```

## 🎯 Why JSON-Based?

- ⚡ **Faster** - Instant lookups, no API calls
- 🔒 **Private** - No external services
- 💰 **Free** - No API costs
- ✏️ **Customizable** - Easy to edit and extend
- 📴 **Offline** - Works without internet
- 🌍 **Community** - Easy for users to contribute

## 🤝 Contributing

Want to add more combinations? Simply edit the JSON files and submit a PR!

1. Fork the repo
2. Edit `data/elements.json` or `data/combinations.json`
3. Test your changes with `npm run dev`
4. Submit a pull request

## 📜 License

MIT

## 🙏 Credits

Based on the original Doodle God game. All combinations sourced from the Doodle God community wiki.## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`
# Infinite-Alchemy
# Infinite-Alchemy
