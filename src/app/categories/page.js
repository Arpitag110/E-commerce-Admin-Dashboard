import { connectDB } from "@/lib/db";
import Category from "@/models/Category";
import CategoriesTable from "@/components/CategoriesTable";
import Link from "next/link";

export default async function CategoriesPage() {
  await connectDB();

  const categories = JSON.parse(
    JSON.stringify(await Category.find().sort({ name: 1 }).lean())
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
      <CategoriesTable categories={categories} />
    </div>
  );
}

