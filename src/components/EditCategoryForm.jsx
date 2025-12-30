"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "./ToastProvider";

export default function EditCategoryForm({ category }) {
  const router = useRouter();
  const { addToast } = useToast();

  const [name, setName] = useState(category.name);
  const [description, setDescription] = useState(category.description || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`/api/categories?id=${category._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, description }),
      });

      const data = await res.json();

      if (res.ok) {
        addToast(`Category "${name}" updated successfully!`, "success");
        setTimeout(() => {
          router.push("/categories");
          router.refresh();
        }, 500);
      } else {
        setError(data.message || "Failed to update category");
        addToast("Failed to update category", "error");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
      addToast("An error occurred", "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md w-full bg-zinc-900 p-8 rounded-xl shadow-xl">
      <h1 className="text-2xl font-semibold mb-6 text-white">
        Edit Category
      </h1>

      {error && (
        <div className="bg-red-600/20 border border-red-600 text-red-400 px-4 py-3 rounded-lg text-sm mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm mb-1 text-zinc-300">
            Category Name *
          </label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 rounded bg-zinc-800 text-white border border-zinc-700 focus:ring-2 focus:ring-blue-600"
            required
          />
        </div>

        <div>
          <label className="block text-sm mb-1 text-zinc-300">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full px-3 py-2 rounded bg-zinc-800 text-white border border-zinc-700 focus:ring-2 focus:ring-blue-600"
          />
        </div>

        <div className="flex gap-3">
          <button
            disabled={loading}
            className="flex-1 bg-blue-600 hover:bg-blue-700 transition text-white py-2 rounded font-medium"
          >
            {loading ? "Saving..." : "Update Category"}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2 bg-zinc-700 hover:bg-zinc-600 text-white rounded font-medium"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

