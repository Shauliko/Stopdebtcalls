"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import ui from "../../../styles/ui.module.css";

type BlogPost = {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  tags: string[];
  heroImage?: string;
  status: "draft" | "published";
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
};

export default function EditBlogPostPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [post, setPost] = useState<BlogPost | null>(null);
  const [saving, setSaving] = useState(false);
  const [generating, setGenerating] = useState(false);

  async function load() {
    const res = await fetch(`/api/admin/blog/${id}`);
    if (!res.ok) {
      alert("Post not found");
      router.push("/admin/blog");
      return;
    }
    setPost(await res.json());
  }

  useEffect(() => {
    load();
  }, [id]);

  async function save() {
    if (!post) return;
    setSaving(true);

    const res = await fetch(`/api/admin/blog/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: post.title,
        slug: post.slug,
        summary: post.summary,
        content: post.content,
        tags: post.tags,
        heroImage: post.heroImage,
        status: post.status,
      }),
    });

    const data = await res.json();
    setSaving(false);

    if (!res.ok) {
      alert(data.error || "Save failed");
      return;
    }

    setPost(data);
  }

  async function generateAI() {
    if (!post) return;
    setGenerating(true);

    const res = await fetch("/api/admin/blog/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: post.title,
        summary: post.summary,
        tags: post.tags,
      }),
    });

    const data = await res.json();
    setGenerating(false);

    if (!res.ok) {
      alert(data.error || "AI generation failed");
      return;
    }

    setPost({
      ...post,
      content: data.content || post.content,
      summary: data.summary || post.summary,
      tags: data.tags || post.tags,
    });
  }

  async function publish(next: "published" | "draft") {
    if (!post) return;

    const res = await fetch(`/api/admin/blog/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: next }),
    });

    const data = await res.json();
    if (!res.ok) {
      alert(data.error || "Failed");
      return;
    }
    setPost(data);
  }

  async function remove() {
    if (!confirm("Delete this post permanently?")) return;

    await fetch(`/api/admin/blog/${id}`, { method: "DELETE" });
    router.push("/admin/blog");
  }

  if (!post) {
    return <p className={ui.muted}>Loading…</p>;
  }

  return (
    <div className={ui.card}>
      <div className={ui.cardHeader}>
        <div className={ui.eyebrow}>Admin</div>
        <h1 className={ui.cardTitle}>Edit Blog Post</h1>
        <p className={ui.cardSubtitle}>
          Status: <strong>{post.status}</strong>
        </p>
      </div>

      <div style={{ display: "grid", gap: 16 }}>
        <input
          className={ui.secondaryButton}
          value={post.title}
          onChange={(e) =>
            setPost({ ...post, title: e.target.value })
          }
        />

        <input
          className={ui.secondaryButton}
          value={post.slug}
          onChange={(e) =>
            setPost({ ...post, slug: e.target.value })
          }
        />

        <textarea
          className={ui.secondaryButton}
          rows={3}
          value={post.summary}
          onChange={(e) =>
            setPost({ ...post, summary: e.target.value })
          }
        />

        <input
          className={ui.secondaryButton}
          placeholder="Hero image URL"
          value={post.heroImage || ""}
          onChange={(e) =>
            setPost({ ...post, heroImage: e.target.value })
          }
        />

        <input
          className={ui.secondaryButton}
          value={post.tags.join(", ")}
          onChange={(e) =>
            setPost({
              ...post,
              tags: e.target.value
                .split(",")
                .map((t) => t.trim())
                .filter(Boolean),
            })
          }
        />

        <textarea
          className={ui.secondaryButton}
          rows={12}
          value={post.content}
          onChange={(e) =>
            setPost({ ...post, content: e.target.value })
          }
        />

        <div className={ui.buttonRow}>
          <button
            onClick={save}
            disabled={saving}
            className={ui.primaryButton}
          >
            {saving ? "Saving…" : "Save"}
          </button>

          <button
            onClick={generateAI}
            disabled={generating}
            className={ui.secondaryButton}
          >
            {generating ? "Generating…" : "Generate with AI"}
          </button>

          {post.status === "draft" ? (
            <button
              onClick={() => publish("published")}
              className={ui.secondaryButton}
            >
              Publish
            </button>
          ) : (
            <button
              onClick={() => publish("draft")}
              className={ui.secondaryButton}
            >
              Unpublish
            </button>
          )}

          <button
            onClick={remove}
            className={ui.secondaryButton}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
