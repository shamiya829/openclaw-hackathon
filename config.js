// ─────────────────────────────────
// CONFIG - SUSHI RESTAURANT
// ─────────────────────────────────

const GROQ_MODEL = 'llama-3.3-70b-versatile';

// Default sushi menu
let MENU = {
  restaurant: "🍣 Sushi Master",
  tagline: "Tokyo-Inspired Craftsmanship",
  address: "123 Sake Street, Your City",
  menu: [
    // ── NIGIRI ──
    { name:"Toro (Fatty Tuna)", category:"nigiri", description:"Premium fatty tuna belly", ingredients:["fatty tuna","rice"], allergens:["raw fish"], cooked_option:false, substitutions:[], price:"$8", tags:["premium","popular"] },
    { name:"Maguro (Lean Tuna)", category:"nigiri", description:"Clean, lean tuna", ingredients:["tuna","rice"], allergens:["raw fish"], cooked_option:false, substitutions:[], price:"$6", tags:["classic"] },
    { name:"Sake (Salmon)", category:"nigiri", description:"Fresh Atlantic salmon", ingredients:["salmon","rice"], allergens:["raw fish"], cooked_option:false, substitutions:[], price:"$7", tags:["popular"] },
    { name:"Ebi (Shrimp)", category:"nigiri", description:"Sweet cooked shrimp", ingredients:["shrimp","rice"], allergens:["shellfish"], cooked_option:true, substitutions:[], price:"$5", tags:["cooked"] },
    { name:"Tamago (Egg)", category:"nigiri", description:"Sweet omelette", ingredients:["egg","rice"], allergens:["egg"], cooked_option:true, substitutions:[], price:"$4", tags:["vegetarian","cooked"] },
    { name:"Cucumber", category:"nigiri", description:"Crisp cucumber", ingredients:["cucumber","rice"], allergens:[], cooked_option:true, substitutions:[], price:"$3", tags:["vegetarian","vegan"] },
    { name:"Avocado", category:"nigiri", description:"Creamy avocado", ingredients:["avocado","rice"], allergens:[], cooked_option:true, substitutions:[], price:"$4", tags:["vegetarian","vegan"] },
    { name:"Ikura (Salmon Roe)", category:"nigiri", description:"Salmon eggs with pop", ingredients:["salmon roe","rice"], allergens:["raw fish"], cooked_option:false, substitutions:[], price:"$9", tags:["premium","popular"] },

    // ── SASHIMI ──
    { name:"Toro Sashimi", category:"sashimi", description:"3 pieces of fatty tuna", ingredients:["fatty tuna"], allergens:["raw fish"], cooked_option:false, substitutions:[], price:"$12", tags:["premium","popular"] },
    { name:"Salmon Sashimi", category:"sashimi", description:"3 pieces of fresh salmon", ingredients:["salmon"], allergens:["raw fish"], cooked_option:false, substitutions:[], price:"$10", tags:["popular"] },
    { name:"Assorted Sashimi", category:"sashimi", description:"6 pieces: tuna, salmon, white fish", ingredients:["tuna","salmon","white fish"], allergens:["raw fish"], cooked_option:false, substitutions:[], price:"$18", tags:["premium","popular"] },

    // ── ROLLS ──
    { name:"California Roll", category:"rolls", description:"Crab, avocado, cucumber, rice outside", ingredients:["crab","avocado","cucumber","rice"], allergens:["shellfish"], cooked_option:true, substitutions:[{option:"imitation crab",price_change:0}], price:"$9", tags:["popular","beginner-friendly"] },
    { name:"Spicy Tuna Roll", category:"rolls", description:"Tuna, sriracha, cucumber, mayo", ingredients:["tuna","sriracha","cucumber","mayo"], allergens:["raw fish","egg"], cooked_option:false, substitutions:[{option:"cooked tuna (+$1)",price_change:1}], price:"$10", tags:["spicy","popular"] },
    { name:"Philadelphia Roll", category:"rolls", description:"Salmon, cream cheese, cucumber", ingredients:["salmon","cream cheese","cucumber","rice"], allergens:["raw fish","dairy"], cooked_option:false, substitutions:[], price:"$11", tags:["popular"] },
    { name:"Cucumber Roll", category:"rolls", description:"Fresh cucumber, sesame seeds", ingredients:["cucumber","rice","sesame"], allergens:[], cooked_option:true, substitutions:[], price:"$5", tags:["vegetarian","vegan","light"] },
    { name:"Avocado Roll", category:"rolls", description:"Creamy avocado, rice outside", ingredients:["avocado","rice"], allergens:[], cooked_option:true, substitutions:[], price:"$6", tags:["vegetarian","vegan"] },
    { name:"Dragon Roll", category:"rolls", description:"Shrimp tempura, avocado, cucumber, eel sauce", ingredients:["shrimp","avocado","cucumber","eel sauce","rice"], allergens:["shellfish","gluten"], cooked_option:true, substitutions:[], price:"$14", tags:["premium","popular"] },
    { name:"Smoked Salmon Roll", category:"rolls", description:"Smoked salmon, cream cheese, dill", ingredients:["smoked salmon","cream cheese","dill","rice"], allergens:["dairy","fish"], cooked_option:true, substitutions:[], price:"$10", tags:["cooked"] },

    // ── SPECIALTY ROLLS ──
    { name:"Rainbow Roll", category:"specialty_rolls", description:"California roll topped with assorted sashimi", ingredients:["crab","avocado","cucumber","tuna","salmon","white fish","rice"], allergens:["shellfish","raw fish"], cooked_option:false, substitutions:[], price:"$16", tags:["premium","popular"] },
    { name:"Tempura Shrimp Roll", category:"specialty_rolls", description:"Crispy fried shrimp, avocado, mayo", ingredients:["shrimp","avocado","mayo","rice"], allergens:["shellfish","egg"], cooked_option:true, substitutions:[], price:"$13", tags:["popular"] },
    { name:"Volcano Roll", category:"specialty_rolls", description:"Spicy tuna on top of California roll", ingredients:["spicy tuna","crab","avocado","cucumber","rice"], allergens:["shellfish","raw fish"], cooked_option:false, substitutions:[], price:"$14", tags:["spicy"] },
    { name:"Spider Roll", category:"specialty_rolls", description:"Soft shell crab, avocado, cucumber", ingredients:["soft shell crab","avocado","cucumber","rice"], allergens:["shellfish"], cooked_option:true, substitutions:[], price:"$15", tags:["premium"] },

    // ── BOWLS ──
    { name:"Poke Bowl - Ahi Tuna", category:"bowls", description:"Marinated tuna over rice with veggies", ingredients:["ahi tuna","sushi rice","edamame","cucumber","radish"], allergens:["raw fish","soy"], cooked_option:false, substitutions:[{option:"cooked instead (+$2)",price_change:2}], price:"$14", tags:["popular","filling"] },
    { name:"Teriyaki Chicken Bowl", category:"bowls", description:"Glazed chicken over rice with vegetables", ingredients:["chicken","sushi rice","teriyaki","edamame","cucumber"], allergens:["gluten","soy"], cooked_option:true, substitutions:[], price:"$12", tags:["cooked","popular","filling"] },
    { name:"Vegetarian Buddha Bowl", category:"bowls", description:"Assorted veggies, edamame, avocado", ingredients:["edamame","avocado","cucumber","carrots","pickled ginger","rice"], allergens:[], cooked_option:true, substitutions:[], price:"$11", tags:["vegetarian","vegan","healthy"] },

    // ── APPETIZERS ──
    { name:"Edamame", category:"appetizers", description:"Steamed soybeans with sea salt", ingredients:["edamame","salt"], allergens:["soy"], cooked_option:true, substitutions:[], price:"$4", tags:["vegetarian","vegan","light"] },
    { name:"Gyoza", category:"appetizers", description:"6 pan-fried pork dumplings", ingredients:["pork","dumpling wrapper","soy sauce"], allergens:["gluten","soy","pork"], cooked_option:true, substitutions:[{option:"vegetarian (+$1)",price_change:1}], price:"$6", tags:["cooked","popular"] },
    { name:"Spring Roll", category:"appetizers", description:"2 crispy spring rolls with peanut sauce", ingredients:["rice wrapper","vegetables","peanut sauce"], allergens:["peanuts","gluten"], cooked_option:true, substitutions:[], price:"$5", tags:["cooked"] },
    { name:"Tempura Vegetables", category:"appetizers", description:"Zucchini, mushroom, carrot tempura", ingredients:["zucchini","mushroom","carrot","tempura batter"], allergens:["gluten","egg"], cooked_option:true, substitutions:[], price:"$7", tags:["vegetarian","cooked"] },

    // ── SOUP ──
    { name:"Miso Soup", category:"soup", description:"Tofu, seaweed, green onion", ingredients:["miso","tofu","seaweed","green onion"], allergens:["soy","gluten"], cooked_option:true, substitutions:[], price:"$3", tags:["light","classic","popular"] },
    { name:"Miso Soup with Clams", category:"soup", description:"Fresh littleneck clams in miso", ingredients:["miso","clams","seaweed","green onion"], allergens:["soy","gluten","shellfish"], cooked_option:true, substitutions:[], price:"$5", tags:["cooked","premium"] },

    // ── SIDES ──
    { name:"Ginger Pickled", category:"sides", description:"Sweet pickled ginger", ingredients:["ginger"], allergens:[], cooked_option:true, substitutions:[], price:"$2", tags:["condiment","vegan"] },
    { name:"Wasabi", category:"sides", description:"Hot Japanese horseradish", ingredients:["wasabi"], allergens:[], cooked_option:true, substitutions:[], price:"$1", tags:["condiment","vegan","spicy"] },
    { name:"Seaweed Salad", category:"sides", description:"Sesame seaweed", ingredients:["seaweed","sesame","soy sauce"], allergens:["soy","sesame"], cooked_option:true, substitutions:[], price:"$5", tags:["light","vegan"] },

    // ── SAKE ──
    { name:"Sake Nigori", category:"sake", description:"Sweet, cloudy sake", ingredients:["rice","koji"], allergens:[], cooked_option:true, substitutions:[], price:"$12", tags:["sweet","popular"] },
    { name:"Sake Junmai", category:"sake", description:"Pure rice sake, dry", ingredients:["rice","koji"], allergens:[], cooked_option:true, substitutions:[], price:"$10", tags:["dry","classic"] },
    { name:"Sake Honjozo", category:"sake", description:"Balanced, versatile", ingredients:["rice","koji","alcohol"], allergens:[], cooked_option:true, substitutions:[], price:"$9", tags:["balanced"] },

    // ── BEER ──
    { name:"Asahi", category:"beer", description:"Japanese lager, crisp and clean", ingredients:["barley","hops"], allergens:["gluten"], cooked_option:true, substitutions:[], price:"$6", tags:["lager","popular"] },
    { name:"Sapporo", category:"beer", description:"Full-bodied Japanese beer", ingredients:["barley","hops"], allergens:["gluten"], cooked_option:true, substitutions:[], price:"$6", tags:["lager"] },
    { name:"Hitachino", category:"beer", description:"Japanese craft IPA", ingredients:["barley","hops"], allergens:["gluten"], cooked_option:true, substitutions:[], price:"$8", tags:["IPA","craft"] },

    // ── DRINKS ──
    { name:"Mango Smoothie", category:"drinks", description:"Fresh mango and yogurt", ingredients:["mango","yogurt"], allergens:["dairy"], cooked_option:true, substitutions:[{option:"vegan milk (+$1)",price_change:1}], price:"$7", tags:["sweet","light"] },
    { name:"Lychee Sparkling", category:"drinks", description:"Light, refreshing", ingredients:["lychee","sparkling water"], allergens:[], cooked_option:true, substitutions:[], price:"$5", tags:["light","refreshing","vegan"] },
    { name:"Green Tea", category:"drinks", description:"Hot or iced", ingredients:["green tea"], allergens:[], cooked_option:true, substitutions:[], price:"$3", tags:["light","hot","cold","vegan"] },
  ]
};

// Category labels with emojis
const CAT_LABELS = {
  nigiri:         '🍣 Nigiri',
  sashimi:        '🍖 Sashimi',
  rolls:          '🍱 Rolls',
  specialty_rolls:'⭐ Specialty Rolls',
  bowls:          '🥣 Bowls',
  appetizers:     '🥟 Appetizers',
  soup:           '🍲 Soup',
  sides:          '🍜 Sides',
  sake:           '🍶 Sake',
  beer:           '🍺 Beer',
  drinks:         '🥤 Drinks'
};

// Quiz questions for sushi knowledge
const QUIZ_QUESTIONS = [
  {
    q: "A guest asks: 'I can't eat raw fish.' Name THREE safe cooked options from Izumi's menu and one follow-up safety note you should always say.",
    topic: "raw_vs_cooked_guidance",
    hint: "Use clearly cooked categories/items and include allergy cross-contact caution"
  },
  {
    q: "A table orders a Bento Box and asks to swap out gyoza for edamame. What is the correct response based on menu policy, and what DOES come with every Bento Box?",
    topic: "bento_policy",
    hint: "Bento section has a strict substitution rule and fixed included items"
  },
  {
    q: "A customer wants New York Strip Teppanyaki and asks for fried rice instead of steamed rice. What upcharge should you quote? Also give the brown rice upcharge.",
    topic: "rice_upcharges",
    hint: "Several entree sections list rice substitution pricing"
  },
  {
    q: "Name TWO gluten-friendly items that are explicitly marked GF in Izumi's menu and one item that is NOT marked GF that you should confirm before promising.",
    topic: "gf_precision",
    hint: "Use only explicit GF labels from the menu text"
  },
  {
    q: "A party of 4 wants a sushi boat and asks which boat serves them best. Which Izumi boat is the best fit, and what are the stated serving ranges for Boats A, B, and C?",
    topic: "boat_serving_knowledge",
    hint: "Sushi Specials list serving counts for each boat"
  }
];

const QUIZ_TOPIC_LABELS = {
  raw_vs_cooked_guidance: 'Raw vs Cooked Guidance',
  bento_policy: 'Bento Policy',
  rice_upcharges: 'Rice Upcharges',
  gf_precision: 'GF Precision',
  boat_serving_knowledge: 'Boat Serving Knowledge'
};

// Build system prompt
function buildSystemPrompt() {
  return `You are an AI sushi restaurant assistant for ${MENU.restaurant}, serving "${MENU.tagline}" at ${MENU.address}.
You are expert in our entire menu below. Be concise, friendly, and accurate.
For allergen/dietary questions: be precise and always end with "confirm with our chef for cross-contamination."
Keep responses short (2–4 sentences max unless listing items). Never invent items not in the menu.

MENU:
${JSON.stringify(MENU, null, 2)}`;
}

// State
let currentMode  = 'trainee';
let subMode      = 'assist';
let convHistory  = [];
let demoRunning  = false;
let editingIndex = -1;
let menuView     = 'cards';
let mobilePanel  = 'left';

// API Key
let GROQ_KEY = localStorage.getItem('groq_key') || '';

function saveKey(val) {
  GROQ_KEY = val.trim();
  localStorage.setItem('groq_key', GROQ_KEY);
}

// JSON Import
function importMenuJSON() {
  document.getElementById('json-file-input').click();
}

document.getElementById('json-file-input').addEventListener('change', function(e) {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function(event) {
    try {
      const importedMenu = JSON.parse(event.target.result);
      if (importedMenu.menu && Array.isArray(importedMenu.menu)) {
        MENU = importedMenu;
        renderMgrList();
        renderMenu();
        showToast(`✅ Menu imported: ${MENU.menu.length} items loaded`);
      } else {
        alert('Invalid JSON format. Must have "menu" array with items.');
      }
    } catch(err) {
      alert('Invalid JSON: ' + err.message);
    }
  };
  reader.readAsText(file);
  this.value = '';
});
