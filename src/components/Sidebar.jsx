"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const linkStyle = (path) => ({
    padding: "8px 12px",
    borderRadius: "6px",
    display: "block",
    color: pathname === path ? "#fff" : "#aaa",
    background: pathname === path ? "#2563eb" : "transparent",
    textDecoration: "none",
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
