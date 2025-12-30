import { connectDB } from "@/lib/db";
import Product from "@/models/Product";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

// CREATE product
import { productSchema } from "@/lib/productSchema";

async function checkAuth() {
  const cookieStore = await cookies();
  const session = cookieStore.get("admin_session");
  return session?.value === "authenticated";
}

export async function POST(req) {
  // Check authentication
  if (!(await checkAuth())) {
    return NextResponse.json(
      { message: "Unauthorized" },
      { status: 401 }
    );
  }
  try {
    const body = await req.json();

    // ✅ Validate
    const parsed = productSchema.parse({
      name: body.name,
      price: Number(body.price),
      stock: Number(body.stock),
      imageUrl: body.imageUrl || null,
      category: body.category || null,
    });

    await connectDB();
    const product = await Product.create(parsed);

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    if (error.name === "ZodError") {
      return NextResponse.json(
        { errors: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: "Error creating product" },
      { status: 500 }
    );
  }
}

// DELETE product
export async function DELETE(req) {
  // Check authentication
  if (!(await checkAuth())) {
    return NextResponse.json(
      { message: "Unauthorized" },
      { status: 401 }
    );
  }
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { message: "Product ID required" },
        { status: 400 }
      );
    }

    await connectDB();
    await Product.findByIdAndDelete(id);

    return NextResponse.json({ message: "Product deleted" });
  } catch (error) {
    return NextResponse.json(
      { message: "Error deleting product" },
      { status: 500 }
    );
  }
}

// UPDATE product
export async function PUT(req) {
  // Check authentication
  if (!(await checkAuth())) {
    return NextResponse.json(
      { message: "Unauthorized" },
      { status: 401 }
    );
  }
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const body = await req.json();

    // ✅ Validate
    const parsed = productSchema.parse({
      name: body.name,
      price: Number(body.price),
      stock: Number(body.stock),
      imageUrl: body.imageUrl || null,
      category: body.category || null,
    });

    await connectDB();
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      parsed,
      { new: true }
    );

    return NextResponse.json(updatedProduct);
  } catch (error) {
    if (error.name === "ZodError") {
      return NextResponse.json(
        { errors: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: "Error updating product" },
      { status: 500 }
    );
  }
}


