"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import DeleteButton from "./DeleteButton";
import { useRouter } from "next/navigation";

export default function ProductsTable({ products, pagination }) {
  const [search, setSearch] = useState("");
  const [stockFilter, setStockFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortBy, setSortBy] = useState("none");
  const [categories, setCategories] = useState([]);
  const router = useRouter();

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch("/api/categories");
        const payload = await res.json();
        // API may return { data, total, page } or an array
        const data = Array.isArray(payload) ? payload : payload.data || [];
        setCategories(data);
      } catch (err) {
        console.error("Failed to fetch categories:", err);
      }
    }
    fetchCategories();
  }, []);

  const filteredProducts = [...products]
    .filter((product) => {
      const matchesSearch = product.name
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesStock =
        stockFilter === "all" ||
        (stockFilter === "low" && product.stock > 0 && product.stock < 5) ||
        (stockFilter === "out" && product.stock === 0);

      const matchesCategory =
        categoryFilter === "all" ||
        (categoryFilter === "none" && !product.category) ||
        (product.category && product.category._id === categoryFilter);

      return matchesSearch && matchesStock && matchesCategory;
    })
    .sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name);
      if (sortBy === "price-asc") return a.price - b.price;
      if (sortBy === "price-desc") return b.price - a.price;
      if (sortBy === "stock-asc") return a.stock - b.stock;
      if (sortBy === "stock-desc") return b.stock - a.stock;
      return 0;
    });

  const goToPage = (p) => {
    const search = new URLSearchParams(window.location.search);
    search.set("page", p);
    search.set("limit", pagination?.limit || 20);
    router.push(`${window.location.pathname}?${search.toString()}`);
  };

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex flex-col md:flex-row gap-4">
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-zinc-900 border border-zinc-800 rounded-md px-4 py-2 text-white w-full md:w-1/3"
        />

        <select
          value={stockFilter}
          onChange={(e) => setStockFilter(e.target.value)}
          className="bg-zinc-900 border border-zinc-800 rounded-md px-4 py-2 text-white md:w-1/4"
        >
          <option value="all">All Stock</option>
          <option value="low">Low Stock (&lt; 5)</option>
          <option value="out">Out of Stock</option>
        </select>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="bg-zinc-900 border border-zinc-800 rounded-md px-4 py-2 text-white md:w-1/4"
        >
          <option value="all">All Categories</option>
          <option value="none">No Category</option>
          {categories.map((category) => (
            <option key={category._id} value={category._id}>
              {category.name}
            </option>
          ))}
        </select>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="bg-zinc-900 border border-zinc-800 rounded-md px-4 py-2 text-white md:w-1/4"
        >
          <option value="none">Sort By</option>
          <option value="name">Name (A–Z)</option>
          <option value="price-asc">Price ↑</option>
          <option value="price-desc">Price ↓</option>
          <option value="stock-asc">Stock ↑</option>
          <option value="stock-desc">Stock ↓</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-zinc-800">
        <table className="min-w-full text-sm">
          <thead className="bg-zinc-900 text-zinc-300">
            <tr>
              <th className="px-4 py-3 text-left w-20">Image</th>
              <th className="px-4 py-3 text-left">Name</th>
              <th className="px-4 py-3 text-left w-1/6">Category</th>
              <th className="px-4 py-3 text-left w-1/6">Price (₹)</th>
              <th className="px-4 py-3 text-left w-1/6">Stock</th>
              <th className="px-4 py-3 text-left w-1/6">Status</th>
              <th className="px-4 py-3 text-left w-1/6">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-zinc-800">
            {filteredProducts.length === 0 && (
              <tr>
                <td
                  colSpan="7"
                  className="px-4 py-6 text-center text-zinc-500"
                >
                  No matching products found.
                </td>
              </tr>
            )}

            {filteredProducts.map((product) => (
              <tr
                key={product._id}
                className="hover:bg-zinc-900 transition"
              >
                <td className="px-4 py-3">
                  {product.imageUrl ? (
                    <div className="relative w-16 h-16 bg-zinc-800 rounded-lg overflow-hidden">
                      <Image
                        src={product.imageUrl}
                        alt={product.name}
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    </div>
                  ) : (
                    <div className="w-16 h-16 bg-zinc-800 rounded-lg flex items-center justify-center text-zinc-500 text-xs">
                      No Image
                    </div>
                  )}
                </td>
                <td className="px-4 py-3 text-white font-medium">
                  {product.name}
                </td>

                <td className="px-4 py-3">
                  {product.category ? (
                    <span className="px-2 py-1 text-xs rounded bg-blue-600/20 text-blue-400 border border-blue-600/30">
                      {product.category.name}
                    </span>
                  ) : (
                    <span className="text-zinc-500 text-xs">—</span>
                  )}
                </td>

                <td className="px-4 py-3 text-white">
                  ₹ {product.price}
                </td>

                <td className="px-4 py-3 text-white">
                  {product.stock}
                </td>

                <td className="px-4 py-3">
                  {product.stock === 0 ? (
                    <span className="px-2 py-1 text-xs rounded bg-red-600 text-white">
                      Out
                    </span>
                  ) : product.stock < 5 ? (
                    <span className="px-2 py-1 text-xs rounded bg-yellow-600 text-black">
                      Low
                    </span>
                  ) : (
                    <span className="px-2 py-1 text-xs rounded bg-green-600 text-white">
                      In Stock
                    </span>
                  )}
                </td>

                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <Link
                      href={`/products/${product._id}`}
                      className="px-3 py-1 text-sm bg-zinc-700 hover:bg-zinc-600 text-white rounded"
                    >
                      Edit
                    </Link>
                    <DeleteButton id={product._id.toString()} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination && (
        <div className="flex items-center justify-between mt-4">
          <div className="text-sm text-zinc-400">
            Page {pagination.page} of {pagination.totalPages} — {pagination.total} total
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => goToPage(Math.max(1, pagination.page - 1))}
              disabled={pagination.page <= 1}
              className="px-3 py-1 bg-zinc-800 text-white rounded disabled:opacity-50"
            >
              Prev
            </button>
            <button
              onClick={() => goToPage(Math.min(pagination.totalPages, pagination.page + 1))}
              disabled={pagination.page >= pagination.totalPages}
              className="px-3 py-1 bg-zinc-800 text-white rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

