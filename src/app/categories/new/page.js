"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ToastProvider";

export default function NewCategoryPage() {
  const router = useRouter();
  const { addToast } = useToast();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, description }),
      });

      const data = await res.json();

      if (res.ok) {
        addToast(`Category "${name}" created successfully!`, "success");
        setTimeout(() => {
          router.push("/categories");
          router.refresh();
        }, 500);
      } else {
        // Show more detailed error message
        if (data.errors && Array.isArray(data.errors)) {
          const errorMessages = data.errors.map(e => e.message).join(", ");
          setError(errorMessages);
        } else {
          setError(data.message || "Failed to create category");
        }
        addToast("Failed to create category", "error");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
      addToast("An error occurred", "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto mt-10 bg-zinc-900 p-6 rounded-lg shadow-lg">
      <h1 className="text-2xl font-semibold mb-6 text-white">
        Create Category
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
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Electronics"
            className="w-full px-3 py-2 rounded bg-zinc-800 text-white border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
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
            placeholder="Optional description..."
            rows={3}
            className="w-full px-3 py-2 rounded bg-zinc-800 text-white border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-blue-600 hover:bg-blue-700 transition text-white py-2 rounded font-medium disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create Category"}
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

