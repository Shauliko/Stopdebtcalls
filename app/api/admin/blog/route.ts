import { NextResponse } from "next/server";
import {
  createBlogPost,
  listBlogPostsAdmin,
} from "@/lib/store";

/**
 * GET /api/admin/blog
 * Admin list with filters + pagination
 */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const q = searchParams.get("q") || undefined;
  const status = searchParams.get("status") as
    | "draft"
    | "published"
    | null;
  const tag = searchParams.get("tag") || undefined;

  const limit = Math.min(
    Number(searchParams.get("limit") || 25),
    100
  );
  const offset = Math.max(
    Number(searchParams.get("offset") || 0),
    0
  );

  const result = listBlogPostsAdmin({
    q,
    status: status || undefined,
    tag,
    limit,
    offset,
  });

  return NextResponse.json(result);
}

/**
 * POST /api/admin/blog
 * Create new blog post (draft by default)
 */
export async function POST(req: Request) {
  const body = await req.json();

  if (!body?.title || typeof body.title !== "string") {
    return NextResponse.json(
      { error: "Title is required" },
      { status: 400 }
    );
  }

  const post = createBlogPost({
    title: body.title,
    slug: body.slug,
    summary: body.summary,
    content: body.content,
    tags: body.tags,
    heroImage: body.heroImage,
    status: body.status,
  });

  return NextResponse.json(post);
}
