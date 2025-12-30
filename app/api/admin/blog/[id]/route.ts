import { NextResponse } from "next/server";
import {
  getBlogPostById,
  updateBlogPost,
  deleteBlogPost,
  publishBlogPost,
  unpublishBlogPost,
} from "@/lib/store";

/**
 * GET /api/admin/blog/[id]
 * Fetch single post (admin)
 */
export async function GET(
  _req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  const post = getBlogPostById(id);
  if (!post) {
    return NextResponse.json(
      { error: "Post not found" },
      { status: 404 }
    );
  }

  return NextResponse.json(post);
}

/**
 * PATCH /api/admin/blog/[id]
 * Update post fields
 */
export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const body = await req.json();

  try {
    const post = updateBlogPost(id, body);
    if (!post) {
      return NextResponse.json(
        { error: "Post not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(post);
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Update failed" },
      { status: 400 }
    );
  }
}

/**
 * DELETE /api/admin/blog/[id]
 */
export async function DELETE(
  _req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  deleteBlogPost(id);
  return NextResponse.json({ ok: true });
}

/**
 * POST /api/admin/blog/[id]/publish | /unpublish
 */
export async function POST(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const url = new URL(req.url);

  if (url.pathname.endsWith("/publish")) {
    const post = publishBlogPost(id);
    if (!post) {
      return NextResponse.json(
        { error: "Post not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(post);
  }

  if (url.pathname.endsWith("/unpublish")) {
    const post = unpublishBlogPost(id);
    if (!post) {
      return NextResponse.json(
        { error: "Post not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(post);
  }

  return NextResponse.json(
    { error: "Invalid action" },
    { status: 400 }
  );
}
