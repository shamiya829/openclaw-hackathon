# 🍣 Sushi Master AI — Menu Brain

A comprehensive restaurant staff training platform with AI-powered menu knowledge assessment and customer service practice.

## Features

- **🎓 Trainee Mode**: Interactive chat with AI to practice menu knowledge
  - Real-time responses about menu items, allergies, and customizations
  - "Check Answer" feature to evaluate server responses
  - Instant feedback on accuracy

- **▶ Demo Mode**: One-click walkthrough of all features
  - 6-step scenario from allergy query to order customization
  - Shows real AI responses in action

- **⚙ Manager Mode**: Full menu management interface
  - Add/edit/delete menu items
  - Search and filter items by category
  - View customer review insights
  - AI-powered analysis of improvement areas

- **📊 Knowledge Assessment**: Personalized training profiles
  - 5-question quiz to assess staff knowledge
  - Adaptive training based on weak areas
  - Progress tracking and skill visualization

- **📤 JSON Menu Import**: Easy menu customization
  - Import custom restaurant menus from JSON files
  - Use provided `menu.json` as a template
  - Full support for items, categories, allergens, and substitutions

## Getting Started

### 1. Open the Application

Open `index.html` in your browser.

### 2. Add Your Groq API Key

1. Get a free API key from [Groq Console](https://console.groq.com)
2. Paste it in the "Groq API key…" field in the top bar
3. It's saved locally for your session

### 3. Import Your Menu (Optional)

Click the **📤 Load JSON** button to import your custom menu:

```json
{
  "restaurant": "Your Restaurant Name",
  "tagline": "Your Tagline",
  "address": "Your Address",
  "menu": [
    {
      "name": "Item Name",
      "category": "rolls",
      "description": "Short description",
      "ingredients": ["ingredient1", "ingredient2"],
      "allergens": ["allergen1", "allergen2"],
      "cooked_option": false,
      "substitutions": [
        {
          "option": "no raw fish",
          "price_change": 1.50
        }
      ],
      "price": "$12",
      "tags": ["popular", "spicy"]
    }
  ]
}
```

### Menu JSON Format

**Required Fields:**
- `name` - Item name
- `price` - Price (e.g., "$12" or "$9.99")
- `category` - One of: nigiri, sashimi, rolls, specialty_rolls, bowls, appetizers, soup, sides, sake, beer, drinks
- `description` - Short description (max 80 chars)

**Optional Fields:**
- `ingredients` - Array of ingredients
- `allergens` - Array of allergens (raw fish, shellfish, dairy, gluten, soy, egg, peanuts, sesame, tree nuts)
- `cooked_option` - true/false/ask to allow cooked alternatives
- `substitutions` - Array of customizations with price adjustments
- `tags` - Array of tags (popular, spicy, light, vegetarian, vegan, premium, cooked, etc.)

## File Structure

```
openclaw-hackathon/
├── index.html          # Main HTML structure
├── styles.css          # All styling (sushi theme)
├── config.js           # Menu data, categories, quiz questions
├── api.js              # Groq API integration
├── app.js              # UI logic and functionality
├── menu.json           # Sample menu (customize and import)
└── README.md           # This file
```

## Usage Guide

### Trainee Mode

**Assist Tab:**
- Click the miso soup button 🍲 or type a question
- Ask anything about the menu: "What's gluten-free?", "I want something spicy"
- AI provides responses based on your restaurant's menu

**Check Answer Tab:**
- Type a customer question
- Enter a server's answer
- AI evaluates if it's correct and provides feedback

### Demo Mode

Click **Run Demo 🍣** to see a complete 6-step scenario:
1. Load menu
2. Handle allergy query
3. Recommend popular items
4. Suggest soup pairing
5. Evaluate server answer (trainer mode)
6. Handle customization request

### Manager Mode

**Menu Items Tab:**
- Search items by name or category
- Click **Edit** to modify an item
- Click **Del** to remove an item
- Click **+ Add Item** to create new items
- View JSON preview with "Toggle JSON" button

**Reviews Intel Tab:**
- View aggregate review statistics
- See top strengths to maintain
- Get AI recommendations for improvements

## Customization Tips

1. **Brand Your Theme**: Edit the sushi emoji 🍣 in `index.html` header to match your restaurant

2. **Modify Categories**: Edit `CAT_LABELS` in `config.js` to match your menu structure

3. **Update Quiz**: Modify `QUIZ_QUESTIONS` in `config.js` for your specific menu knowledge areas

4. **Change Colors**: In `styles.css`, update the `:root` CSS variables:
   - `--accent`: Primary brand color (currently red for sushi theme)
   - `--bg`: Dark background
   - `--text`: Light text

## Keyboard Shortcuts

- **Enter** in chat input: Send message
- **Enter** in trainer answer box: Check answer
- **📤 Load JSON**: Import custom menu

## Example Custom Menus

### French Restaurant
```json
{
  "restaurant": "🥐 La Maison",
  "menu": [
    {
      "name": "Coq au Vin",
      "category": "mains",
      "description": "Chicken braised in red wine",
      "ingredients": ["chicken", "red wine", "mushrooms"],
      "allergens": ["gluten"],
      "cooked_option": true,
      "price": "$24",
      "tags": ["popular", "classic"]
    }
  ]
}
```

### Vegetarian Cafe
```json
{
  "restaurant": "🥗 Green Leaf",
  "menu": [
    {
      "name": "Buddha Bowl",
      "category": "bowls",
      "description": "Seasonal vegetables with tahini",
      "ingredients": ["kale", "quinoa", "tahini"],
      "allergens": ["sesame"],
      "cooked_option": true,
      "price": "$14",
      "tags": ["vegan", "healthy", "popular"]
    }
  ]
}
```

## Troubleshooting

**"Invalid JSON" error:**
- Use a JSON validator (jsonlint.com) to check your menu file
- Ensure all field names are lowercase with underscores

**No responses from AI:**
- Check your Groq API key is valid
- Verify internet connection
- Check browser console for errors

**Menu won't import:**
- Download `menu.json` as a template
- Ensure your JSON has `restaurant`, `tagline`, `address`, and `menu` array
- Use UTF-8 encoding

## Keyboard Shortcuts & UI Tips

- **Miso soup button 🍲**: Quick sample question about pairings
- **Toggle JSON**: Switch menu view to JSON structure
- **Color indicators**: 
  - Red accent = open/available
  - Green = correct answers
  - Blue = popular items

## Privacy & Data

- API key stored in browser localStorage only
- No menu data sent to external servers (except Groq API)
- All conversation history stored locally
- Clear browser data to reset all settings

## Support

For menu import issues, verify:
1. JSON is valid
2. All items have `name`, `price`, and `category`
3. Categories match your CAT_LABELS
4. File is UTF-8 encoded

---

**Made with ❤️ for restaurant training teams**
