import { connectDB } from "@/lib/db";
import Product from "@/models/Product";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { productSchema } from "@/lib/productSchema";
import { logAudit } from "@/lib/audit";

async function checkAuth() {
  const cookieStore = await cookies();
  const session = cookieStore.get("admin_session");
  return session?.value === "authenticated";
}

// GET products with pagination
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const page = Math.max(1, Number(searchParams.get("page") || 1));
    const limit = Math.min(100, Math.max(1, Number(searchParams.get("limit") || 20)));

    await connectDB();

    const total = await Product.countDocuments();
    const products = await Product.find()
      .populate("category", "name")
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    return NextResponse.json({ data: products, total, page, totalPages: Math.ceil(total / limit) });
  } catch (error) {
    console.error("GET /api/products error:", error);
    return NextResponse.json({ message: error.message || "Error fetching products" }, { status: 500 });
  }
}

// CREATE product
export async function POST(req) {
  if (!(await checkAuth())) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();

    const parsed = productSchema.parse({
      name: body.name,
      price: Number(body.price),
      stock: Number(body.stock),
      imageUrl: body.imageUrl || null,
      category: body.category || null,
    });

    await connectDB();
    const product = await Product.create(parsed);

    // Audit (user is placeholder for now)
    await logAudit({ action: "create", resource: "product", resourceId: product._id, user: "admin", meta: { name: product.name } });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error("POST /api/products error:", error);
    if (error.name === "ZodError") {
      return NextResponse.json({ message: "Validation failed", errors: error.errors }, { status: 400 });
    }
    return NextResponse.json({ message: error.message || "Error creating product" }, { status: 500 });
  }
}

// UPDATE product
export async function PUT(req) {
  if (!(await checkAuth())) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const body = await req.json();

    if (!id) return NextResponse.json({ message: "Product ID required" }, { status: 400 });

    const parsed = productSchema.parse({
      name: body.name,
      price: Number(body.price),
      stock: Number(body.stock),
      imageUrl: body.imageUrl || null,
      category: body.category || null,
    });

    await connectDB();
    const updatedProduct = await Product.findByIdAndUpdate(id, parsed, { new: true });

    if (!updatedProduct) return NextResponse.json({ message: "Product not found" }, { status: 404 });

    await logAudit({ action: "update", resource: "product", resourceId: id, user: "admin", meta: { changes: parsed } });

    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error("PUT /api/products error:", error);
    if (error.name === "ZodError") {
      return NextResponse.json({ message: "Validation failed", errors: error.errors }, { status: 400 });
    }
    return NextResponse.json({ message: error.message || "Error updating product" }, { status: 500 });
  }
}

// DELETE product
export async function DELETE(req) {
  if (!(await checkAuth())) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ message: "Product ID required" }, { status: 400 });

    await connectDB();
    const deleted = await Product.findByIdAndDelete(id);

    if (!deleted) return NextResponse.json({ message: "Product not found" }, { status: 404 });

    await logAudit({ action: "delete", resource: "product", resourceId: id, user: "admin" });

    return NextResponse.json({ message: "Product deleted" });
  } catch (error) {
    console.error("DELETE /api/products error:", error);
    return NextResponse.json({ message: error.message || "Error deleting product" }, { status: 500 });
  }
}


