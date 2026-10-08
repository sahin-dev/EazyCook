"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { AlertTriangle, ArrowLeft, Bell, Boxes, CalendarClock, Check, ChevronRight, Home, ListTodo, MessageCircle, Minus, PackagePlus, Plus, Search, Settings, Trash2, X } from "lucide-react";
import { Logo } from "@/components/Logo";
import type { InventoryItem } from "@/lib/types";

const categories = ["All", "Produce", "Protein", "Pantry", "Dairy", "Spices"];
const blank = { name: "", category: "Produce", quantity: 1, unit: "kg", lowStockAt: 0.5, expiresOn: "" };

function daysUntil(value: string) {
  if (!value) return 999;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.ceil((new Date(`${value}T00:00:00`).getTime() - today.getTime()) / 86400000);
}

export default function InventoryPage() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(blank);
  const [toast, setToast] = useState("");

  useEffect(() => { fetch("/api/inventory").then((response) => response.json()).then((data) => setItems(data.items)); }, []);
  const visible = useMemo(() => items.filter((item) => (category === "All" || item.category === category) && item.name.toLowerCase().includes(query.toLowerCase())), [items, category, query]);
  const low = items.filter((item) => item.quantity <= item.lowStockAt).length;
  const expiring = items.filter((item) => daysUntil(item.expiresOn) <= 3).length;

  function notify(message: string) { setToast(message); window.setTimeout(() => setToast(""), 2800); }

  async function addItem() {
    const response = await fetch("/api/inventory", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    const data = await response.json();
    if (response.ok) { setItems((current) => [data.item, ...current]); setOpen(false); setForm(blank); notify(`${data.item.name} added to your pantry.`); }
  }

  async function adjust(item: InventoryItem, delta: number) {
    const quantity = Math.max(0, Number((item.quantity + delta).toFixed(2)));
    const response = await fetch("/api/inventory", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: item.id, quantity }) });
    const data = await response.json();
    if (response.ok) setItems((current) => current.map((entry) => entry.id === item.id ? data.item : entry));
  }

  async function remove(item: InventoryItem) {
    if (!window.confirm(`Remove ${item.name} from stock?`)) return;
    const response = await fetch("/api/inventory", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: item.id }) });
    if (response.ok) { setItems((current) => current.filter((entry) => entry.id !== item.id)); notify(`${item.name} removed.`); }
  }

  return <main className="cook-app">
    <aside className="cook-sidebar">
      <Logo />
      <nav>
        <Link href="/cook"><Home /> Overview</Link>
        <Link href="/cook#requests"><ListTodo /> Order requests</Link>
        <Link className="active" href="/cook/inventory"><Boxes /> My stock <span>{low}</span></Link>
        <Link href="/community"><MessageCircle /> Community</Link>
      </nav>
      <div className="sidebar-bottom"><Link href="/"><ArrowLeft /> Customer view</Link><a href="#settings"><Settings /> Settings</a><div className="cook-profile"><span>NR</span><div><strong>Nadia Rahman</strong><small>Verified home chef</small></div><ChevronRight /></div></div>
    </aside>
    <div className="cook-main">
      <header className="cook-topbar"><div><span className="mobile-cook-logo"><Logo /></span><p>Stock management</p></div><div><button className="notification"><Bell /><span /></button><div className="availability"><i /> Kitchen synced</div></div></header>
      <div className="cook-content inventory-content">
        <div className="welcome inventory-welcome"><div><span>KITCHEN INVENTORY</span><h1>Know what you can cook.</h1><p>Your stock is checked automatically before every order request reaches you.</p></div><button className="button dark" onClick={() => setOpen(true)}><PackagePlus /> Add ingredient</button></div>
        <section className="inventory-stats">
          <div><span className="stat-icon green"><Boxes /></span><p><small>Total ingredients</small><strong>{items.length}</strong><em>Across {new Set(items.map((item) => item.category)).size} categories</em></p></div>
          <div><span className="stat-icon saffron"><AlertTriangle /></span><p><small>Low stock</small><strong>{low}</strong><em>{low ? "Needs your attention" : "Everything looks good"}</em></p></div>
          <div><span className="stat-icon lilac"><CalendarClock /></span><p><small>Expiring soon</small><strong>{expiring}</strong><em>Within the next 3 days</em></p></div>
        </section>

        <section className="stock-panel">
          <div className="stock-toolbar"><div><h2>My ingredients</h2><p>Quantities update automatically when you accept an order.</p></div><label className="stock-search"><Search /><input placeholder="Search stock" value={query} onChange={(event) => setQuery(event.target.value)} /></label></div>
          <div className="stock-filters">{categories.map((name) => <button key={name} className={category === name ? "active" : ""} onClick={() => setCategory(name)}>{name}</button>)}</div>
          <div className="stock-table-wrap"><table className="stock-table"><thead><tr><th>Ingredient</th><th>On hand</th><th>Expiry</th><th>Status</th><th aria-label="Actions" /></tr></thead><tbody>
            {visible.map((item) => {
              const isLow = item.quantity <= item.lowStockAt;
              const days = daysUntil(item.expiresOn);
              const step = item.unit === "kg" || item.unit === "l" ? 0.1 : item.unit === "pcs" ? 1 : 50;
              return <tr key={item.id}><td><span className={`ingredient-dot ${item.category.toLowerCase()}`} /> <div><strong>{item.name}</strong><small>{item.category}</small></div></td><td><div className="stock-stepper"><button onClick={() => adjust(item, -step)}><Minus /></button><strong>{item.quantity} <small>{item.unit}</small></strong><button onClick={() => adjust(item, step)}><Plus /></button></div><small>Alert at {item.lowStockAt} {item.unit}</small></td><td><strong>{item.expiresOn ? new Intl.DateTimeFormat("en", { month: "short", day: "numeric" }).format(new Date(`${item.expiresOn}T12:00:00`)) : "—"}</strong><small>{days < 0 ? "Expired" : days <= 3 ? `${days} day${days === 1 ? "" : "s"} left` : "Fresh"}</small></td><td><span className={`stock-status ${isLow ? "low" : days <= 3 ? "soon" : "good"}`}>{isLow ? "Low stock" : days <= 3 ? "Use soon" : "In stock"}</span></td><td><button className="table-action" onClick={() => remove(item)} aria-label={`Remove ${item.name}`}><Trash2 /></button></td></tr>;
            })}
          </tbody></table>{visible.length === 0 && <div className="stock-empty">No ingredients match this view.</div>}</div>
        </section>
      </div>
    </div>

    {open && <div className="overlay modal-overlay" onMouseDown={(event) => event.target === event.currentTarget && setOpen(false)}><div className="custom-modal stock-modal"><button className="icon-button modal-close" onClick={() => setOpen(false)}><X /></button><div className="modal-intro"><span className="spark-icon"><PackagePlus /></span><span className="kicker">ADD TO STOCK</span><h2>New ingredient</h2><p>Add what is available in your kitchen so Hearthly can match the right orders.</p></div><div className="form-stack">
      <label className="form-field"><span>Ingredient name</span><input autoFocus placeholder="e.g. Basmati rice" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} /></label>
      <div className="form-row"><label className="form-field"><span>Category</span><select value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })}>{categories.slice(1).map((name) => <option key={name}>{name}</option>)}</select></label><label className="form-field"><span>Unit</span><select value={form.unit} onChange={(event) => setForm({ ...form, unit: event.target.value })}>{["kg", "g", "l", "ml", "pcs"].map((unit) => <option key={unit}>{unit}</option>)}</select></label></div>
      <div className="form-row"><label className="form-field"><span>Quantity</span><input type="number" min="0" step="0.1" value={form.quantity} onChange={(event) => setForm({ ...form, quantity: Number(event.target.value) })} /></label><label className="form-field"><span>Low-stock alert</span><input type="number" min="0" step="0.1" value={form.lowStockAt} onChange={(event) => setForm({ ...form, lowStockAt: Number(event.target.value) })} /></label></div>
      <label className="form-field"><span>Expiry date <em>Optional</em></span><input type="date" value={form.expiresOn} onChange={(event) => setForm({ ...form, expiresOn: event.target.value })} /></label>
    </div><button className="button primary full" disabled={!form.name} onClick={addItem}>Add to stock <PackagePlus /></button></div></div>}
    {toast && <div className="toast"><span><Check /></span>{toast}</div>}
  </main>;
}
