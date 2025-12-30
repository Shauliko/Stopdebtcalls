import { notFound } from "next/navigation";
import { getPublishedBlogPostBySlug } from "@/lib/store";
import ui from "../../../styles/ui.module.css";

type Props = {
  params: { slug: string };
};

export async function generateMetadata({ params }: Props) {
  const post = getPublishedBlogPostBySlug(params.slug);
  if (!post) return {};

  return {
    title: `${post.title} | StopCalls`,
    description: post.summary || undefined,
  };
}

export default function BlogPostPage({ params }: Props) {
  const post = getPublishedBlogPostBySlug(params.slug);
  if (!post) notFound();

  return (
    <div className={ui.page}>
      <div className={ui.container}>
        <article className={ui.card}>
          {post.heroImage && (
            <img
              src={post.heroImage}
              alt=""
              style={{
                width: "100%",
                borderRadius: 12,
                marginBottom: 24,
                objectFit: "cover",
              }}
            />
          )}

          <div className={ui.cardHeader}>
            <div className={ui.eyebrow}>Blog</div>
            <h1 className={ui.cardTitle}>{post.title}</h1>

            {post.publishedAt && (
              <div className={ui.small} style={{ marginTop: 8 }}>
                {new Date(post.publishedAt).toLocaleDateString()}
              </div>
            )}
          </div>

          {post.content && (
            <div
              style={{
                marginTop: 24,
                lineHeight: 1.7,
                color: "#0f172a",
              }}
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          )}

          {post.tags.length > 0 && (
            <div style={{ marginTop: 32, fontSize: 13, color: "#64748b" }}>
              Tags: {post.tags.join(", ")}
            </div>
          )}
        </article>
      </div>
    </div>
  );
}
