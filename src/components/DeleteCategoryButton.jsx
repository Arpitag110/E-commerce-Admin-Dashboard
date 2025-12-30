"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "./ToastProvider";
import ConfirmDialog from "./ConfirmDialog";

export default function DeleteCategoryButton({ id }) {
  const router = useRouter();
  const { addToast } = useToast();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleConfirm() {
    setLoading(true);
    try {
      const res = await fetch(`/api/categories?id=${id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (res.ok) {
        addToast("Category deleted successfully!", "success");
        router.refresh();
      } else {
        addToast(data.message || "Failed to delete category", "error");
      }
    } catch (err) {
      addToast("Failed to delete category", "error");
    } finally {
      setLoading(false);
      setOpen(false);
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="px-3 py-1 text-sm bg-red-600 hover:bg-red-700 text-white rounded"
      >
        Delete
      </button>

      <ConfirmDialog
        open={open}
        title="Delete category"
        description={loading ? "Deleting..." : "Are you sure you want to delete this category?"}
        onCancel={() => setOpen(false)}
        onConfirm={handleConfirm}
      />
    </>
  );
}

