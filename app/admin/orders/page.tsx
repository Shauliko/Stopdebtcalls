"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ui from "../../styles/ui.module.css";

type OrderRow = {
  id: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  customerEmail?: string;
  collectorName?: string;
};

function StatusBadge({ status }: { status: string }) {
  const color =
    status === "paid"
      ? "#2563eb"
      : status === "queued"
      ? "#9333ea"
      : status === "sent"
      ? "#16a34a"
      : status === "delivered"
      ? "#15803d"
      : status === "failed"
      ? "#dc2626"
      : status === "canceled"
      ? "#6b7280"
      : "#475569";

  return (
    <span
      style={{
        display: "inline-block",
        padding: "4px 10px",
        borderRadius: 999,
        fontSize: 12,
        fontWeight: 600,
        background: `${color}20`,
        color,
        textTransform: "capitalize",
      }}
    >
      {status}
    </span>
  );
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("");

  const [offset, setOffset] = useState(0);
  const limit = 25;
  const [hasMore, setHasMore] = useState(false);

  async function load(newOffset = offset) {
    setLoading(true);
    setError("");

    try {
      const params = new URLSearchParams();
      if (query) params.set("q", query);
      if (status) params.set("status", status);
      params.set("limit", String(limit));
      params.set("offset", String(newOffset));

      const res = await fetch(`/api/admin/orders?${params.toString()}`);
      const json = await res.json();

      if (!res.ok || !json.ok) {
        setError("Failed to load orders.");
        return;
      }

      setOrders(json.orders);
      setHasMore(json.hasMore);
      setOffset(newOffset);
    } catch {
      setError("Unexpected error loading orders.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load(0);
  }, []);

  function exportCSV() {
    window.location.href = "/api/admin/orders/export";
  }

  return (
    <div className={ui.page}>
      <div className={ui.container}>
        <div className={ui.card}>
          <div className={ui.cardHeader}>
            <div className={ui.cardTitle}>Orders</div>
            <div className={ui.cardSubtitle}>
              Admin order management panel
            </div>
          </div>

          {/* Filters + Actions */}
          <div
            style={{
              display: "flex",
              gap: 12,
              marginBottom: 16,
              flexWrap: "wrap",
              justifyContent: "space-between",
            }}
          >
            <div
              style={{
                display: "flex",
                gap: 12,
                flexWrap: "wrap",
              }}
            >
              <input
                placeholder="Search by email, collector, or order id"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                style={{
                  padding: 8,
                  minWidth: 220,
                  border: "1px solid #cbd5e1",
                  borderRadius: 6,
                }}
              />

              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                style={{
                  padding: 8,
                  border: "1px solid #cbd5e1",
                  borderRadius: 6,
                }}
              >
                <option value="">All statuses</option>
                <option value="created">created</option>
                <option value="paid">paid</option>
                <option value="queued">queued</option>
                <option value="sent">sent</option>
                <option value="delivered">delivered</option>
                <option value="failed">failed</option>
                <option value="canceled">canceled</option>
              </select>

              <button
                className={ui.primaryButton}
                onClick={() => load(0)}
                style={{ padding: "8px 14px" }}
              >
                Apply
              </button>
            </div>

            <button
              className={ui.secondaryButton}
              onClick={exportCSV}
            >
              Export CSV
            </button>
          </div>

          {loading && <p className={ui.muted}>Loading…</p>}
          {error && <p style={{ color: "#b91c1c" }}>{error}</p>}

          {/* DESKTOP TABLE */}
          {!loading && !error && (
            <div className="admin-table">
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  fontSize: 14,
                }}
              >
                <thead>
                  <tr style={{ textAlign: "left" }}>
                    <th>ID</th>
                    <th>Status</th>
                    <th>Collector</th>
                    <th>Email</th>
                    <th>Created</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((o) => (
                    <tr
                      key={o.id}
                      style={{ borderTop: "1px solid #e5e7eb" }}
                    >
                      <td>{o.id.slice(0, 8)}</td>
                      <td>
                        <StatusBadge status={o.status} />
                      </td>
                      <td>{o.collectorName || "-"}</td>
                      <td>{o.customerEmail || "-"}</td>
                      <td>
                        {new Date(o.createdAt).toLocaleString()}
                      </td>
                      <td>
                        <Link
                          href={`/admin/orders/${o.id}`}
                          className={ui.primaryButton}
                          style={{ padding: "6px 12px", fontSize: 13 }}
                        >
                          View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* MOBILE STACKED */}
          {!loading && !error && (
            <div className="admin-cards">
              {orders.map((o) => (
                <div
                  key={o.id}
                  style={{
                    border: "1px solid #e5e7eb",
                    borderRadius: 12,
                    padding: 12,
                    marginBottom: 12,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: 6,
                    }}
                  >
                    <strong>Order {o.id.slice(0, 8)}</strong>
                    <StatusBadge status={o.status} />
                  </div>

                  <div className={ui.small}>
                    <strong>Collector:</strong>{" "}
                    {o.collectorName || "-"}
                  </div>

                  <div className={ui.small}>
                    <strong>Email:</strong>{" "}
                    {o.customerEmail || "-"}
                  </div>

                  <div className={ui.small}>
                    <strong>Created:</strong>{" "}
                    {new Date(o.createdAt).toLocaleString()}
                  </div>

                  <div style={{ marginTop: 8 }}>
                    <Link
                      href={`/admin/orders/${o.id}`}
                      className={ui.secondaryButton}
                      style={{ width: "100%" }}
                    >
                      View Order
                    </Link>
                  </div>
                </div>
              ))}

              {orders.length === 0 && (
                <p className={ui.muted}>No matching orders</p>
              )}
            </div>
          )}

          {/* PAGINATION */}
          {!loading && !error && (
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: 16,
              }}
            >
              <button
                className={ui.secondaryButton}
                disabled={offset === 0}
                onClick={() => load(Math.max(0, offset - limit))}
              >
                Previous
              </button>

              <button
                className={ui.secondaryButton}
                disabled={!hasMore}
                onClick={() => load(offset + limit)}
              >
                Next
              </button>
            </div>
          )}

          {/* MOBILE VISIBILITY CONTROL */}
          <style jsx>{`
            .admin-cards {
              display: none;
            }

            @media (max-width: 768px) {
              .admin-table {
                display: none;
              }
              .admin-cards {
                display: block;
              }
            }
          `}</style>
        </div>
      </div>
    </div>
  );
}
