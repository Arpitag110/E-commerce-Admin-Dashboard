"use client";

import { useRouter } from "next/navigation";

export default function DeleteButton({ id }) {
  const router = useRouter();

  async function handleDelete() {
    const confirmDelete = confirm("Are you sure you want to delete?");
    if (!confirmDelete) return;

    const res = await fetch(`/api/products?id=${id}`, {
      method: "DELETE",
    });

    if (res.ok) {
      router.refresh(); // re-fetch SSR data
    } else {
      alert("Failed to delete product");
    }
  }

  return (
    <button
      onClick={handleDelete}
      style={{
        padding: "4px 8px",
        background: "#dc2626",
        color: "#fff",
        borderRadius: "4px",
        border: "none",
        cursor: "pointer",
      }}
    >
      Delete
    </button>
  );
}
