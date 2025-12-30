"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import ui from "../../../styles/ui.module.css";

export default function NewBlogPostPage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [heroImage, setHeroImage] = useState("");
  const [status, setStatus] = useState<"draft" | "published">("draft");
  const [saving, setSaving] = useState(false);

  async function submit() {
    if (!title.trim()) return alert("Title required");

    setSaving(true);

    const res = await fetch("/api/admin/blog", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        slug: slug || undefined,
        summary,
        content,
        heroImage,
        tags: tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
        status,
      }),
    });

    const data = await res.json();
    setSaving(false);

    if (!res.ok) {
      alert(data.error || "Failed to create post");
      return;
    }

    router.push(`/admin/blog/${data.id}`);
  }

  return (
    <div className={ui.card}>
      <div className={ui.cardHeader}>
        <div className={ui.eyebrow}>Admin</div>
        <h1 className={ui.cardTitle}>New Blog Post</h1>
      </div>

      <div style={{ display: "grid", gap: 16 }}>
        <input
          className={ui.secondaryButton}
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <input
          className={ui.secondaryButton}
          placeholder="Slug (optional)"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
        />

        <textarea
          className={ui.secondaryButton}
          placeholder="Summary"
          rows={3}
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
        />

        <input
          className={ui.secondaryButton}
          placeholder="Hero image URL (optional)"
          value={heroImage}
          onChange={(e) => setHeroImage(e.target.value)}
        />

        <input
          className={ui.secondaryButton}
          placeholder="Tags (comma separated)"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
        />

        <textarea
          className={ui.secondaryButton}
          placeholder="Content (HTML allowed)"
          rows={10}
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        <select
          className={ui.secondaryButton}
          value={status}
          onChange={(e) =>
            setStatus(e.target.value as "draft" | "published")
          }
        >
          <option value="draft">Draft</option>
          <option value="published">Published</option>
        </select>

        <button
          onClick={submit}
          disabled={saving}
          className={ui.primaryButton}
        >
          {saving ? "Saving..." : "Create Post"}
        </button>
      </div>
    </div>
  );
}
