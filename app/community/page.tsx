"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ArrowRight, Check, Heart, MessageCircle, PenLine, Search, Send, Sparkles, Users, X } from "lucide-react";
import { Logo } from "@/components/Logo";
import type { CommunityPost } from "@/lib/types";

const topics = ["All stories", "Recipe", "Kitchen tip", "Food story", "Question"];

function timeAgo(value: string) {
  const minutes = Math.max(1, Math.floor((Date.now() - new Date(value).getTime()) / 60000));
  if (minutes < 60) return `${minutes}m ago`;
  if (minutes < 1440) return `${Math.floor(minutes / 60)}h ago`;
  return `${Math.floor(minutes / 1440)}d ago`;
}

export default function CommunityPage() {
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [topic, setTopic] = useState("All stories");
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ topic: "Kitchen tip", title: "", body: "", emoji: "🍲" });
  const [toast, setToast] = useState("");

  useEffect(() => { fetch("/api/community").then((response) => response.json()).then((data) => setPosts(data.posts)); }, []);
  const visible = useMemo(() => posts.filter((post) => (topic === "All stories" || post.topic === topic) && `${post.title} ${post.body} ${post.author}`.toLowerCase().includes(query.toLowerCase())), [posts, topic, query]);

  async function publish() {
    const response = await fetch("/api/community", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    const data = await response.json();
    if (response.ok) { setPosts((current) => [data.post, ...current]); setOpen(false); setForm({ topic: "Kitchen tip", title: "", body: "", emoji: "🍲" }); setToast("Your story is live in the community."); window.setTimeout(() => setToast(""), 3000); }
  }

  async function like(id: string) {
    const response = await fetch("/api/community", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    const data = await response.json();
    if (response.ok) setPosts((current) => current.map((post) => post.id === id ? data.post : post));
  }

  return <main className="community-page">
    <header className="site-header"><div className="shell nav-inner"><Logo /><nav className="nav-links"><Link href="/">Explore meals</Link><Link className="community-active" href="/community">Community</Link><Link href="/cook">For home chefs</Link></nav><button className="button dark community-write" onClick={() => setOpen(true)}><PenLine /> Share a story</button></div></header>
    <section className="community-hero"><div className="shell"><div><span className="eyebrow"><Sparkles /> THE HEARTHLY TABLE</span><h1>Food tastes better<br />when stories are shared.</h1><p>Recipes, hard-earned kitchen wisdom and warm conversations from home chefs and food lovers in your neighbourhood.</p><button className="button primary" onClick={() => setOpen(true)}>Start a conversation <ArrowRight /></button></div><div className="community-hero-art"><span>🥘</span><span>🌿</span><span>🫓</span><div><strong>1,240</strong><small>neighbours sharing</small></div></div></div></section>
    <section className="community-shell shell">
      <div className="community-toolbar"><div className="stock-filters">{topics.map((name) => <button key={name} className={topic === name ? "active" : ""} onClick={() => setTopic(name)}>{name}</button>)}</div><label className="stock-search"><Search /><input placeholder="Search conversations" value={query} onChange={(event) => setQuery(event.target.value)} /></label></div>
      <div className="community-layout"><div className="post-feed">{visible.map((post) => <article className="community-card" key={post.id}><div className="post-author"><span className="post-avatar">{post.initials}</span><div><strong>{post.author}</strong><small>{post.role} · {timeAgo(post.createdAt)}</small></div><span className="topic-pill">{post.topic}</span></div><div className="post-body"><div><h2>{post.title}</h2><p>{post.body}</p></div><div className={`post-art ${post.imageTone}`}><span>{post.emoji}</span></div></div><div className="post-actions"><button className={post.liked ? "liked" : ""} onClick={() => like(post.id)}><Heart fill={post.liked ? "currentColor" : "none"} /> {post.likes}</button><button><MessageCircle /> {post.comments} comments</button><button className="post-reply">Join the conversation <ArrowRight /></button></div></article>)}{!visible.length && <div className="stock-empty">No conversations found. Start the first one.</div>}</div>
        <aside className="community-side"><div className="community-about"><span><Users /></span><h3>A table for everyone</h3><p>Ask a cooking question, swap a family recipe, or share what you learned in the kitchen today.</p><button onClick={() => setOpen(true)}>Write your first post <ArrowRight /></button></div><div className="guidelines"><h3>Community spirit</h3><p><Check /> Be generous with what you know</p><p><Check /> Respect every kitchen and culture</p><p><Check /> Keep food safety in mind</p></div></aside>
      </div>
    </section>
    <footer><div className="shell footer-inner"><Logo /><p>Good food lives closer than you think.</p><div><Link href="/">Browse</Link><Link href="/cook">Cook with us</Link></div><small>© 2026 Hearthly</small></div></footer>

    {open && <div className="overlay modal-overlay" onMouseDown={(event) => event.target === event.currentTarget && setOpen(false)}><div className="custom-modal community-modal"><button className="icon-button modal-close" onClick={() => setOpen(false)}><X /></button><div className="modal-intro"><span className="spark-icon"><PenLine /></span><span className="kicker">SHARE WITH THE TABLE</span><h2>What’s cooking?</h2><p>Share a recipe, a practical tip, or a moment from your food journey.</p></div><div className="form-stack"><div className="form-row"><label className="form-field"><span>Topic</span><select value={form.topic} onChange={(event) => setForm({ ...form, topic: event.target.value })}>{topics.slice(1).map((name) => <option key={name}>{name}</option>)}</select></label><label className="form-field emoji-field"><span>Cover emoji</span><input value={form.emoji} maxLength={2} onChange={(event) => setForm({ ...form, emoji: event.target.value })} /></label></div><label className="form-field"><span>Title</span><input autoFocus placeholder="Give your story a warm title" value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} /></label><label className="form-field"><span>Your story</span><textarea className="story-textarea" placeholder="Share the useful details, method, or moment..." value={form.body} onChange={(event) => setForm({ ...form, body: event.target.value })} /></label></div><button className="button primary full" disabled={!form.title || !form.body} onClick={publish}>Publish to community <Send /></button></div></div>}
    {toast && <div className="toast"><span><Check /></span>{toast}</div>}
  </main>;
}
