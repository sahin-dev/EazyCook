import { NextResponse } from "next/server";
import { communityPosts } from "@/lib/data";
import type { CommunityPost } from "@/lib/types";

export async function GET() { return NextResponse.json({ posts: communityPosts }); }

export async function POST(request: Request) {
  const body = await request.json();
  if (!body.title || !body.body || !body.topic) return NextResponse.json({ error: "Topic, title and story are required." }, { status: 400 });
  const post: CommunityPost = { id: `post-${Date.now()}`, author: "Nadia Rahman", initials: "NR", role: "Verified home chef", createdAt: new Date().toISOString(), topic: body.topic, title: body.title.trim(), body: body.body.trim(), imageTone: "green", emoji: body.emoji || "🍲", likes: 0, comments: 0 };
  communityPosts.unshift(post);
  return NextResponse.json({ post }, { status: 201 });
}

export async function PATCH(request: Request) {
  const { id } = await request.json();
  const post = communityPosts.find((entry) => entry.id === id);
  if (!post) return NextResponse.json({ error: "Post not found." }, { status: 404 });
  post.liked = !post.liked;
  post.likes += post.liked ? 1 : -1;
  return NextResponse.json({ post });
}
