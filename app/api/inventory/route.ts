import { NextResponse } from "next/server";
import { inventory } from "@/lib/data";
import type { InventoryItem } from "@/lib/types";

export async function GET() { return NextResponse.json({ items: inventory }); }

export async function POST(request: Request) {
  const body = await request.json();
  if (!body.name || !body.category || !body.unit || Number(body.quantity) < 0) return NextResponse.json({ error: "Name, category, quantity and unit are required." }, { status: 400 });
  const item: InventoryItem = { id: `inv-${Date.now()}`, name: body.name.trim(), category: body.category, quantity: Number(body.quantity), unit: body.unit, lowStockAt: Number(body.lowStockAt) || 0, expiresOn: body.expiresOn || "", updatedAt: new Date().toISOString() };
  inventory.unshift(item);
  return NextResponse.json({ item }, { status: 201 });
}

export async function PATCH(request: Request) {
  const body = await request.json();
  const item = inventory.find((entry) => entry.id === body.id);
  if (!item) return NextResponse.json({ error: "Ingredient not found." }, { status: 404 });
  if (body.quantity !== undefined) item.quantity = Math.max(0, Number(body.quantity));
  if (body.lowStockAt !== undefined) item.lowStockAt = Math.max(0, Number(body.lowStockAt));
  if (body.expiresOn !== undefined) item.expiresOn = body.expiresOn;
  item.updatedAt = new Date().toISOString();
  return NextResponse.json({ item });
}

export async function DELETE(request: Request) {
  const { id } = await request.json();
  const index = inventory.findIndex((entry) => entry.id === id);
  if (index < 0) return NextResponse.json({ error: "Ingredient not found." }, { status: 404 });
  inventory.splice(index, 1);
  return NextResponse.json({ ok: true });
}
