"use client";

import Link from "next/link";
import { usePathname, useRouter, useTransition } from "next/navigation";
import { useEffect, useState } from "react";
import { generateNotifications } from "@/lib/notificationHelpers";

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [notificationCount, setNotificationCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // Fetch notification count
  useEffect(() => {
    async function fetchNotifications() {
      try {
        const res = await fetch("/api/notifications");
        if (res.ok) {
          const data = await res.json();
          setNotificationCount(data.count);
        }
      } catch (error) {
        console.error("Failed to fetch notifications:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchNotifications();
  }, []);

  const linkStyle = (path) => ({
    padding: "8px 12px",
    borderRadius: "6px",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    color: pathname === path ? "#fff" : "#aaa",
    background: pathname === path ? "#2563eb" : "transparent",
    textDecoration: "none",
    position: "relative",
  });

  async function handleLogout() {
    const res = await fetch("/api/auth/logout", {
      method: "POST",
    });

    if (res.ok) {
      router.push("/");
      router.refresh();
    }
  }

  return (
    <aside
      style={{
        width: "220px",
        padding: "20px",
        background: "#111",
        color: "#fff",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <div>
        <h2>Admin</h2>

        <nav style={{ marginTop: "20px" }}>
          <ul style={{ listStyle: "none", padding: 0 }}>
            <li>
              <Link href="/dashboard" style={linkStyle("/dashboard")}>
                Dashboard
              </Link>
            </li>

            <li style={{ marginTop: "8px" }}>
              <Link href="/products" style={linkStyle("/products")}>
                Products
              </Link>
            </li>

            <li style={{ marginTop: "8px" }}>
              <Link href="/categories" style={linkStyle("/categories")}>
                Categories
              </Link>
            </li>

            <li style={{ marginTop: "8px" }}>
              <Link href="/notifications" style={linkStyle("/notifications")}>
                <span>Notifications</span>
                {!loading && notificationCount > 0 && (
                  <span
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      minWidth: "20px",
                      height: "20px",
                      background: "#dc2626",
                      color: "#fff",
                      borderRadius: "50%",
                      fontSize: "11px",
                      fontWeight: "bold",
                      marginLeft: "auto",
                    }}
                  >
                    {notificationCount > 9 ? "9+" : notificationCount}
                  </span>
                )}
              </Link>
            </li>
          </ul>
        </nav>
      </div>

      <button
        onClick={handleLogout}
        style={{
          padding: "8px 12px",
          borderRadius: "6px",
          background: "#dc2626",
          color: "#fff",
          border: "none",
          cursor: "pointer",
          width: "100%",
          marginTop: "20px",
        }}
      >
        Logout
      </button>
    </aside>
  );
}
