import { connectDB } from "@/lib/db";
import Product from "@/models/Product";
import ProductsTable from "@/components/ProductsTable";
import Link from "next/link";

export default async function ProductsPage({ searchParams }) {
  await connectDB();

  const page = Math.max(1, Number(searchParams?.page) || 1);
  const limit = Math.min(100, Number(searchParams?.limit) || 20);

  const total = await Product.countDocuments();
  const products = JSON.parse(
    JSON.stringify(
      await Product.find()
        .populate("category", "name")
        .skip((page - 1) * limit)
        .limit(limit)
        .lean()
    )
  );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-white">Products</h1>
        <Link
          href="/products/new"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition"
        >
          + Create New Product
        </Link>
      </div>
      <ProductsTable products={products} pagination={{ page, limit, total, totalPages: Math.ceil(total / limit) }} />
    </div>
  );
}
