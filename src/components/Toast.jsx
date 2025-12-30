"use client";

import { useEffect } from "react";

export default function Toast({ id, message, type = "success", onClose }) {
    useEffect(() => {
        const timer = setTimeout(onClose, 3000);
        return () => clearTimeout(timer);
    }, [onClose]);

    const bgColor = {
        success: "bg-green-600",
        error: "bg-red-600",
        info: "bg-blue-600",
        warning: "bg-yellow-600",
    }[type] || "bg-green-600";

    const iconEmoji = {
        success: "✓",
        error: "✕",
        info: "ⓘ",
        warning: "⚠",
    }[type] || "✓";

    return (
        <div
            className={`${bgColor} text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 animate-slide-in`}
            role="alert"
        >
            <span className="text-lg font-bold">{iconEmoji}</span>
            <span className="text-sm">{message}</span>
        </div>
    );
}
