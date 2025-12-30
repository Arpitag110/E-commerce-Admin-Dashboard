import { connectDB } from "@/lib/db";
import Product from "@/models/Product";
import Category from "@/models/Category";
import NotificationItem from "@/components/NotificationItem";
import { generateNotifications } from "@/lib/notificationHelpers";

export default async function NotificationsPage() {
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

    // Sort by severity and timestamp
    const severityOrder = { critical: 0, warning: 1, info: 2 };
    const sortedNotifications = notifications.sort((a, b) => {
        const severityDiff = severityOrder[a.severity] - severityOrder[b.severity];
        if (severityDiff !== 0) return severityDiff;
        return new Date(b.timestamp) - new Date(a.timestamp);
    });

    return (
        <div className="p-8">
            <h1 className="text-3xl font-semibold text-white mb-6">Notifications</h1>

            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-gradient-to-br from-red-900 to-red-800 p-4 rounded-lg">
                    <p className="text-red-200 text-sm">Critical Alerts</p>
                    <p className="text-2xl font-bold text-white">
                        {notifications.filter((n) => n.severity === "critical").length}
                    </p>
                </div>
                <div className="bg-gradient-to-br from-yellow-900 to-yellow-800 p-4 rounded-lg">
                    <p className="text-yellow-200 text-sm">Warnings</p>
                    <p className="text-2xl font-bold text-white">
                        {notifications.filter((n) => n.severity === "warning").length}
                    </p>
                </div>
                <div className="bg-gradient-to-br from-blue-900 to-blue-800 p-4 rounded-lg">
                    <p className="text-blue-200 text-sm">Info</p>
                    <p className="text-2xl font-bold text-white">
                        {notifications.filter((n) => n.severity === "info").length}
                    </p>
                </div>
                <div className="bg-gradient-to-br from-zinc-900 to-zinc-800 p-4 rounded-lg">
                    <p className="text-zinc-400 text-sm">Total</p>
                    <p className="text-2xl font-bold text-white">
                        {notifications.length}
                    </p>
                </div>
            </div>

            {/* Notifications List */}
            <div className="bg-gradient-to-br from-zinc-900 to-zinc-800 p-6 rounded-lg">
                {notifications.length > 0 ? (
                    <div>
                        <h2 className="text-xl font-semibold text-white mb-4">
                            Active Notifications
                        </h2>
                        <div>
                            {sortedNotifications.map((notification) => (
                                <NotificationItem
                                    key={notification.id}
                                    notification={notification}
                                />
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <p className="text-zinc-400 text-lg">✓ All systems normal</p>
                        <p className="text-zinc-500 text-sm mt-2">
                            No notifications at this time
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
