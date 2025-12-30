import { connectDB } from "@/lib/db";
import Product from "@/models/Product";
import EditProductForm from "@/components/EditProductForm";

export default async function EditProductPage({ params }) {
  // ✅ params is async in new Next.js
  const { id } = await params;

  await connectDB();

  const product = await Product.findById(id).populate("category", "name").lean();

  if (!product) {
    return (
      <div className="p-6 text-white">
        Product not found
      </div>
    );
  }

  return (
  <div className="flex justify-center pt-16 px-4">
    <EditProductForm product={JSON.parse(JSON.stringify(product))} />
  </div>
);


}
