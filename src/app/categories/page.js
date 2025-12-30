import { connectDB } from "@/lib/db";
import Category from "@/models/Category";
import CategoriesTable from "@/components/CategoriesTable";
import Link from "next/link";

export default async function CategoriesPage({ searchParams }) {
  await connectDB();

  const page = Math.max(1, Number(searchParams?.page) || 1);
  const limit = Math.min(100, Number(searchParams?.limit) || 20);

  const total = await Category.countDocuments();
  const categories = JSON.parse(
    JSON.stringify(await Category.find().sort({ name: 1 }).skip((page - 1) * limit).limit(limit).lean())
  );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-white">Categories</h1>
        <Link
          href="/categories/new"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition"
        >
          + Create New Category
        </Link>
      </div>
      <CategoriesTable categories={categories} pagination={{ page, limit, total, totalPages: Math.ceil(total / limit) }} />
    </div>
  );
}

