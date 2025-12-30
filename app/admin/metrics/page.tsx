"use client";

import { useEffect, useState } from "react";
import ui from "../../styles/ui.module.css";

type Metrics = {
  total: number;
  today: number;
  last7Days: number;
  byStatus: Record<string, number>;
};

export default function AdminMetricsPage() {
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/admin/metrics");
        const json = await res.json();

        if (!res.ok || !json.ok) {
          setError("Failed to load metrics.");
          return;
        }

        setMetrics(json);
      } catch {
        setError("Unexpected error loading metrics.");
      }
    }

    load();
  }, []);

  if (error) {
    return (
      <div className={ui.page}>
        <div className={ui.container}>
          <p style={{ color: "#b91c1c" }}>{error}</p>
        </div>
      </div>
    );
  }

  if (!metrics) {
    return (
      <div className={ui.page}>
        <div className={ui.container}>
          <p className={ui.muted}>Loading metrics…</p>
        </div>
      </div>
    );
  }

  return (
    <div className={ui.page}>
      <div className={ui.container}>
        <div className={ui.card}>
          <div className={ui.cardHeader}>
            <div className={ui.cardTitle}>Metrics</div>
            <div className={ui.cardSubtitle}>
              Operational overview
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: 16,
            }}
          >
            <Metric label="Total orders" value={metrics.total} />
            <Metric label="Orders today" value={metrics.today} />
            <Metric
              label="Last 7 days"
              value={metrics.last7Days}
            />
          </div>

          <div style={{ marginTop: 32 }}>
            <strong>Status breakdown</strong>

            <ul style={{ paddingLeft: 18, marginTop: 12 }}>
              {Object.entries(metrics.byStatus).map(
                ([status, count]) => (
                  <li key={status}>
                    {status}: {count}
                  </li>
                )
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

function Metric({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div
      style={{
        border: "1px solid #e5e7eb",
        borderRadius: 12,
        padding: 16,
      }}
    >
      <div className={ui.small}>{label}</div>
      <div
        style={{
          fontSize: 28,
          fontWeight: 600,
          marginTop: 4,
        }}
      >
        {value}
      </div>
    </div>
  );
}
