"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import ui from "../styles/ui.module.css";
import styles from "./admin.module.css";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
  }

  function isActive(path: string) {
    return pathname === path || pathname.startsWith(path + "/");
  }

  return (
    <div className={ui.page}>
      <div className={styles.header}>
        <div className={styles.left}>
          <strong>StopCalls Admin</strong>
        </div>

        <div className={styles.right}>
          <Link
            href="/admin/orders"
            className={styles.link}
            style={{
              fontWeight: isActive("/admin/orders") ? 600 : undefined,
            }}
          >
            Orders
          </Link>

          <Link
            href="/admin/blog"
            className={styles.link}
            style={{
              fontWeight: isActive("/admin/blog") ? 600 : undefined,
            }}
          >
            Blog
          </Link>

          <Link
            href="/admin/metrics"
            className={styles.link}
            style={{
              fontWeight: isActive("/admin/metrics") ? 600 : undefined,
            }}
          >
            Metrics
          </Link>

          <button onClick={logout} className={styles.logout}>
            Logout
          </button>
        </div>
      </div>

      <div className={ui.container}>{children}</div>
    </div>
  );
}
