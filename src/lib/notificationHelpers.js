// Define low stock threshold (you can adjust this)
const LOW_STOCK_THRESHOLD =5;

export function generateNotifications(products, categories) {
    const notifications = [];

    // Check for low stock products
    const lowStockProducts = products.filter((p) => p.stock <= LOW_STOCK_THRESHOLD);

    if (lowStockProducts.length > 0) {
        lowStockProducts.forEach((product) => {
            notifications.push({
                id: `low-stock-${product._id}`,
                type: "low-stock",
                title: "Low Stock Alert",
                message: `${product.name} has only ${product.stock} items left in stock`,
                productId: product._id,
                productName: product.name,
                stock: product.stock,
                severity: product.stock === 0 ? "critical" : "warning",
                timestamp: product.updatedAt,
            });
        });
    }

    // Check for products without category
    const uncategorizedProducts = products.filter((p) => !p.category);

    if (uncategorizedProducts.length > 0) {
        notifications.push({
            id: "uncategorized",
            type: "uncategorized",
            title: "Uncategorized Products",
            message: `${uncategorizedProducts.length} product(s) without a category assigned`,
            count: uncategorizedProducts.length,
            severity: "info",
            timestamp: new Date(),
        });
    }

    // Check for products without images
    const noImageProducts = products.filter((p) => !p.imageUrl);

    if (noImageProducts.length > 0) {
        notifications.push({
            id: "no-image",
            type: "no-image",
            title: "Missing Product Images",
            message: `${noImageProducts.length} product(s) have no image uploaded`,
            count: noImageProducts.length,
            severity: "info",
            timestamp: new Date(),
        });
    }

    return notifications;
}

export function getNotificationColor(severity) {
    switch (severity) {
        case "critical":
            return "bg-red-900 border-red-700";
        case "warning":
            return "bg-yellow-900 border-yellow-700";
        case "info":
            return "bg-blue-900 border-blue-700";
        default:
            return "bg-zinc-800 border-zinc-700";
    }
}

export function getNotificationBadgeColor(severity) {
    switch (severity) {
        case "critical":
            return "bg-red-600";
        case "warning":
            return "bg-yellow-600";
        case "info":
            return "bg-blue-600";
        default:
            return "bg-zinc-600";
    }
}

export function getLowStockThreshold() {
    return LOW_STOCK_THRESHOLD;
}
