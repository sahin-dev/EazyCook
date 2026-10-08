import type { CommunityPost, InventoryItem, MenuItem, Order } from "./types";

export const menuItems: MenuItem[] = [
  {
    id: "fish-bowl",
    name: "Lemon herb fish bowl",
    description: "Grilled river fish, turmeric rice, cucumber salad and bright herb chutney.",
    category: "Fish",
    price: 14,
    rating: 4.9,
    reviews: 48,
    cook: "Maya's kitchen",
    distance: "0.8 km",
    prepTime: "35 min",
    tags: ["High protein", "Gluten free"],
    visual: "fish",
    emoji: "🐟",
    ingredients: [
      { name: "River fish", quantity: 220, unit: "g" },
      { name: "Rice", quantity: 100, unit: "g" },
      { name: "Cucumber", quantity: 0.5, unit: "pcs" },
      { name: "Fresh herbs", quantity: 20, unit: "g" },
    ],
  },
  {
    id: "garden-thali",
    name: "Seasonal garden thali",
    description: "Three market vegetables, lentil dal, rice and hand-rolled flatbread.",
    category: "Vegetarian",
    price: 11,
    rating: 4.8,
    reviews: 63,
    cook: "Asha's table",
    distance: "1.2 km",
    prepTime: "30 min",
    tags: ["Vegetarian", "Seasonal"],
    visual: "veg",
    emoji: "🥬",
    ingredients: [
      { name: "Mixed vegetables", quantity: 300, unit: "g" },
      { name: "Red lentils", quantity: 80, unit: "g" },
      { name: "Rice", quantity: 90, unit: "g" },
      { name: "Flour", quantity: 70, unit: "g" },
    ],
  },
  {
    id: "chicken-curry",
    name: "Slow-cooked chicken curry",
    description: "Home-style chicken, roasted spices, aromatic rice and cooling raita.",
    category: "Chicken",
    price: 13,
    rating: 4.9,
    reviews: 81,
    cook: "Nadia cooks",
    distance: "1.7 km",
    prepTime: "45 min",
    tags: ["Family favourite", "Mild"],
    visual: "curry",
    emoji: "🍛",
    ingredients: [
      { name: "Chicken", quantity: 250, unit: "g" },
      { name: "Rice", quantity: 100, unit: "g" },
      { name: "Yogurt", quantity: 60, unit: "g" },
      { name: "Curry spices", quantity: 12, unit: "g" },
    ],
  },
  {
    id: "lentil-bowl",
    name: "Golden lentil comfort bowl",
    description: "Creamy red lentils, roasted pumpkin, greens and toasted seeds.",
    category: "Vegan",
    price: 10,
    rating: 4.7,
    reviews: 39,
    cook: "Reena's pantry",
    distance: "2.1 km",
    prepTime: "30 min",
    tags: ["Vegan", "Dairy free"],
    visual: "lentil",
    emoji: "🥣",
    ingredients: [
      { name: "Red lentils", quantity: 110, unit: "g" },
      { name: "Pumpkin", quantity: 180, unit: "g" },
      { name: "Spinach", quantity: 80, unit: "g" },
      { name: "Seeds", quantity: 15, unit: "g" },
    ],
  },
];

const tomorrow = () => {
  const date = new Date();
  date.setDate(date.getDate() + 1);
  return date.toISOString().slice(0, 10);
};

export const orders: Order[] = [
  {
    id: "ORD-2408", mealName: "Grilled fish, sautéed greens & rice", customerName: "Sofia R.", deliveryDate: tomorrow(), servings: 3,
    address: "18 Willow Street", notes: "Low spice, please. No peanuts.", total: 42, status: "open", distance: "0.7 km", createdAt: new Date().toISOString(),
    ingredients: [{ name: "River fish", quantity: 660, unit: "g" }, { name: "Rice", quantity: 300, unit: "g" }, { name: "Spinach", quantity: 240, unit: "g" }, { name: "Fresh herbs", quantity: 60, unit: "g" }],
    candidates: [
      { name: "Nadia Rahman", score: 96, stockCoverage: 100, distance: "0.7 km", missingIngredients: [] },
      { name: "Maya Patel", score: 88, stockCoverage: 92, distance: "1.1 km", missingIngredients: ["Fresh herbs"] },
      { name: "Asha Begum", score: 81, stockCoverage: 78, distance: "1.6 km", missingIngredients: ["River fish"] },
    ], candidateIndex: 0, expiresAt: new Date(Date.now() + 18 * 60 * 1000).toISOString(),
  },
  {
    id: "ORD-2409", mealName: "Vegetable curry & flatbread", customerName: "Noah K.", deliveryDate: tomorrow(), servings: 2,
    address: "5 Garden Lane", notes: "Vegan. Medium spice is perfect.", total: 24, status: "open", distance: "1.4 km", createdAt: new Date().toISOString(),
    ingredients: [{ name: "Mixed vegetables", quantity: 600, unit: "g" }, { name: "Flour", quantity: 140, unit: "g" }, { name: "Curry spices", quantity: 24, unit: "g" }],
    candidates: [
      { name: "Nadia Rahman", score: 91, stockCoverage: 100, distance: "1.4 km", missingIngredients: [] },
      { name: "Reena Das", score: 87, stockCoverage: 94, distance: "1.8 km", missingIngredients: ["Mixed vegetables"] },
    ], candidateIndex: 0, expiresAt: new Date(Date.now() + 12 * 60 * 1000).toISOString(),
  },
  {
    id: "ORD-2397", mealName: "Golden lentil comfort bowl", customerName: "Amelia T.", deliveryDate: tomorrow(), servings: 4,
    address: "22 Rose Court", notes: "Please pack the chutney separately.", total: 40, status: "accepted", distance: "1.1 km", createdAt: new Date().toISOString(), cook: "You",
    ingredients: [{ name: "Red lentils", quantity: 440, unit: "g" }, { name: "Pumpkin", quantity: 720, unit: "g" }, { name: "Spinach", quantity: 320, unit: "g" }, { name: "Seeds", quantity: 60, unit: "g" }],
    candidates: [{ name: "Nadia Rahman", score: 98, stockCoverage: 100, distance: "1.1 km", missingIngredients: [] }], candidateIndex: 0,
  },
];

export const inventory: InventoryItem[] = [
  { id: "inv-1", name: "River fish", category: "Protein", quantity: 1.8, unit: "kg", lowStockAt: 0.8, expiresOn: "2026-10-02", updatedAt: new Date().toISOString() },
  { id: "inv-2", name: "Chicken", category: "Protein", quantity: 2.4, unit: "kg", lowStockAt: 1, expiresOn: "2026-10-03", updatedAt: new Date().toISOString() },
  { id: "inv-3", name: "Rice", category: "Pantry", quantity: 6.5, unit: "kg", lowStockAt: 2, expiresOn: "2027-02-14", updatedAt: new Date().toISOString() },
  { id: "inv-4", name: "Red lentils", category: "Pantry", quantity: 1.2, unit: "kg", lowStockAt: 0.8, expiresOn: "2027-01-20", updatedAt: new Date().toISOString() },
  { id: "inv-5", name: "Mixed vegetables", category: "Produce", quantity: 1.4, unit: "kg", lowStockAt: 0.7, expiresOn: "2026-10-04", updatedAt: new Date().toISOString() },
  { id: "inv-6", name: "Spinach", category: "Produce", quantity: 420, unit: "g", lowStockAt: 300, expiresOn: "2026-10-01", updatedAt: new Date().toISOString() },
  { id: "inv-7", name: "Fresh herbs", category: "Produce", quantity: 180, unit: "g", lowStockAt: 100, expiresOn: "2026-10-01", updatedAt: new Date().toISOString() },
  { id: "inv-8", name: "Flour", category: "Pantry", quantity: 3.2, unit: "kg", lowStockAt: 1, expiresOn: "2027-03-10", updatedAt: new Date().toISOString() },
  { id: "inv-9", name: "Curry spices", category: "Spices", quantity: 460, unit: "g", lowStockAt: 150, expiresOn: "2027-05-12", updatedAt: new Date().toISOString() },
  { id: "inv-10", name: "Yogurt", category: "Dairy", quantity: 750, unit: "g", lowStockAt: 300, expiresOn: "2026-10-05", updatedAt: new Date().toISOString() },
];

export const communityPosts: CommunityPost[] = [
  { id: "post-1", author: "Asha Begum", initials: "AB", role: "Verified home chef", createdAt: new Date(Date.now() - 42 * 60 * 1000).toISOString(), topic: "Kitchen tip", title: "The trick to softer hand-rolled flatbread", body: "Rest the dough twice: once before dividing and once after shaping the balls. That second ten-minute rest makes rolling effortless and keeps every flatbread tender.", imageTone: "saffron", emoji: "🫓", likes: 84, comments: 12 },
  { id: "post-2", author: "Maya Patel", initials: "MP", role: "Seafood specialist", createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(), topic: "Recipe", title: "My bright green chutney for grilled fish", body: "Coriander, mint, green chilli, lime and a spoon of yogurt. I keep it fresh and add salt only just before serving so the colour stays vibrant.", imageTone: "green", emoji: "🌿", likes: 126, comments: 21 },
  { id: "post-3", author: "Nadia Rahman", initials: "NR", role: "Verified home chef", createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(), topic: "Food story", title: "Cooking my mother’s curry for 20 neighbours", body: "My first large Hearthly order was intimidating, but the kitchen schedule and ingredient reservations made it feel manageable. The best part was reading everyone’s dinner-table notes afterward.", imageTone: "coral", emoji: "🍛", likes: 203, comments: 34 },
];
