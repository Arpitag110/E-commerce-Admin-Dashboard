import mongoose from "mongoose";

const AuditLogSchema = new mongoose.Schema(
    {
        action: { type: String, required: true },
        resource: { type: String, required: true },
        resourceId: { type: String, default: null },
        user: { type: String, default: "anonymous" },
        meta: { type: Object, default: {} },
        ip: { type: String, default: "" },
    },
    { timestamps: true }
);

export default mongoose.models.AuditLog || mongoose.model("AuditLog", AuditLogSchema);
