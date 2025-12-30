import { connectDB } from "@/lib/db";
import AuditLog from "@/models/AuditLog";

export async function logAudit({ action, resource, resourceId = null, user = "anonymous", meta = {}, ip = "" }) {
    try {
        await connectDB();
        await AuditLog.create({ action, resource, resourceId: resourceId?.toString?.() || null, user, meta, ip });
    } catch (err) {
        // Auditing should not break main flow; log to server console
        console.error("Audit logging failed:", err?.message || err);
    }
}
