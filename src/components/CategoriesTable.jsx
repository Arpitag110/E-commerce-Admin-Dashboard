"use client";

import { useState } from "react";
import Link from "next/link";
import DeleteButton from "./DeleteCategoryButton";
import { useRouter } from "next/navigation";

export default function CategoriesTable({ categories, pagination }) {
  const [search, setSearch] = useState("");
  const router = useRouter();

  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(search.toLowerCase())
  );

  function goToPage(p) {
    const searchParams = new URLSearchParams(window.location.search);
    searchParams.set("page", p);
    searchParams.set("limit", pagination?.limit || 20);
    router.push(`${window.location.pathname}?${searchParams.toString()}`);
  }

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="flex flex-col md:flex-row gap-4">
        <input
          type="text"
          placeholder="Search categories..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-zinc-900 border border-zinc-800 rounded-md px-4 py-2 text-white w-full md:w-1/3"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-zinc-800">
        <table className="min-w-full text-sm">
          <thead className="bg-zinc-900 text-zinc-300">
            <tr>
              <th className="px-4 py-3 text-left">Name</th>
              <th className="px-4 py-3 text-left">Description</th>
              <th className="px-4 py-3 text-left">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-zinc-800">
            {filteredCategories.length === 0 && (
              <tr>
                <td
                  colSpan="3"
                  className="px-4 py-6 text-center text-zinc-500"
                >
                  {search
                    ? "No matching categories found."
                    : "No categories found. Create your first category!"}
                </td>
              </tr>
            )}

            {filteredCategories.map((category) => (
              <tr
                key={category._id}
                className="hover:bg-zinc-900 transition"
              >
                <td className="px-4 py-3 text-white font-medium">
                  {category.name}
                </td>

                <td className="px-4 py-3 text-zinc-400">
                  {category.description || (
                    <span className="text-zinc-500 italic">No description</span>
                  )}
                </td>

                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <Link
                      href={`/categories/${category._id}`}
                      className="px-3 py-1 text-sm bg-zinc-700 hover:bg-zinc-600 text-white rounded"
                    >
                      Edit
                    </Link>
                    <DeleteButton id={category._id.toString()} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {pagination && (
        <div className="flex items-center justify-between mt-4">
          <div className="text-sm text-zinc-400">
            Page {pagination.page} of {pagination.totalPages} — {pagination.total} total
          </div>
          <div className="flex gap-2">
            <button onClick={() => goToPage(Math.max(1, pagination.page - 1))} disabled={pagination.page <= 1} className="px-3 py-1 bg-zinc-800 text-white rounded disabled:opacity-50">Prev</button>
            <button onClick={() => goToPage(Math.min(pagination.totalPages, pagination.page + 1))} disabled={pagination.page >= pagination.totalPages} className="px-3 py-1 bg-zinc-800 text-white rounded disabled:opacity-50">Next</button>
          </div>
        </div>
      )}
    </div>
  );
}

