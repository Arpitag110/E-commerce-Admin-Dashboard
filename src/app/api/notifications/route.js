import { connectDB } from "@/lib/db";
import Product from "@/models/Product";
import Category from "@/models/Category";
import { generateNotifications } from "@/lib/notificationHelpers";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        await connectDB();

        // Fetch all products and categories
        const products = JSON.parse(
            JSON.stringify(await Product.find().lean())
        );

        const categories = JSON.parse(
            JSON.stringify(await Category.find().lean())
        );

        // Generate notifications
        const notifications = generateNotifications(products, categories);

        return NextResponse.json({
            count: notifications.length,
            notifications: notifications,
        });
    } catch (error) {
        console.error("Error fetching notifications:", error);
        return NextResponse.json(
            { message: "Error fetching notifications" },
            { status: 500 }
        );
    }
}
