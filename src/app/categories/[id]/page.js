import { connectDB } from "@/lib/db";
import Category from "@/models/Category";
import EditCategoryForm from "@/components/EditCategoryForm";

export default async function EditCategoryPage({ params }) {
  const { id } = await params;

  await connectDB();

  const category = await Category.findById(id).lean();

  if (!category) {
    return (
      <div className="p-6 text-white">
        Category not found
      </div>
    );
  }

  return (
    <div className="flex justify-center pt-16 px-4">
      <EditCategoryForm category={JSON.parse(JSON.stringify(category))} />
    </div>
  );
}

