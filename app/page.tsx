"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight, CalendarDays, Check, ChevronDown, Clock3, Heart, MapPin,
  Menu, Minus, Plus, Search, ShieldCheck, ShoppingBag, Sparkles, Star, X,
} from "lucide-react";
import { Logo } from "@/components/Logo";
import type { MenuItem, Order } from "@/lib/types";

const categories = ["All meals", "Fish", "Vegetarian", "Chicken", "Vegan"];

function getTomorrow() {
  const date = new Date();
  date.setDate(date.getDate() + 1);
  return date.toISOString().slice(0, 10);
}

function prettyDate(value: string) {
  return new Intl.DateTimeFormat("en", { weekday: "short", month: "short", day: "numeric" }).format(new Date(`${value}T12:00:00`));
}

export default function Home() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("All meals");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<MenuItem | null>(null);
  const [customOpen, setCustomOpen] = useState(false);
  const [ordersOpen, setOrdersOpen] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [toast, setToast] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    fetch("/api/menu")
      .then((response) => response.json())
      .then((data) => setItems(data.items))
      .finally(() => setLoading(false));
  }, []);

  const visibleItems = useMemo(() => items.filter((item) => {
    const matchesCategory = category === "All meals" || item.category === category;
    const haystack = `${item.name} ${item.description} ${item.tags.join(" ")}`.toLowerCase();
    return matchesCategory && haystack.includes(query.toLowerCase());
  }), [items, category, query]);

  async function showOrders() {
    const response = await fetch("/api/orders");
    const data = await response.json();
    setOrders(data.orders);
    setOrdersOpen(true);
  }

  function notify(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(""), 3500);
  }

  return (
    <main>
      <header className="site-header">
        <div className="shell nav-inner">
          <Logo />
          <nav className={mobileOpen ? "nav-links open" : "nav-links"}>
            <a href="#meals" onClick={() => setMobileOpen(false)}>Explore meals</a>
            <button className="link-button" onClick={showOrders}>My orders</button>
            <Link href="/community">Community</Link>
            <Link href="/cook">For home cooks</Link>
          </nav>
          <div className="nav-actions">
            <button className="location-pill"><MapPin size={16} /> Willow Grove <ChevronDown size={14} /></button>
            <button className="avatar" aria-label="Profile">AM</button>
            <button className="mobile-menu" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle menu"><Menu /></button>
          </div>
        </div>
      </header>

      <section className="hero shell">
        <div className="hero-media">
          <Image src="/images/home-cooked-feast.png" alt="A welcoming spread of home-cooked fish, vegetables, rice and dal" fill priority sizes="(max-width: 800px) 100vw, 1200px" />
          <div className="hero-shade" />
          <div className="hero-copy">
            <div className="eyebrow"><Sparkles size={15} /> Cooked nearby. Made for you.</div>
            <h1>Dinner, made<br />around the corner.</h1>
            <p>Choose a local favourite or dream up your own meal. A talented home cook nearby will make it fresh for tomorrow.</p>
            <div className="hero-actions">
              <a className="button primary" href="#meals">Find a meal <ArrowRight size={17} /></a>
              <button className="button cream" onClick={() => setCustomOpen(true)}>Create your own</button>
            </div>
          </div>
          <div className="trust-card">
            <div className="avatar-stack"><span>MK</span><span>AR</span><span>NB</span></div>
            <div><strong>24 cooks near you</strong><small><Star size={12} fill="currentColor" /> 4.9 average rating</small></div>
          </div>
        </div>
      </section>

      <section className="promise-strip">
        <div className="shell promises">
          <div><span><CalendarDays /></span><p><strong>Plan it today</strong><small>Order at least a day ahead</small></p></div>
          <div><span><CookingIcon /></span><p><strong>Cooked at home</strong><small>By verified local cooks</small></p></div>
          <div><span><MapPin /></span><p><strong>Close by</strong><small>Fresher food, shorter trips</small></p></div>
          <div><span><ShieldCheck /></span><p><strong>Made with care</strong><small>Your preferences respected</small></p></div>
        </div>
      </section>

      <section className="meals-section shell" id="meals">
        <div className="section-heading">
          <div><span className="kicker">NEAR WILLOW GROVE</span><h2>What sounds good?</h2><p>Fresh menus from home cooks who live close by.</p></div>
          <button className="text-action" onClick={() => setCustomOpen(true)}>Can’t find it? Create a meal <ArrowRight size={16} /></button>
        </div>

        <div className="filters">
          <div className="category-list">
            {categories.map((name) => <button key={name} className={category === name ? "active" : ""} onClick={() => setCategory(name)}>{name}</button>)}
          </div>
          <label className="search-box"><Search size={17} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search meals" /></label>
        </div>

        <div className="meal-grid">
          {loading ? [1, 2, 3, 4].map((value) => <div className="meal-card skeleton" key={value} />) : visibleItems.map((item, index) => (
            <article className="meal-card" key={item.id}>
              <button className="heart" aria-label={`Save ${item.name}`}><Heart size={18} /></button>
              <div className={`meal-visual ${item.visual}`}>
                <span className="food-emoji">{item.emoji}</span>
                <div className="visual-dots" />
                {index === 0 && <span className="popular-badge">Neighbourhood pick</span>}
              </div>
              <div className="meal-content">
                <div className="meal-topline"><span>{item.category}</span><span><Star size={13} fill="currentColor" /> {item.rating} <em>({item.reviews})</em></span></div>
                <h3>{item.name}</h3>
                <p>{item.description}</p>
                <div className="tag-row">{item.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
                <div className="cook-line"><span className="mini-avatar">{item.cook.charAt(0)}</span><div><strong>{item.cook}</strong><small><MapPin size={12} /> {item.distance} · <Clock3 size={12} /> {item.prepTime}</small></div></div>
                <div className="card-footer"><div><small>from</small><strong>${item.price}<em> / serving</em></strong></div><button onClick={() => setSelected(item)}>Choose meal <ArrowRight size={15} /></button></div>
              </div>
            </article>
          ))}
        </div>
        {!loading && visibleItems.length === 0 && <div className="empty-state"><span>🥕</span><h3>No meals found</h3><p>Try a different search, or create exactly what you’re craving.</p><button className="button primary" onClick={() => setCustomOpen(true)}>Create a meal</button></div>}
      </section>

      <section className="custom-banner shell">
        <div><span className="kicker light">YOUR MEAL, YOUR WAY</span><h2>Craving something specific?</h2><p>Tell us the protein, vegetables, sides and flavours you love. We’ll share your request with nearby cooks and find the right match.</p><button className="button cream" onClick={() => setCustomOpen(true)}>Build my meal <ArrowRight size={17} /></button></div>
        <div className="ingredient-orbit" aria-hidden="true"><span>🐟</span><span>🥦</span><span>🍚</span><span>🌶️</span><div>🍽️</div></div>
      </section>

      <section className="how shell">
        <div className="section-heading"><div><span className="kicker">HOW IT WORKS</span><h2>Tomorrow’s meal, sorted.</h2></div></div>
        <div className="steps">
          <div><span>01</span><div className="step-icon">🥘</div><h3>Pick it or create it</h3><p>Choose a cook’s menu or describe the exact meal you want.</p></div>
          <div><span>02</span><div className="step-icon">🤝</div><h3>A cook accepts</h3><p>Your request goes to verified home cooks in your area.</p></div>
          <div><span>03</span><div className="step-icon">🛵</div><h3>Enjoy it fresh</h3><p>Your meal is prepared for your chosen time the next day.</p></div>
        </div>
      </section>

      <footer><div className="shell footer-inner"><Logo /><p>Good food lives closer than you think.</p><div><a href="#meals">Browse</a><Link href="/cook">Cook with us</Link><a href="#">Help</a></div><small>© 2026 Hearthly</small></div></footer>

      {selected && <OrderDrawer item={selected} onClose={() => setSelected(null)} onSuccess={(order) => { setSelected(null); notify(`${order.id} is confirmed! We’re finding your cook.`); }} />}
      {customOpen && <CustomMealModal onClose={() => setCustomOpen(false)} onCreated={(item) => { setItems((current) => [item, ...current]); setCustomOpen(false); setSelected(item); notify("Your meal is ready to order."); }} />}
      {ordersOpen && <OrdersDrawer orders={orders} onClose={() => setOrdersOpen(false)} />}
      {toast && <div className="toast"><span><Check size={16} /></span>{toast}</div>}
    </main>
  );
}

function CookingIcon() {
  return <span className="pot-icon">♨</span>;
}

function OrderDrawer({ item, onClose, onSuccess }: { item: MenuItem; onClose: () => void; onSuccess: (order: Order) => void }) {
  const [servings, setServings] = useState(2);
  const [deliveryDate, setDeliveryDate] = useState(getTomorrow());
  const [address, setAddress] = useState("18 Willow Street, Willow Grove");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const total = item.price * servings + 3;

  async function placeOrder() {
    setSubmitting(true); setError("");
    const response = await fetch("/api/orders", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ menuItemId: item.id, mealName: item.name, deliveryDate, servings, address, notes, total }) });
    const data = await response.json();
    setSubmitting(false);
    if (!response.ok) return setError(data.error);
    onSuccess(data.order);
  }

  return <div className="overlay" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
    <aside className="drawer">
      <div className="drawer-head"><div><span className="kicker">COMPLETE YOUR ORDER</span><h2>Almost yours.</h2></div><button className="icon-button" onClick={onClose}><X /></button></div>
      <div className="order-meal"><div className={`order-thumb ${item.visual}`}>{item.emoji}</div><div><span>{item.category}</span><h3>{item.name}</h3><small>by {item.cook}</small></div><strong>${item.price}</strong></div>
      <div className="form-stack">
        <div className="form-field"><label>How many servings?</label><div className="stepper"><button onClick={() => setServings(Math.max(1, servings - 1))}><Minus size={17} /></button><strong>{servings}</strong><button onClick={() => setServings(servings + 1)}><Plus size={17} /></button></div></div>
        <label className="form-field"><span>Delivery day <em>Earliest: tomorrow</em></span><input type="date" min={getTomorrow()} value={deliveryDate} onChange={(event) => setDeliveryDate(event.target.value)} /></label>
        <label className="form-field"><span>Delivery address</span><div className="input-with-icon"><MapPin size={17} /><input value={address} onChange={(event) => setAddress(event.target.value)} /></div></label>
        <label className="form-field"><span>Notes for your cook <em>Optional</em></span><textarea placeholder="Allergies, spice level, preferences…" value={notes} onChange={(event) => setNotes(event.target.value)} /></label>
      </div>
      <div className="price-breakdown"><p><span>{servings} servings</span><strong>${item.price * servings}</strong></p><p><span>Neighbourhood delivery</span><strong>$3</strong></p><p className="total"><span>Total</span><strong>${total}</strong></p></div>
      {error && <p className="form-error">{error}</p>}
      <button className="button primary full" disabled={submitting || !address} onClick={placeOrder}>{submitting ? "Placing order…" : `Place order · $${total}`} <ArrowRight size={17} /></button>
      <p className="secure-note"><ShieldCheck size={14} /> You won’t be charged until a cook accepts.</p>
    </aside>
  </div>;
}

function CustomMealModal({ onClose, onCreated }: { onClose: () => void; onCreated: (item: MenuItem) => void }) {
  const [category, setCategory] = useState("Fish");
  const [name, setName] = useState("Grilled fish with seasonal vegetables");
  const [description, setDescription] = useState("Lightly spiced fish with green vegetables, rice and a fresh herb sauce.");
  const [price, setPrice] = useState(14);
  const [submitting, setSubmitting] = useState(false);
  const choices = [{ name: "Fish", icon: "🐟" }, { name: "Chicken", icon: "🍗" }, { name: "Vegetarian", icon: "🥬" }, { name: "Vegan", icon: "🌱" }];
  const emoji = choices.find((choice) => choice.name === category)?.icon || "🍽️";

  async function createMeal() {
    setSubmitting(true);
    const response = await fetch("/api/menu", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name, description, category, price, emoji }) });
    const data = await response.json();
    setSubmitting(false);
    if (response.ok) onCreated(data.item);
  }

  return <div className="overlay modal-overlay" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
    <div className="custom-modal">
      <button className="icon-button modal-close" onClick={onClose}><X /></button>
      <div className="modal-intro"><span className="spark-icon"><Sparkles /></span><span className="kicker">CREATE A MEAL</span><h2>What are you craving?</h2><p>Give nearby cooks a clear picture. You can add final preferences when you order.</p></div>
      <div className="form-stack">
        <div className="form-field"><label>Start with a main</label><div className="choice-grid">{choices.map((choice) => <button key={choice.name} className={category === choice.name ? "active" : ""} onClick={() => setCategory(choice.name)}><span>{choice.icon}</span>{choice.name}<Check size={14} /></button>)}</div></div>
        <label className="form-field"><span>Name your meal</span><input value={name} onChange={(event) => setName(event.target.value)} /></label>
        <label className="form-field"><span>Describe it</span><textarea value={description} onChange={(event) => setDescription(event.target.value)} /></label>
        <label className="form-field budget"><span>Budget per serving</span><div><input type="range" min="8" max="28" value={price} onChange={(event) => setPrice(Number(event.target.value))} /><strong>${price}</strong></div></label>
      </div>
      <button className="button primary full" disabled={submitting || !name || !description} onClick={createMeal}>{submitting ? "Creating…" : "Create meal & continue"} <ArrowRight size={17} /></button>
    </div>
  </div>;
}

function OrdersDrawer({ orders, onClose }: { orders: Order[]; onClose: () => void }) {
  const customerOrders = orders.filter((order) => order.customerName === "Alex Morgan");
  return <div className="overlay" onMouseDown={(event) => event.target === event.currentTarget && onClose()}><aside className="drawer">
    <div className="drawer-head"><div><span className="kicker">YOUR ORDERS</span><h2>Meals on the way.</h2></div><button className="icon-button" onClick={onClose}><X /></button></div>
    {customerOrders.length ? <div className="order-list">{customerOrders.map((order) => <div className="customer-order" key={order.id}><div><span className={`status ${order.status}`}>{order.status}</span><small>{order.id}</small></div><h3>{order.mealName}</h3><p><CalendarDays size={15} /> {prettyDate(order.deliveryDate)} · {order.servings} servings</p><strong>${order.total}</strong></div>)}</div> : <div className="empty-orders"><ShoppingBag /><h3>No orders yet</h3><p>Your next home-cooked dinner will appear here.</p><button className="button primary" onClick={onClose}>Explore meals</button></div>}
  </aside></div>;
}
