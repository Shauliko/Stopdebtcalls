import type { LetterFormData } from "./validate";

/* ================================
   Types
================================ */

export type OrderStatus =
  | "created"
  | "paid"
  | "queued"
  | "sent"
  | "delivered"
  | "canceled"
  | "failed";

export type OrderEvent = {
  at: string;
  action: string;
  actor: "system" | "admin";
  meta?: Record<string, any>;
};

export type OrderRecord = {
  id: string;
  status: OrderStatus;

  createdAt: string;
  updatedAt: string;

  form: LetterFormData;
  letterText: string;

  customerEmail?: string;
  collectorName?: string;

  trackingNumber?: string;
  lobLetterId?: string;
  lobMailingId?: string;

  notes?: string;
  lastError?: string;

  events: OrderEvent[];
};

/* ================================
   Blog Types
================================ */

export type BlogStatus = "draft" | "published";

export type BlogPostRecord = {
  id: string;

  title: string;
  slug: string;

  summary: string;
  content: string;

  tags: string[];
  heroImage?: string; // simple string reference (URL/path). We'll wire uploads later.

  status: BlogStatus;

  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
};

/* ================================
   In-memory store
================================ */

const orders = new Map<string, OrderRecord>();
const blogPosts = new Map<string, BlogPostRecord>();

/* ================================
   State Machine
================================ */

const ALLOWED_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  created: ["paid", "canceled"],
  paid: ["queued", "sent", "failed", "canceled"],
  queued: ["sent", "failed", "canceled"],
  sent: ["delivered", "failed"],
  delivered: [],
  failed: ["paid", "canceled"],
  canceled: [],
};

function canTransition(from: OrderStatus, to: OrderStatus) {
  return ALLOWED_TRANSITIONS[from]?.includes(to);
}

/* ================================
   Helpers
================================ */

function now() {
  return new Date().toISOString();
}

function logEvent(
  order: OrderRecord,
  action: string,
  actor: OrderEvent["actor"],
  meta?: Record<string, any>
) {
  order.events.push({
    at: now(),
    action,
    actor,
    meta,
  });
  order.updatedAt = now();
}

function setStatus(
  order: OrderRecord,
  next: OrderStatus,
  actor: OrderEvent["actor"],
  meta?: Record<string, any>
) {
  if (order.status === next) return;

  if (!canTransition(order.status, next)) {
    throw new Error(`Illegal status transition: ${order.status} → ${next}`);
  }

  const prev = order.status;
  order.status = next;

  logEvent(order, "status_changed", actor, {
    from: prev,
    to: next,
    ...meta,
  });
}

function normalizeTag(t: string) {
  return t.trim().toLowerCase().replace(/\s+/g, " ").replace(/,+/g, "");
}

function slugify(input: string) {
  const s = input
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return s || "post";
}

function isSlugTaken(slug: string, ignoreId?: string) {
  for (const p of blogPosts.values()) {
    if (p.slug === slug && p.id !== ignoreId) return true;
  }
  return false;
}

function ensureUniqueSlug(base: string, ignoreId?: string) {
  let candidate = slugify(base);
  if (!isSlugTaken(candidate, ignoreId)) return candidate;

  // deterministic bump
  let i = 2;
  while (isSlugTaken(`${candidate}-${i}`, ignoreId)) i++;
  return `${candidate}-${i}`;
}

function blogMatchesQuery(p: BlogPostRecord, q: string) {
  const needle = q.trim().toLowerCase();
  if (!needle) return true;
  return (
    p.title.toLowerCase().includes(needle) ||
    p.slug.toLowerCase().includes(needle) ||
    p.summary.toLowerCase().includes(needle) ||
    p.tags.some((t) => t.includes(needle))
  );
}

/* ================================
   Core API (Orders)
================================ */

export function createOrder(args: {
  form: LetterFormData;
  letterText: string;
}): OrderRecord {
  const id = crypto.randomUUID();

  const record: OrderRecord = {
    id,
    status: "created",
    createdAt: now(),
    updatedAt: now(),

    form: args.form,
    letterText: args.letterText,

    customerEmail: args.form.email,
    collectorName: args.form.collectorName,

    events: [],
  };

  logEvent(record, "order_created", "system");
  orders.set(id, record);

  return record;
}

export function getOrder(id: string): OrderRecord | null {
  return orders.get(id) ?? null;
}

export function listOrders(): OrderRecord[] {
  return Array.from(orders.values()).sort((a, b) =>
    b.createdAt.localeCompare(a.createdAt)
  );
}

/* ================================
   System Transitions (Orders)
================================ */

export function markPaid(id: string) {
  const order = orders.get(id);
  if (!order) return null;
  setStatus(order, "paid", "system");
  return order;
}

export function markQueued(id: string) {
  const order = orders.get(id);
  if (!order) return null;
  setStatus(order, "queued", "system");
  return order;
}

export function markSent(
  id: string,
  trackingNumber: string,
  meta?: { lobLetterId?: string; lobMailingId?: string }
) {
  const order = orders.get(id);
  if (!order) return null;

  setStatus(order, "sent", "system", { trackingNumber });

  order.trackingNumber = trackingNumber;
  order.lobLetterId = meta?.lobLetterId;
  order.lobMailingId = meta?.lobMailingId;

  return order;
}

export function markDelivered(id: string) {
  const order = orders.get(id);
  if (!order) return null;
  setStatus(order, "delivered", "system");
  return order;
}

export function failOrder(id: string, error: string) {
  const order = orders.get(id);
  if (!order) return null;

  order.lastError = error;
  setStatus(order, "failed", "system", { error });

  return order;
}

/* ================================
   Admin Operations (Orders)
================================ */

export function updateOrder(
  id: string,
  updates: Partial<Pick<OrderRecord, "status" | "notes">>,
  actor: "admin"
) {
  const order = orders.get(id);
  if (!order) return null;

  if (updates.status) {
    setStatus(order, updates.status, actor);
  }

  if (updates.notes !== undefined) {
    order.notes = updates.notes;
    logEvent(order, "notes_updated", actor);
  }

  return order;
}

export function cancelOrder(id: string, reason?: string) {
  const order = orders.get(id);
  if (!order) return null;

  setStatus(order, "canceled", "admin", { reason });
  order.lastError = reason;

  return order;
}

/* ================================
   CSV EXPORT (ADMIN ONLY) - Orders
================================ */

export function exportOrdersForCSV() {
  return listOrders().map((o) => ({
    id: o.id,
    status: o.status,
    createdAt: o.createdAt,
    updatedAt: o.updatedAt,
    customerEmail: o.customerEmail || "",
    collectorName: o.collectorName || "",
    trackingNumber: o.trackingNumber || "",
    notes: o.notes || "",
    lastError: o.lastError || "",
  }));
}

/* ================================
   Blog Store (In-memory, No DB)
================================ */

export function createBlogPost(input: {
  title: string;
  slug?: string;

  summary?: string;
  content?: string;

  tags?: string[];
  heroImage?: string;

  status?: BlogStatus; // default draft
}): BlogPostRecord {
  const id = crypto.randomUUID();
  const createdAt = now();

  const baseSlug = input.slug?.trim() ? input.slug : input.title;
  const slug = ensureUniqueSlug(baseSlug);

  const status: BlogStatus = input.status ?? "draft";
  const publishedAt = status === "published" ? createdAt : undefined;

  const tags = (input.tags ?? [])
    .map(normalizeTag)
    .filter(Boolean)
    .slice(0, 25);

  const post: BlogPostRecord = {
    id,
    title: input.title.trim(),
    slug,

    summary: (input.summary ?? "").trim(),
    content: input.content ?? "",

    tags,
    heroImage: input.heroImage?.trim() || undefined,

    status,

    createdAt,
    updatedAt: createdAt,
    publishedAt,
  };

  blogPosts.set(id, post);
  return post;
}

export function getBlogPostById(id: string): BlogPostRecord | null {
  return blogPosts.get(id) ?? null;
}

/**
 * Public read: published only
 */
export function getPublishedBlogPostBySlug(slug: string): BlogPostRecord | null {
  for (const p of blogPosts.values()) {
    if (p.slug === slug && p.status === "published") return p;
  }
  return null;
}

/**
 * Admin list with filters + pagination.
 */
export function listBlogPostsAdmin(opts?: {
  q?: string;
  status?: BlogStatus;
  tag?: string;
  limit?: number;
  offset?: number;
}): { items: BlogPostRecord[]; hasMore: boolean; total: number } {
  const q = (opts?.q ?? "").trim();
  const status = opts?.status;
  const tag = opts?.tag ? normalizeTag(opts.tag) : "";
  const limit = Math.max(1, Math.min(100, opts?.limit ?? 25));
  const offset = Math.max(0, opts?.offset ?? 0);

  let all = Array.from(blogPosts.values());

  if (q) all = all.filter((p) => blogMatchesQuery(p, q));
  if (status) all = all.filter((p) => p.status === status);
  if (tag) all = all.filter((p) => p.tags.includes(tag));

  all.sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  const total = all.length;
  const items = all.slice(offset, offset + limit);
  const hasMore = offset + limit < total;

  return { items, hasMore, total };
}

/**
 * Public list: published only
 */
export function listPublishedBlogPosts(): BlogPostRecord[] {
  return Array.from(blogPosts.values())
    .filter((p) => p.status === "published")
    .sort((a, b) => {
      const at = a.publishedAt ?? a.createdAt;
      const bt = b.publishedAt ?? b.createdAt;
      return bt.localeCompare(at);
    });
}

export function updateBlogPost(
  id: string,
  updates: Partial<
    Pick<
      BlogPostRecord,
      | "title"
      | "slug"
      | "summary"
      | "content"
      | "tags"
      | "heroImage"
      | "status"
    >
  >
): BlogPostRecord | null {
  const post = blogPosts.get(id);
  if (!post) return null;

  const next: BlogPostRecord = { ...post };

  if (updates.title !== undefined) next.title = updates.title.trim();

  if (updates.slug !== undefined) {
    const proposed = updates.slug.trim();
    if (!proposed) throw new Error("Slug cannot be empty");
    next.slug = ensureUniqueSlug(proposed, id);
  } else if (updates.title !== undefined && post.title !== next.title) {
    // Title changed; do NOT auto-change slug unless admin explicitly sets slug.
    // Leave slug alone.
  }

  if (updates.summary !== undefined) next.summary = updates.summary.trim();
  if (updates.content !== undefined) next.content = updates.content;

  if (updates.tags !== undefined) {
    next.tags = updates.tags
      .map(normalizeTag)
      .filter(Boolean)
      .slice(0, 25);
  }

  if (updates.heroImage !== undefined) {
    next.heroImage = updates.heroImage?.trim() || undefined;
  }

  if (updates.status !== undefined && updates.status !== post.status) {
    next.status = updates.status;

    if (updates.status === "published") {
      next.publishedAt = next.publishedAt ?? now();
    } else {
      // unpublish: keep publishedAt for history; do not delete it
    }
  }

  next.updatedAt = now();

  blogPosts.set(id, next);
  return next;
}

export function deleteBlogPost(id: string) {
  blogPosts.delete(id);
}

export function publishBlogPost(id: string): BlogPostRecord | null {
  const post = blogPosts.get(id);
  if (!post) return null;
  if (post.status === "published") return post;

  const next: BlogPostRecord = {
    ...post,
    status: "published",
    publishedAt: post.publishedAt ?? now(),
    updatedAt: now(),
  };

  blogPosts.set(id, next);
  return next;
}

export function unpublishBlogPost(id: string): BlogPostRecord | null {
  const post = blogPosts.get(id);
  if (!post) return null;
  if (post.status === "draft") return post;

  const next: BlogPostRecord = {
    ...post,
    status: "draft",
    updatedAt: now(),
  };

  blogPosts.set(id, next);
  return next;
}
