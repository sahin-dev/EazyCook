import { NextResponse } from "next/server";
import { menuItems } from "@/lib/data";
import type { MenuItem } from "@/lib/types";

const ingredientDefaults: Record<string, MenuItem["ingredients"]> = {
  Fish: [{ name: "River fish", quantity: 220, unit: "g" }, { name: "Rice", quantity: 100, unit: "g" }, { name: "Fresh herbs", quantity: 20, unit: "g" }],
  Chicken: [{ name: "Chicken", quantity: 250, unit: "g" }, { name: "Rice", quantity: 100, unit: "g" }, { name: "Curry spices", quantity: 12, unit: "g" }],
  Vegetarian: [{ name: "Mixed vegetables", quantity: 300, unit: "g" }, { name: "Rice", quantity: 100, unit: "g" }, { name: "Curry spices", quantity: 12, unit: "g" }],
  Vegan: [{ name: "Red lentils", quantity: 110, unit: "g" }, { name: "Mixed vegetables", quantity: 200, unit: "g" }, { name: "Rice", quantity: 90, unit: "g" }],
};

export async function GET() {
  return NextResponse.json({ items: menuItems });
}

export async function POST(request: Request) {
  const body = await request.json();
  if (!body.name || !body.description || !body.category) {
    return NextResponse.json({ error: "Name, description and category are required." }, { status: 400 });
  }

  const item: MenuItem = {
    id: `custom-${Date.now()}`,
    name: body.name,
    description: body.description,
    category: body.category,
    price: Number(body.price) || 12,
    rating: 5,
    reviews: 0,
    cook: "Custom request",
    distance: "Nearby cooks",
    prepTime: "Matched after ordering",
    tags: [body.category, "Made for you"],
    visual: "custom",
    ingredients: ingredientDefaults[body.category] || ingredientDefaults.Vegetarian,
    emoji: body.emoji || "🍽️",
  };

  menuItems.unshift(item);
  return NextResponse.json({ item }, { status: 201 });
}
