import { NextResponse } from "next/server";
import { exportOrdersForCSV } from "@/lib/store";

function toCSV(rows: Record<string, string>[]) {
  if (rows.length === 0) return "";

  const headers = Object.keys(rows[0]);
  const escape = (value: string) =>
    `"${String(value).replace(/"/g, '""')}"`;

  const lines = [
    headers.join(","),
    ...rows.map((row) =>
      headers.map((h) => escape(row[h] ?? "")).join(",")
    ),
  ];

  return lines.join("\n");
}

export async function GET() {
  const rows = exportOrdersForCSV();
  const csv = toCSV(rows);

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition":
        'attachment; filename="orders-export.csv"',
      "Cache-Control": "no-store",
    },
  });
}
