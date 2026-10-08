export type MenuItem = {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  rating: number;
  reviews: number;
  cook: string;
  distance: string;
  prepTime: string;
  tags: string[];
  visual: string;
  emoji: string;
  ingredients: IngredientRequirement[];
};

export type IngredientRequirement = {
  name: string;
  quantity: number;
  unit: "g" | "kg" | "ml" | "l" | "pcs";
};

export type ChefCandidate = {
  name: string;
  score: number;
  stockCoverage: number;
  distance: string;
  missingIngredients: string[];
};

export type Order = {
  id: string;
  menuItemId?: string;
  mealName: string;
  customerName: string;
  deliveryDate: string;
  servings: number;
  address: string;
  notes: string;
  total: number;
  status: "matching" | "open" | "accepted" | "preparing" | "ready" | "delivered" | "unmatched";
  distance: string;
  createdAt: string;
  cook?: string;
  ingredients: IngredientRequirement[];
  candidates: ChefCandidate[];
  candidateIndex: number;
  expiresAt?: string;
};

export type InventoryItem = {
  id: string;
  name: string;
  category: "Produce" | "Protein" | "Pantry" | "Dairy" | "Spices";
  quantity: number;
  unit: "g" | "kg" | "ml" | "l" | "pcs";
  lowStockAt: number;
  expiresOn: string;
  updatedAt: string;
};

export type CommunityPost = {
  id: string;
  author: string;
  initials: string;
  role: string;
  createdAt: string;
  topic: "Recipe" | "Kitchen tip" | "Food story" | "Question";
  title: string;
  body: string;
  imageTone: string;
  emoji: string;
  likes: number;
  comments: number;
  liked?: boolean;
};
