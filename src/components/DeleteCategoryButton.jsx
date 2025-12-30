"use client";

import { useRouter } from "next/navigation";

export default function DeleteCategoryButton({ id }) {
  const router = useRouter();

  async function handleDelete() {
    const confirmDelete = confirm("Are you sure you want to delete this category?");
    if (!confirmDelete) return;

    const res = await fetch(`/api/categories?id=${id}`, {
      method: "DELETE",
    });

    const data = await res.json();

    if (res.ok) {
      router.refresh();
    } else {
      alert(data.message || "Failed to delete category");
    }
  }

  return (
    <button
      onClick={handleDelete}
      className="px-3 py-1 text-sm bg-red-600 hover:bg-red-700 text-white rounded"
    >
      Delete
    </button>
  );
}

