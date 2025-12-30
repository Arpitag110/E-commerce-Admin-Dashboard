"use client";

import { getNotificationColor } from "@/lib/notificationHelpers";

export default function NotificationItem({ notification }) {
    const bgColor = getNotificationColor(notification.severity);

    return (
        <div
            className={`border rounded-lg p-4 mb-3 ${bgColor}`}
        >
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <h3 className="text-white font-semibold">{notification.title}</h3>
                    <p className="text-zinc-300 text-sm mt-1">{notification.message}</p>
                    {notification.type === "low-stock" && (
                        <div className="mt-2 flex gap-2 items-center">
                            <span className="text-xs bg-red-500 text-white px-2 py-1 rounded">
                                Stock: {notification.stock}
                            </span>
                            <a
                                href={`/products/${notification.productId}`}
                                className="text-xs text-blue-300 hover:text-blue-200 underline"
                            >
                                View Product
                            </a>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
