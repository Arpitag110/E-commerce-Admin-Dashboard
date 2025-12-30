import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ADMIN_USERNAME, ADMIN_PASSWORD } from "@/lib/auth";

export async function POST(req) {
  try {
    const body = await req.json();
    const { username, password } = body;

    // Validate credentials
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      const cookieStore = await cookies();
      
      // Set session cookie (expires in 7 days)
      cookieStore.set("admin_session", "authenticated", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: "/",
      });

      return NextResponse.json({ message: "Login successful" });
    } else {
      return NextResponse.json(
        { message: "Invalid username or password" },
        { status: 401 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { message: "Error during login" },
      { status: 500 }
    );
  }
}

