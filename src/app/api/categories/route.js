import { connectDB } from "@/lib/db";
import Category from "@/models/Category";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { categorySchema } from "@/lib/categorySchema";

async function checkAuth() {
  const cookieStore = await cookies();
  const session = cookieStore.get("admin_session");
  return session?.value === "authenticated";
}

// GET all categories
export async function GET() {
  try {
    await connectDB();
    const categories = await Category.find().sort({ name: 1 }).lean();
    return NextResponse.json(categories);
  } catch (error) {
    return NextResponse.json(
      { message: "Error fetching categories" },
      { status: 500 }
    );
  }
}

// CREATE category
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

    // Validate
    const parsed = categorySchema.parse({
      name: body.name,
      description: body.description || "",
    });

    await connectDB();
    
    const category = await Category.create({
      name: parsed.name,
      description: parsed.description || "",
    });

    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    console.error("Category creation error:", error);
    
    if (error.name === "ZodError") {
      const errorMessage = error.errors.map(e => e.message).join(", ");
      return NextResponse.json(
        { message: errorMessage, errors: error.errors },
        { status: 400 }
      );
    }

    if (error.code === 11000) {
      // MongoDB duplicate key error
      const field = Object.keys(error.keyPattern)[0];
      return NextResponse.json(
        { message: `Category ${field} already exists. Please choose a different name.` },
        { status: 400 }
      );
    }

    // Return more specific error message
    const errorMessage = error.message || "Error creating category";
    return NextResponse.json(
      { message: errorMessage },
      { status: 500 }
    );
  }
}

// UPDATE category
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

    if (!id) {
      return NextResponse.json(
        { message: "Category ID required" },
        { status: 400 }
      );
    }

    // Validate
    const parsed = categorySchema.parse({
      name: body.name,
      description: body.description || "",
    });

    await connectDB();
    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      {
        name: parsed.name,
        description: parsed.description || "",
      },
      { new: true }
    );

    if (!updatedCategory) {
      return NextResponse.json(
        { message: "Category not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedCategory);
  } catch (error) {
    if (error.name === "ZodError") {
      return NextResponse.json(
        { errors: error.errors },
        { status: 400 }
      );
    }

    if (error.code === 11000) {
      return NextResponse.json(
        { message: "Category name already exists" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: "Error updating category" },
      { status: 500 }
    );
  }
}

// DELETE category
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
        { message: "Category ID required" },
        { status: 400 }
      );
    }

    await connectDB();
    
    // Check if category is used by any products
    const Product = (await import("@/models/Product")).default;
    const productsUsingCategory = await Product.countDocuments({ category: id });
    
    if (productsUsingCategory > 0) {
      return NextResponse.json(
        { message: `Cannot delete category. It is used by ${productsUsingCategory} product(s).` },
        { status: 400 }
      );
    }

    await Category.findByIdAndDelete(id);

    return NextResponse.json({ message: "Category deleted" });
  } catch (error) {
    return NextResponse.json(
      { message: "Error deleting category" },
      { status: 500 }
    );
  }
}

