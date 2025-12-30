"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ImageUpload from "@/components/ImageUpload";
import CategorySelect from "@/components/CategorySelect";
import { useToast } from "@/components/ToastProvider";

export default function NewProductPage() {
  const router = useRouter();
  const { addToast } = useToast();

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [imageUrl, setImageUrl] = useState(null);
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, price, stock, imageUrl, category }),
      });

      const data = await res.json();

      if (res.ok) {
        addToast(`Product "${name}" created successfully!`, "success");
        setTimeout(() => {
          router.push("/products");
          router.refresh();
        }, 500);
      } else {
        if (data?.errors && Array.isArray(data.errors)) {
          setError(data.errors.map((e) => e.message).join(", "));
        } else {
          setError(data?.message || "Failed to create product");
        }
        addToast("Failed to create product", "error");
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
      addToast("An unexpected error occurred", "error");
      console.error("Create product error:", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto mt-10 bg-zinc-900 p-6 rounded-lg shadow-lg">
      <h1 className="text-2xl font-semibold mb-6 text-white">
        Add Product
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-600/20 border border-red-600 text-red-400 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}
        {/* Product Name */}
        <div>
          <label className="block text-sm mb-1 text-zinc-300">
            Product Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Laptop"
            className="w-full px-3 py-2 rounded bg-zinc-800 text-white border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
            required
          />
        </div>

        {/* Price */}
        <div>
          <label className="block text-sm mb-1 text-zinc-300">
            Price (₹)
          </label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="e.g. 75000"
            className="w-full px-3 py-2 rounded bg-zinc-800 text-white border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
            required
          />
        </div>

        {/* Stock */}
        <div>
          <label className="block text-sm mb-1 text-zinc-300">
            Stock Quantity
          </label>
          <input
            type="number"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            placeholder="e.g. 20"
            className="w-full px-3 py-2 rounded bg-zinc-800 text-white border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
            required
          />
        </div>

        {/* Category */}
        <CategorySelect value={category} onChange={setCategory} />

        {/* Image Upload */}
        <ImageUpload value={imageUrl} onChange={setImageUrl} />

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 transition text-white py-2 rounded font-medium disabled:opacity-50"
        >
          {loading ? "Creating..." : "Create Product"}
        </button>
      </form>
    </div>
  );
}
