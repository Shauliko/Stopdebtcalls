"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import ui from "../../styles/ui.module.css";

type Order = {
  id: string;
  status: string;
  trackingNumber?: string;
};

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");

  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (!orderId) {
      setError("Missing order ID.");
      return;
    }

    async function loadAndSend() {
      try {
        const res = await fetch(`/api/orders/${orderId}`);
        const json = await res.json();

        if (!res.ok || !json.ok) {
          setError("Order not found.");
          return;
        }

        setOrder(json.order);

        if (json.order.status !== "sent") {
          const sendRes = await fetch("/api/orders/send", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ orderId }),
          });

          const sendJson = await sendRes.json();

          if (sendRes.ok && sendJson.ok) {
            setOrder((prev) =>
              prev
                ? {
                    ...prev,
                    status: sendJson.status,
                    trackingNumber: sendJson.trackingNumber,
                  }
                : prev
            );
          }
        }
      } catch {
        setError("Unexpected error loading order.");
      }
    }

    loadAndSend();
  }, [orderId]);

  if (error) {
    return (
      <div className={ui.page}>
        <div className={ui.container}>
          <div className={ui.card}>
            <div className={ui.cardTitle}>Something went wrong</div>
            <p className={ui.muted}>{error}</p>
            <div className={ui.buttonRow}>
              <Link href="/" className={ui.secondaryButton}>
                Back to home
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className={ui.page}>
        <div className={ui.container}>
          <p className={ui.muted}>Loading your order…</p>
        </div>
      </div>
    );
  }

  return (
    <div className={ui.page}>
      <div className={ui.container}>
        {/* HEADER */}
        <div
          style={{
            textAlign: "center",
            marginBottom: 32,
            padding: "0 8px",
          }}
        >
          <div className={ui.eyebrow}>Order Complete</div>
          <h1 style={{ marginBottom: 8 }}>Letter Confirmed</h1>
          <p className={ui.muted}>
            Your cease communication letter is being processed.
          </p>
        </div>

        {/* ORDER DETAILS */}
        <div className={ui.card} style={{ marginBottom: 24 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: 12,
              marginBottom: 12,
              flexWrap: "wrap",
            }}
          >
            <span className={ui.muted}>Order ID</span>
            <strong style={{ wordBreak: "break-all" }}>
              {order.id}
            </strong>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: 12,
              marginBottom: order.trackingNumber ? 12 : 0,
            }}
          >
            <span className={ui.muted}>Status</span>
            <strong style={{ textTransform: "capitalize" }}>
              {order.status}
            </strong>
          </div>

          {order.trackingNumber && (
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: 12,
                flexWrap: "wrap",
              }}
            >
              <span className={ui.muted}>Tracking number</span>
              <strong style={{ wordBreak: "break-all" }}>
                {order.trackingNumber}
              </strong>
            </div>
          )}
        </div>

        {/* NEXT STEPS */}
        <div
          className={ui.card}
          style={{
            background: "#f8fafc",
            marginBottom: 32,
          }}
        >
          <div style={{ fontWeight: 600, marginBottom: 8 }}>
            What happens next
          </div>
          <ul style={{ margin: 0, paddingLeft: 18 }}>
            <li>Your letter is printed and mailed via certified USPS mail.</li>
            <li>Delivery includes tracking for your records.</li>
            <li>Keep this confirmation page for documentation.</li>
          </ul>
        </div>

        {/* CTA */}
        <div style={{ textAlign: "center" }}>
          <Link
            href="/"
            className={ui.primaryButton}
            style={{ width: "100%" }}
          >
            Back to home
          </Link>
        </div>

        <div
          className={ui.muted}
          style={{
            textAlign: "center",
            marginTop: 20,
            padding: "0 8px",
          }}
        >
          Not legal advice. This service provides document generation only.
        </div>
      </div>
    </div>
  );
}
