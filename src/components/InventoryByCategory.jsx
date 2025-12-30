"use client";

export default function InventoryByCategory({ data }) {
    if (!data || data.length === 0) {
        return (
            <div className="bg-gradient-to-br from-zinc-900 to-zinc-800 p-5 rounded-2xl shadow-md">
                <p className="text-zinc-400 text-xs uppercase tracking-wide">Inventory by Category</p>
                <p className="text-zinc-500 mt-3 text-sm">No category data</p>
            </div>
        );
    }

    return (
        <div className="bg-gradient-to-br from-zinc-900 to-zinc-800 p-5 rounded-2xl shadow-md">
            <p className="text-zinc-400 text-xs uppercase tracking-wide">Inventory by Category</p>
            <ul className="mt-5 space-y-4">
                {data.map((c) => (
                    <li key={c._id} className="flex justify-between items-start border-b border-zinc-700 pb-3 last:border-b-0">
                        <div>
                            <div className="text-white font-medium text-sm">{c.name || "Uncategorized"}</div>
                            <div className="text-zinc-500 text-xs mt-1">{c.count} products</div>
                        </div>
                        <div className="text-right">
                            <div className="text-white font-medium text-sm">{c.stock} pcs</div>
                            <div className="text-zinc-500 text-xs mt-1">₹ {c.value}</div>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}
