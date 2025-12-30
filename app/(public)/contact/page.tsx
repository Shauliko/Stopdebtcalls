import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "StopCalls",
  description: "Stop debt collection calls permanently.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="scBody">
        {/* TOP NAV */}
        <header
          style={{
            borderBottom: "1px solid #e5e7eb",
            background: "#ffffff",
          }}
        >
          <div
            style={{
              maxWidth: 1040,
              margin: "0 auto",
              padding: "16px 24px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Link
              href="/"
              style={{
                fontWeight: 600,
                fontSize: 18,
                color: "#0f172a",
              }}
            >
              StopCalls
            </Link>

            <nav
              style={{
                display: "flex",
                gap: 20,
                fontSize: 14,
                flexWrap: "wrap",
              }}
            >
              <Link href="/about">About</Link>
              <Link href="/blog">Blog</Link>
              <Link href="/faq">FAQ</Link>
              <Link href="/contact">Contact</Link>
              <Link href="/terms">Terms</Link>
              <Link href="/privacy">Privacy</Link>
              <Link href="/disclaimer">Disclaimer</Link>
            </nav>
          </div>
        </header>

        {/* APP */}
        <div className="scApp">{children}</div>

        {/* FOOTER */}
        <footer
          style={{
            marginTop: 96,
            borderTop: "1px solid #e5e7eb",
            background: "#ffffff",
          }}
        >
          <div
            style={{
              maxWidth: 1040,
              margin: "0 auto",
              padding: "40px 24px",
              display: "flex",
              flexWrap: "wrap",
              gap: 24,
              justifyContent: "space-between",
              fontSize: 13,
              color: "#64748b",
            }}
          >
            <div>
              <strong style={{ color: "#0f172a" }}>StopCalls</strong>
              <div style={{ marginTop: 8 }}>
                Consumer protection tools for stopping debt collection calls.
              </div>
            </div>

            <div style={{ display: "flex", gap: 40, flexWrap: "wrap" }}>
              <div style={{ display: "grid", gap: 8 }}>
                <Link href="/about">About</Link>
                <Link href="/blog">Blog</Link>
                <Link href="/faq">FAQ</Link>
                <Link href="/contact">Contact</Link>
              </div>

              <div style={{ display: "grid", gap: 8 }}>
                <Link href="/terms">Terms</Link>
                <Link href="/privacy">Privacy</Link>
                <Link href="/disclaimer">Disclaimer</Link>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
