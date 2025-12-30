"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ImageUpload from "./ImageUpload";
import CategorySelect from "./CategorySelect";
import { useToast } from "./ToastProvider";

export default function EditProductForm({ product }) {
  const router = useRouter();
  const { addToast } = useToast();

  const [name, setName] = useState(product.name);
  const [price, setPrice] = useState(product.price);
  const [stock, setStock] = useState(product.stock);
  const [imageUrl, setImageUrl] = useState(product.imageUrl || null);
  const [category, setCategory] = useState(product.category?._id || product.category || null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    const res = await fetch(`/api/products?id=${product._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, price, stock, imageUrl, category }),
    });

    if (res.ok) {
      addToast(`Product "${name}" updated successfully!`, "success");
      setTimeout(() => {
        router.push("/products");
        router.refresh();
      }, 500);
    } else {
      addToast("Failed to update product", "error");
    }

    setLoading(false);
  }

  return (
    <div className="max-w-md w-full bg-zinc-900 p-8 rounded-xl shadow-xl">
      <h1 className="text-2xl font-semibold mb-6 text-white">
        Edit Product
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm mb-1 text-zinc-300">
            Product Name
          </label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 rounded bg-zinc-800 text-white border border-zinc-700 focus:ring-2 focus:ring-blue-600"
          />
        </div>

        <div>
          <label className="block text-sm mb-1 text-zinc-300">
            Price (₹)
          </label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full px-3 py-2 rounded bg-zinc-800 text-white border border-zinc-700 focus:ring-2 focus:ring-blue-600"
          />
        </div>

        <div>
          <label className="block text-sm mb-1 text-zinc-300">
            Stock
          </label>
          <input
            type="number"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            className="w-full px-3 py-2 rounded bg-zinc-800 text-white border border-zinc-700 focus:ring-2 focus:ring-blue-600"
          />
        </div>

        {/* Category */}
        <CategorySelect value={category} onChange={setCategory} />

        {/* Image Upload */}
        <ImageUpload value={imageUrl} onChange={setImageUrl} />

        <button
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 transition text-white py-2 rounded font-medium"
        >
          {loading ? "Saving..." : "Update Product"}
        </button>
      </form>
    </div>
  );
}
