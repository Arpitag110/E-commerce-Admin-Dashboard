import { cookies } from "next/headers";
import Sidebar from "./Sidebar";

export default async function AuthWrapper({ children }) {
  const cookieStore = await cookies();
  const session = cookieStore.get("admin_session");
  const isAuthenticated = session?.value === "authenticated";

  if (!isAuthenticated) {
    return <>{children}</>;
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar />
      <main style={{ flex: 1, padding: "20px" }}>{children}</main>
    </div>
  );
}

