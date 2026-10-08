"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ArrowRight, Bell, Boxes, CalendarDays, Check, ChefHat, ChevronRight, CircleDollarSign, Clock3, Home, ListTodo, MapPin, MessageCircle, Settings, Star, Users } from "lucide-react";
import { Logo } from "@/components/Logo";
import type { Order } from "@/lib/types";

function dateLabel(value: string) {
  return new Intl.DateTimeFormat("en", { weekday: "long", month: "short", day: "numeric" }).format(new Date(`${value}T12:00:00`));
}

export default function CookDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState("");

  useEffect(() => { fetch("/api/orders").then((response) => response.json()).then((data) => setOrders(data.orders)).finally(() => setLoading(false)); }, []);
  const openOrders = useMemo(() => orders.filter((order) => order.status === "open" && order.candidates[order.candidateIndex]?.name === "Nadia Rahman"), [orders]);
  const myOrders = useMemo(() => orders.filter((order) => order.cook === "You" || order.cook === "Nadia Rahman"), [orders]);

  function flash(message: string) { setNotice(message); window.setTimeout(() => setNotice(""), 3200); }

  async function acceptOrder(id: string) {
    const response = await fetch("/api/orders", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, status: "accepted", cook: "Nadia Rahman" }) });
    const data = await response.json();
    if (response.ok) { setOrders((current) => current.map((order) => order.id === id ? data.order : order)); flash(`${id} accepted. Ingredients are now reserved.`); }
  }

  async function declineOrder(id: string) {
    const response = await fetch("/api/orders", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, action: "decline" }) });
    const data = await response.json();
    if (response.ok) { setOrders((current) => current.map((order) => order.id === id ? data.order : order)); flash("Request passed safely to the next matched chef."); }
  }

  return <main className="cook-app">
    <aside className="cook-sidebar">
      <Logo />
      <nav>
        <a className="active" href="#overview"><Home /> Overview</a>
        <a href="#requests"><ListTodo /> Order requests <span>{openOrders.length}</span></a>
        <Link href="/cook/inventory"><Boxes /> My stock</Link>
        <a href="#schedule"><CalendarDays /> My schedule</a>
        <Link href="/community"><MessageCircle /> Community</Link>
      </nav>
      <div className="sidebar-bottom"><Link href="/"><ArrowRight /> Customer view</Link><a href="#settings"><Settings /> Settings</a><div className="cook-profile"><span>NR</span><div><strong>Nadia Rahman</strong><small>Verified home chef</small></div><ChevronRight /></div></div>
    </aside>
    <div className="cook-main">
      <header className="cook-topbar"><div><span className="mobile-cook-logo"><Logo /></span><p>Home chef dashboard</p></div><div><button className="notification"><Bell /><span /></button><div className="availability"><i /> Accepting orders</div></div></header>
      <div className="cook-content" id="overview">
        <div className="welcome"><div><span>YOUR KITCHEN TODAY</span><h1>Good morning, Nadia.</h1><p>{openOrders.length} matched request{openOrders.length === 1 ? " is" : "s are"} waiting for your confirmation.</p></div><Link className="button dark" href="/cook/inventory"><Boxes /> Manage stock</Link></div>
        <section className="stat-grid">
          <div><span className="stat-icon saffron"><CircleDollarSign /></span><p><small>This week</small><strong>$186.00</strong><em>↑ 12% from last week</em></p></div>
          <div><span className="stat-icon green"><ChefHat /></span><p><small>Meals cooking</small><strong>{myOrders.length}</strong><em>For the next 2 days</em></p></div>
          <div><span className="stat-icon lilac"><Users /></span><p><small>Happy neighbours</small><strong>28</strong><em>6 ordered again</em></p></div>
          <div><span className="stat-icon yellow"><Star /></span><p><small>Your rating</small><strong>4.9</strong><em>From 46 reviews</em></p></div>
        </section>

        <section className="request-section" id="requests">
          <div className="dashboard-heading"><div><h2>Matched for your kitchen</h2><p>Recipes are compared with your live stock, distance and cooking capacity.</p></div><Link href="/cook/inventory">Review stock <ArrowRight /></Link></div>
          <div className="request-list">
            {loading ? <div className="dashboard-loading">Analysing nearby requests…</div> : openOrders.map((order) => {
              const candidate = order.candidates[order.candidateIndex];
              return <article className="request-card" key={order.id}>
                <div className="request-main">
                  <div className="request-meta"><span className="new-pill">MATCHED · {candidate.score}% FIT</span><small>{order.id}</small><span>·</span><small>{candidate.distance} away</small></div>
                  <h3>{order.mealName}</h3>
                  <div className="request-details"><span><CalendarDays /> {dateLabel(order.deliveryDate)}</span><span><Clock3 /> Dinner, 6–7 PM</span><span><Users /> {order.servings} servings</span></div>
                  <div className="match-summary"><div><span>Ingredient coverage</span><strong>{candidate.stockCoverage}%</strong></div><div className="match-bar"><i style={{ width: `${candidate.stockCoverage}%` }} /></div><p>{order.ingredients.map((ingredient) => `${ingredient.name} ${ingredient.quantity}${ingredient.unit}`).join(" · ")}</p></div>
                  <div className="preference"><strong>Chef’s note</strong><p>“{order.notes || "No special preferences."}”</p></div>
                  <div className="customer-row"><span>{order.customerName.split(" ").map((word) => word[0]).join("")}</span><div><strong>{order.customerName}</strong><small><Star fill="currentColor" /> 4.9 · 6 orders</small></div><p><MapPin /> {order.address}</p></div>
                </div>
                <div className="request-aside"><small>YOU’LL EARN</small><strong>${Math.round(order.total * 0.8)}</strong><span>${order.total} total · 20 min to reply</span><button onClick={() => acceptOrder(order.id)}>Accept & reserve stock <ArrowRight /></button><button className="decline" onClick={() => declineOrder(order.id)}>Pass to next chef</button></div>
              </article>;
            })}
            {!loading && openOrders.length === 0 && <div className="dashboard-loading">You’re all caught up. New matching requests will appear here.</div>}
          </div>
        </section>

        <section className="upcoming" id="schedule">
          <div className="dashboard-heading"><div><h2>Coming up in your kitchen</h2><p>Accepted meals with ingredients already reserved.</p></div></div>
          {myOrders.map((order) => <div className="upcoming-row" key={order.id}><div className="date-block"><strong>{new Date(`${order.deliveryDate}T12:00:00`).getDate()}</strong><span>{new Intl.DateTimeFormat("en", { month: "short" }).format(new Date(`${order.deliveryDate}T12:00:00`))}</span></div><div className="upcoming-info"><span className="status accepted">Accepted</span><h3>{order.mealName}</h3><p>{order.servings} servings · {order.customerName}</p></div><div className="upcoming-actions"><strong>${Math.round(order.total * 0.8)}</strong><button>View details <ChevronRight /></button></div></div>)}
        </section>
      </div>
    </div>
    {notice && <div className="toast"><span><Check /></span>{notice}</div>}
  </main>;
}
