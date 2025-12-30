"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import ui from "../../styles/ui.module.css";

export default function AdminLoginPage() {
  const searchParams = useSearchParams();
  const nextPath = searchParams.get("next") || "/admin/orders";

  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const json = await res.json();

      if (!res.ok || !json.ok) {
        setError("Invalid password.");
        return;
      }

      window.location.href = nextPath;
    } catch {
      setError("Unexpected error. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={ui.page}>
      <div className={ui.container}>
        <div className={ui.card} style={{ maxWidth: 420, margin: "0 auto" }}>
          <div className={ui.cardHeader}>
            <div className={ui.eyebrow}>Admin Access</div>
            <div className={ui.cardTitle}>Sign in</div>
            <div className={ui.cardSubtitle}>
              Restricted area. Authorized personnel only.
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", marginBottom: 6 }}>
                Admin password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{
                  width: "100%",
                  padding: "12px 14px",
                  borderRadius: 10,
                  border: "1px solid #cbd5e1",
                }}
              />
            </div>

            {error && (
              <div
                style={{
                  marginBottom: 12,
                  color: "#b91c1c",
                  fontSize: 14,
                }}
              >
                {error}
              </div>
            )}

            <button
              type="submit"
              className={ui.primaryButton}
              disabled={loading}
              style={{ width: "100%" }}
            >
              {loading ? "Signing in…" : "Sign in"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
