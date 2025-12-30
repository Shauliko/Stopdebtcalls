"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ui from "../../styles/ui.module.css";

type BlogPost = {
  id: string;
  title: string;
  slug: string;
  status: "draft" | "published";
  createdAt: string;
  updatedAt: string;
};

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [status, setStatus] = useState<"" | "draft" | "published">("");
  const [q, setQ] = useState("");

  async function load() {
    const params = new URLSearchParams();
    if (status) params.set("status", status);
    if (q) params.set("q", q);

    const res = await fetch(`/api/admin/blog?${params.toString()}`);
    const data = await res.json();
    setPosts(data.items || []);
  }

  useEffect(() => {
    load();
  }, [status]);

  return (
    <div className={ui.card}>
      <div className={ui.cardHeader}>
        <div className={ui.eyebrow}>Admin</div>
        <h1 className={ui.cardTitle}>Blog</h1>
        <p className={ui.cardSubtitle}>
          Draft, publish, and manage blog posts.
        </p>
      </div>

      <div className={ui.buttonRow} style={{ marginBottom: 24 }}>
        <Link href="/admin/blog/new" className={ui.primaryButton}>
          New Post
        </Link>

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as any)}
          className={ui.secondaryButton}
        >
          <option value="">All</option>
          <option value="draft">Draft</option>
          <option value="published">Published</option>
        </select>

        <input
          placeholder="Search..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onBlur={load}
          className={ui.secondaryButton}
        />
      </div>

      {posts.length === 0 ? (
        <p className={ui.muted}>No posts found.</p>
      ) : (
        <div style={{ display: "grid", gap: 16 }}>
          {posts.map((p) => (
            <div key={p.id} className={ui.cardTight}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 12,
                }}
              >
                <div>
                  <strong>{p.title}</strong>
                  <div className={ui.small}>
                    /blog/{p.slug}
                  </div>
                </div>

                <div>
                  <span
                    style={{
                      fontSize: 13,
                      padding: "4px 10px",
                      borderRadius: 999,
                      background:
                        p.status === "published"
                          ? "#dcfce7"
                          : "#fef9c3",
                    }}
                  >
                    {p.status}
                  </span>
                </div>
              </div>

              <div style={{ marginTop: 12 }}>
                <Link
                  href={`/admin/blog/${p.id}`}
                  className={ui.secondaryButton}
                >
                  Edit
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
