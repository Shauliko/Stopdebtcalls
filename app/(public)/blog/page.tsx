import Link from "next/link";
import { listPublishedBlogPosts } from "@/lib/store";
import ui from "../../styles/ui.module.css";

export const metadata = {
  title: "Blog | StopCalls",
  description:
    "Consumer rights, debt collection law, and how to stop unwanted calls.",
};

export default function BlogIndexPage() {
  const posts = listPublishedBlogPosts();

  return (
    <div className={ui.page}>
      <div className={ui.container}>
        <div className={ui.card}>
          <div className={ui.cardHeader}>
            <div className={ui.eyebrow}>Resources</div>
            <h1 className={ui.cardTitle}>StopCalls Blog</h1>
            <p className={ui.cardSubtitle}>
              Consumer protection, FDCPA guidance, and call-stopping tactics.
            </p>
          </div>

          {posts.length === 0 ? (
            <p className={ui.muted}>No posts published yet.</p>
          ) : (
            <div style={{ display: "grid", gap: 24 }}>
              {posts.map((post) => (
                <article key={post.id} className={ui.card}>
                  {post.heroImage && (
                    <img
                      src={post.heroImage}
                      alt=""
                      style={{
                        width: "100%",
                        borderRadius: 12,
                        marginBottom: 16,
                        objectFit: "cover",
                      }}
                    />
                  )}

                  <h2 style={{ fontSize: 22, fontWeight: 600 }}>
                    <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                  </h2>

                  {post.summary && (
                    <p style={{ marginTop: 8, color: "#475569" }}>
                      {post.summary}
                    </p>
                  )}

                  <div style={{ marginTop: 12, fontSize: 13, color: "#64748b" }}>
                    {post.publishedAt
                      ? new Date(post.publishedAt).toLocaleDateString()
                      : null}
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
