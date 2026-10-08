import { NextResponse } from "next/server";
import { menuItems, orders } from "@/lib/data";
import { deductInventory, rankChefs } from "@/lib/matching";
import type { Order } from "@/lib/types";

function earliestDelivery() {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() + 1);
  return date;
}

export async function GET() {
  return NextResponse.json({ orders });
}

export async function POST(request: Request) {
  const body = await request.json();
  const deliveryDate = new Date(`${body.deliveryDate}T00:00:00`);

  if (!body.mealName || !body.deliveryDate || !body.address) {
    return NextResponse.json({ error: "Meal, delivery date and address are required." }, { status: 400 });
  }
  if (Number.isNaN(deliveryDate.getTime()) || deliveryDate < earliestDelivery()) {
    return NextResponse.json({ error: "Orders must be placed at least one day before delivery." }, { status: 400 });
  }

  const order: Order = {
    id: `ORD-${Math.floor(3000 + Math.random() * 6000)}`,
    menuItemId: body.menuItemId,
    mealName: body.mealName,
    customerName: body.customerName || "Alex Morgan",
    deliveryDate: body.deliveryDate,
    servings: Number(body.servings) || 1,
    address: body.address,
    notes: body.notes || "",
    total: Number(body.total) || 0,
    status: "open",
    distance: "1.0 km",
    createdAt: new Date().toISOString(),
    ingredients: (menuItems.find((item) => item.id === body.menuItemId)?.ingredients || []).map((ingredient) => ({ ...ingredient, quantity: ingredient.quantity * (Number(body.servings) || 1) })),
    candidates: [],
    candidateIndex: 0,
    expiresAt: new Date(Date.now() + 20 * 60 * 1000).toISOString(),
  };

  order.candidates = rankChefs(order.ingredients);
  order.distance = order.candidates[0]?.distance || order.distance;
  order.status = order.candidates.length ? "open" : "unmatched";

  orders.unshift(order);
  return NextResponse.json({ order }, { status: 201 });
}

export async function PATCH(request: Request) {
  const body = await request.json();
  const order = orders.find((entry) => entry.id === body.id);
  if (!order) return NextResponse.json({ error: "Order not found." }, { status: 404 });

  if (body.action === "decline") {
    order.candidateIndex += 1;
    if (order.candidateIndex >= order.candidates.length) {
      order.status = "unmatched";
      order.cook = undefined;
    } else {
      order.status = "open";
      order.distance = order.candidates[order.candidateIndex].distance;
    }
    return NextResponse.json({ order });
  }

  order.status = body.status || "accepted";
  order.cook = body.cook || order.candidates[order.candidateIndex]?.name || "You";
  if (order.status === "accepted") deductInventory(order.ingredients);
  return NextResponse.json({ order });
}
