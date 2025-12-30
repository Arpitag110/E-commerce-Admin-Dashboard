import { connectDB } from "@/lib/db";
import Category from "@/models/Category";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { categorySchema } from "@/lib/categorySchema";
import { logAudit } from "@/lib/audit";

async function checkAuth() {
  const cookieStore = await cookies();
  const session = cookieStore.get("admin_session");
  return session?.value === "authenticated";
}

// GET categories with pagination
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const page = Math.max(1, Number(searchParams.get("page") || 1));
    const limit = Math.min(100, Math.max(1, Number(searchParams.get("limit") || 20)));

    await connectDB();

    const total = await Category.countDocuments();
    const categories = await Category.find().sort({ name: 1 }).skip((page - 1) * limit).limit(limit).lean();

    return NextResponse.json({ data: categories, total, page, totalPages: Math.ceil(total / limit) });
  } catch (error) {
    console.error("GET /api/categories error:", error);
    return NextResponse.json({ message: error.message || "Error fetching categories" }, { status: 500 });
  }
}

// CREATE category
export async function POST(req) {
  if (!(await checkAuth())) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();

    const parsed = categorySchema.parse({ name: body.name, description: body.description || "" });

    await connectDB();
    const category = await Category.create({ name: parsed.name, description: parsed.description || "" });

    await logAudit({ action: "create", resource: "category", resourceId: category._id, user: "admin", meta: { name: category.name } });

    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    console.error("POST /api/categories error:", error);
    if (error.name === "ZodError") {
      const message = error.errors.map((e) => e.message).join(", ");
      return NextResponse.json({ message, errors: error.errors }, { status: 400 });
    }
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern || {})[0] || "name";
      return NextResponse.json({ message: `Category ${field} already exists.` }, { status: 400 });
    }
    return NextResponse.json({ message: error.message || "Error creating category" }, { status: 500 });
  }
}

// UPDATE category
export async function PUT(req) {
  if (!(await checkAuth())) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const body = await req.json();

    if (!id) return NextResponse.json({ message: "Category ID required" }, { status: 400 });

    const parsed = categorySchema.parse({ name: body.name, description: body.description || "" });

    await connectDB();
    const updatedCategory = await Category.findByIdAndUpdate(id, { name: parsed.name, description: parsed.description || "" }, { new: true });

    if (!updatedCategory) return NextResponse.json({ message: "Category not found" }, { status: 404 });

    await logAudit({ action: "update", resource: "category", resourceId: id, user: "admin", meta: { changes: parsed } });

    return NextResponse.json(updatedCategory);
  } catch (error) {
    console.error("PUT /api/categories error:", error);
    if (error.name === "ZodError") return NextResponse.json({ message: "Validation failed", errors: error.errors }, { status: 400 });
    if (error.code === 11000) return NextResponse.json({ message: "Category name already exists" }, { status: 400 });
    return NextResponse.json({ message: error.message || "Error updating category" }, { status: 500 });
  }
}

// DELETE category
export async function DELETE(req) {
  if (!(await checkAuth())) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ message: "Category ID required" }, { status: 400 });

    await connectDB();

    // Check if category is used
    const Product = (await import("@/models/Product")).default;
    const productsUsingCategory = await Product.countDocuments({ category: id });
    if (productsUsingCategory > 0) return NextResponse.json({ message: `Cannot delete category. It is used by ${productsUsingCategory} product(s).` }, { status: 400 });

    const deleted = await Category.findByIdAndDelete(id);
    if (!deleted) return NextResponse.json({ message: "Category not found" }, { status: 404 });

    await logAudit({ action: "delete", resource: "category", resourceId: id, user: "admin" });

    return NextResponse.json({ message: "Category deleted" });
  } catch (error) {
    console.error("DELETE /api/categories error:", error);
    return NextResponse.json({ message: error.message || "Error deleting category" }, { status: 500 });
  }
}

