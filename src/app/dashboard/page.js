import { connectDB } from "@/lib/db";
import Product from "@/models/Product";
import Category from "@/models/Category";
import StockChart from "@/components/StockChart";
import InventoryPieChart from "@/components/InventoryPieChart";
import KpiCard from "@/components/KpiCard";
import InventoryByCategory from "@/components/InventoryByCategory";
import { getLowStockThreshold } from "@/lib/notificationHelpers";

export default async function DashboardPage() {
  await connectDB();

  // ✅ Convert mongoose docs → plain objects
  const products = JSON.parse(JSON.stringify(await Product.find().lean()));

  const totalProducts = products.length;
  const totalStock = products.reduce((sum, p) => sum + (p.stock || 0), 0);
  const totalValue = products.reduce(
    (sum, p) => sum + (p.price || 0) * (p.stock || 0),
    0
  );

  const lowStockThreshold = getLowStockThreshold();
  const outOfStockCount = products.filter((p) => (p.stock || 0) === 0).length;
  const lowStockCount = products.filter((p) => (p.stock || 0) > 0 && p.stock <= lowStockThreshold).length;

  // Highest value product (price * stock)
  let highestValueProduct = null;
  products.forEach((p) => {
    const val = (p.price || 0) * (p.stock || 0);
    if (!highestValueProduct || val > highestValueProduct.value) {
      highestValueProduct = { _id: p._id, name: p.name, value: val };
    }
  });

  // Inventory by category
  const categories = JSON.parse(JSON.stringify(await Category.find().lean()));
  const inventoryByCategory = categories.map((c) => {
    const items = products.filter((p) => p.category && String(p.category) === String(c._id));
    const stock = items.reduce((s, it) => s + (it.stock || 0), 0);
    const value = items.reduce((s, it) => s + (it.price || 0) * (it.stock || 0), 0);
    return { _id: c._id, name: c.name, stock, value, count: items.length };
  });

  // Uncategorized bucket
  const uncategorizedItems = products.filter((p) => !p.category);
  if (uncategorizedItems.length > 0) {
    const stock = uncategorizedItems.reduce((s, it) => s + (it.stock || 0), 0);
    const value = uncategorizedItems.reduce((s, it) => s + (it.price || 0) * (it.stock || 0), 0);
    inventoryByCategory.push({ _id: "uncat", name: "Uncategorized", stock, value, count: uncategorizedItems.length });
  }

  return (
    <div className="p-8 space-y-12">
      <h1 className="text-4xl font-bold text-white">Dashboard</h1>

      {/* ===== PRIMARY STATS ===== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <KpiCard title="Total Products" value={totalProducts} />
        <KpiCard title="Total Stock" value={totalStock} />
        <KpiCard title="Inventory Value" value={`₹ ${totalValue}`} />
      </div>

      {/* ===== SECONDARY METRICS ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <KpiCard title="Out of Stock" value={outOfStockCount}>
          <div className="mt-5 pt-5 border-t border-zinc-700">
            <p className="text-zinc-400 text-xs uppercase tracking-wide">Low Stock</p>
            <p className="text-3xl font-bold text-white mt-2">{lowStockCount}</p>
            <p className="text-zinc-500 text-xs mt-1">Threshold: {lowStockThreshold}</p>
          </div>
        </KpiCard>
        <InventoryByCategory data={inventoryByCategory} />
      </div>

      {/* ===== CHARTS ===== */}
      <div className="pt-4">
        <h2 className="text-lg font-semibold text-zinc-300 mb-6">Charts</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Bar Chart */}
          <div className="bg-gradient-to-br from-zinc-900 to-zinc-800 p-8 rounded-2xl shadow-lg">
            <h3 className="text-lg font-medium text-white mb-6">
              Stock per Product
            </h3>
            <StockChart products={products} />
          </div>

          {/* Pie Chart */}
          <div className="bg-gradient-to-br from-zinc-900 to-zinc-800 p-8 rounded-2xl shadow-lg">
            <h3 className="text-lg font-medium text-white mb-6">
              Inventory Distribution
            </h3>
            <InventoryPieChart products={products} />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ===== REUSABLE STAT CARD ===== */
function StatCard({ title, value }) {
  return (
    <div className="bg-gradient-to-br from-zinc-900 to-zinc-800 p-6 rounded-2xl shadow-lg">
      <p className="text-zinc-400 text-sm">{title}</p>
      <p className="text-3xl font-bold text-white mt-2">{value}</p>
    </div>
  );
}

