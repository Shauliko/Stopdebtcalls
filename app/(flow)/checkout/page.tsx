"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ui from "../../styles/ui.module.css";

type FormData = {
  language: "en" | "es";
  collectorName: string;
};

export default function CheckoutPage() {
  const [data, setData] = useState<FormData | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const stored = sessionStorage.getItem("letterFormData");
    if (!stored) return;

    try {
      setData(JSON.parse(stored));
    } catch {
      setData(null);
    }
  }, []);

  if (!data) {
    return (
      <div className={ui.page}>
        <div className={ui.container}>
          <div className={ui.card}>
            <div className={ui.cardTitle}>Checkout unavailable</div>
            <p className={ui.muted}>
              We couldn’t load your order details. Please return to the form.
            </p>
            <div className={ui.buttonRow}>
              <Link href="/form" className={ui.secondaryButton}>
                Back to form
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const isSpanish = data.language === "es";

  return (
    <div className={ui.page}>
      <div className={ui.container}>
        <div className={ui.eyebrow}>Step 3 of 3</div>

        <h1 style={{ marginBottom: 16 }}>
          {isSpanish ? "Finalizar" : "Checkout"}
        </h1>

        {/* ORDER SUMMARY */}
        <div className={ui.card} style={{ marginBottom: 24 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              gap: 12,
              marginBottom: 12,
              fontWeight: 600,
              flexWrap: "wrap",
            }}
          >
            <span style={{ flex: 1 }}>
              {isSpanish
                ? "Carta certificada de cese de comunicación"
                : "Certified cease communication letter"}
            </span>
            <span>$9.95</span>
          </div>

          <div className={ui.muted} style={{ marginBottom: 16 }}>
            {isSpanish ? "Para:" : "For:"} {data.collectorName}
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              borderTop: "1px solid #e5e7eb",
              paddingTop: 16,
              fontWeight: 600,
            }}
          >
            <span>{isSpanish ? "Total" : "Total"}</span>
            <span>$9.95</span>
          </div>
        </div>

        {/* TRUST / LEGAL */}
        <p className={ui.muted} style={{ marginBottom: 24 }}>
          {isSpanish
            ? "Este servicio no proporciona asesoramiento legal. El envío se realiza por correo certificado con número de seguimiento."
            : "This service does not provide legal advice. Letters are sent via certified mail with tracking."}
        </p>

        {/* PAYMENT */}
        <div className={ui.card}>
          <button
            className={ui.primaryButton}
            disabled={loading}
            style={{ width: "100%" }}
            onClick={async () => {
              try {
                setLoading(true);

                const formRaw =
                  sessionStorage.getItem("letterFormData");
                const letterText =
                  sessionStorage.getItem("letterText");

                if (!formRaw || !letterText) {
                  alert("Missing order data. Please start again.");
                  return;
                }

                const res = await fetch("/api/orders/create", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    form: JSON.parse(formRaw),
                    letterText,
                  }),
                });

                const json = await res.json();

                if (!res.ok || !json.ok) {
                  alert("Could not create order. Please try again.");
                  return;
                }

                window.location.href = `/success?orderId=${json.orderId}`;
              } catch {
                alert("Unexpected error. Please try again.");
              } finally {
                setLoading(false);
              }
            }}
          >
            {loading
              ? isSpanish
                ? "Procesando…"
                : "Processing…"
              : isSpanish
              ? "Marcar como pagado"
              : "Mark as paid"}
          </button>

          <div className={ui.muted} style={{ marginTop: 12 }}>
            DEV MODE — simulates a successful payment.
          </div>
        </div>

        {/* BACK */}
        <div style={{ marginTop: 24, textAlign: "center" }}>
          <Link href="/preview" className={ui.muted}>
            {isSpanish
              ? "Volver a la vista previa"
              : "Back to preview"}
          </Link>
        </div>
      </div>
    </div>
  );
}
