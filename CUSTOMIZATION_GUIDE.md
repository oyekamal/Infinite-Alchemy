# Quick Customization Guide

## Adding Your Own Elements & Combinations

This game is fully customizable! Here's how to add your own content:

## 📝 Step 1: Add Elements

1. Open `data/elements.json`
2. Find the `"elements"` array
3. Add your new element at the end:

```json
{
  "name": "Your Element Name",
  "emoji": "🎨",
  "group": "Custom",
  "stage": "Beginning"
}
```

### Element Properties

- **name**: Display name (must be unique)
- **emoji**: Any Unicode emoji or symbol
- **group**: Category (see available groups below)
- **stage**: When it unlocks (Beginning, Technology, Modern Age, or World of Magic)

### Available Groups

- `Energy`, `Air`, `Earth`, `Fire`, `Liquids`
- `Invertebrates`, `Plants`, `Animals`
- `Tools`, `Ingredients`, `Resources`, `Human`
- `Transport`, `Supernatural`, `Technology`
- `Society`, `Foods`, `Jobs`, `Science`, `Pets`, `Drinks`
- `Beings`, `Arming`, `Bewitchment`, `Obscurity`, `Luminosity`
- `Custom` (for your own category)

## ⚗️ Step 2: Add Combinations

1. Open `data/combinations.json`
2. Find the `"combinations"` array
3. Add your new combination:

```json
{
  "element1": "Fire",
  "element2": "Your Element Name",
  "result": "Something New"
}
```

### Important Rules

✅ **DO:**
- Make sure `result` exists in `elements.json`
- Use exact element names (case-sensitive)
- Add a comma after the previous entry

❌ **DON'T:**
- Worry about order (Fire + Water = Water + Fire)
- Create circular combinations (A + B = A)
- Use elements that don't exist

## 🎮 Step 3: Test Your Changes

1. Save both JSON files
2. Refresh your browser (or it will auto-refresh)
3. Try your new combination!

## 💡 Example: Adding "Electricity"

### 1. Add to elements.json:

```json
{
  "name": "Electricity",
  "emoji": "⚡",
  "group": "Energy",
  "stage": "Beginning"
}
```

### 2. Add combinations.json:

```json
{
  "element1": "Metal",
  "element2": "Energy",
  "result": "Electricity"
},
{
  "element1": "Electricity",
  "element2": "Water",
  "result": "Storm"
}
```

### 3. Save & Refresh!

Now you can combine Metal + Energy to get Electricity! ⚡

## 🔍 Finding Emoji

Need emoji? Use these resources:
- [Emojipedia](https://emojipedia.org/) - Search any emoji
- [GetEmoji](https://getemoji.com/) - Copy/paste emoji
- Windows: Win + . (period)
- Mac: Cmd + Control + Space
- Linux: Ctrl + . or Ctrl + ;

## 🐛 Troubleshooting

### "Game won't load"
- Check for JSON syntax errors
- Make sure you didn't forget a comma
- Validate your JSON at [JSONLint](https://jsonlint.com/)

### "Combination doesn't work"
- Check spelling matches exactly in both files
- Make sure the result element exists
- Clear browser cache and refresh

### "Element shows as ✨"
- You used an element name in combinations that doesn't exist in elements
- Add the missing element to elements.json

## 🌟 Share Your Creations!

Created cool combinations? Share them!
1. Fork the repo on GitHub
2. Add your elements/combinations
3. Submit a Pull Request
4. Help the community grow!

## 📚 More Info

- See `README.md` for full documentation
- See `MIGRATION_SUMMARY.md` for technical details
- Check `constants.ts` for group colors and icons

Happy Creating! 🎨✨
