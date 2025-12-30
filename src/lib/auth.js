import { cookies } from "next/headers";

// Simple auth configuration - in production, use environment variables
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || "admin";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";

export async function verifyAuth() {
  const cookieStore = await cookies();
  const session = cookieStore.get("admin_session");
  return session?.value === "authenticated";
}

export async function getAuthStatus() {
  return await verifyAuth();
}

export { ADMIN_USERNAME, ADMIN_PASSWORD };

