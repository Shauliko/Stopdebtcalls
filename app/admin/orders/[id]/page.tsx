"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import ui from "../../../styles/ui.module.css";

type Order = {
  id: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  trackingNumber?: string;
  customerEmail?: string;
  collectorName?: string;
  notes?: string;
  events?: {
    at: string;
    action: string;
    actor: string;
    meta?: any;
  }[];
};

export default function AdminOrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [order, setOrder] = useState<Order | null>(null);
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/admin/orders/${id}`);
        const json = await res.json();

        if (!res.ok || !json.ok) {
          setError("Failed to load order.");
          return;
        }

        setOrder(json.order);
        setNotes(json.order.notes || "");
        setStatus(json.order.status);
      } catch {
        setError("Unexpected error.");
      }
    }

    load();
  }, [id]);

  async function save() {
    await fetch(`/api/admin/orders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, notes }),
    });
    router.refresh();
  }

  async function cancel() {
    if (!confirm("Cancel this order?")) return;
    await fetch(`/api/admin/orders/${id}/cancel`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reason: "Admin canceled" }),
    });
    router.push("/admin/orders");
  }

  async function resend() {
    await fetch(`/api/admin/orders/${id}/resend`, {
      method: "POST",
    });
    alert("Order reset. Sending will re-trigger.");
  }

  if (error) {
    return (
      <div className={ui.page}>
        <div className={ui.container}>
          <p style={{ color: "#b91c1c" }}>{error}</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className={ui.page}>
        <div className={ui.container}>
          <p className={ui.muted}>Loading…</p>
        </div>
      </div>
    );
  }

  return (
    <div className={ui.page}>
      <div className={ui.container}>
        <div className={ui.card}>
          <div className={ui.cardHeader}>
            <div className={ui.cardTitle}>Order {order.id}</div>
            <div className={ui.cardSubtitle}>
              Status: {order.status}
            </div>
          </div>

          <div style={{ marginBottom: 16 }}>
            <strong>Collector:</strong> {order.collectorName}
          </div>
          <div style={{ marginBottom: 16 }}>
            <strong>Email:</strong> {order.customerEmail}
          </div>
          {order.trackingNumber && (
            <div style={{ marginBottom: 16 }}>
              <strong>Tracking:</strong> {order.trackingNumber}
            </div>
          )}

          <div style={{ marginBottom: 16 }}>
            <label>Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              style={{ marginLeft: 8 }}
            >
              <option value="paid">paid</option>
              <option value="sent">sent</option>
              <option value="failed">failed</option>
              <option value="canceled">canceled</option>
            </select>
          </div>

          <div style={{ marginBottom: 16 }}>
            <label>Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              style={{ width: "100%", minHeight: 80 }}
            />
          </div>

          <div className={ui.buttonRow}>
            <button className={ui.primaryButton} onClick={save}>
              Save
            </button>
            <button className={ui.secondaryButton} onClick={resend}>
              Resend
            </button>
            <button
              className={ui.secondaryButton}
              onClick={cancel}
            >
              Cancel
            </button>
          </div>

          {order.events && order.events.length > 0 && (
            <div style={{ marginTop: 32 }}>
              <strong>Audit Log</strong>
              <ul style={{ paddingLeft: 18 }}>
                {order.events.map((e, i) => (
                  <li key={i}>
                    {new Date(e.at).toLocaleString()} —{" "}
                    {e.action} ({e.actor})
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
