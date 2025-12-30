"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "./ToastProvider";
import ConfirmDialog from "./ConfirmDialog";

export default function DeleteButton({ id }) {
  const router = useRouter();
  const { addToast } = useToast();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleConfirm() {
    setLoading(true);
    try {
      const res = await fetch(`/api/products?id=${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        addToast("Product deleted successfully!", "success");
        router.refresh();
      } else {
        addToast("Failed to delete product", "error");
      }
    } catch (err) {
      addToast("Failed to delete product", "error");
    } finally {
      setLoading(false);
      setOpen(false);
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
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

      <ConfirmDialog
        open={open}
        title="Delete product"
        description={loading ? "Deleting..." : "Are you sure you want to delete this product?"}
        onCancel={() => setOpen(false)}
        onConfirm={handleConfirm}
      />
    </>
  );
}
