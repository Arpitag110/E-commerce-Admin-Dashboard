import { connectDB } from "@/lib/db";
import Product from "@/models/Product";
import StockChart from "@/components/StockChart";
import InventoryPieChart from "@/components/InventoryPieChart";

export default async function DashboardPage() {
  await connectDB();

  // ✅ Convert mongoose docs → plain objects
  const products = JSON.parse(
    JSON.stringify(await Product.find().lean())
  );

  const totalProducts = products.length;
  const totalStock = products.reduce((sum, p) => sum + p.stock, 0);
  const totalValue = products.reduce(
    (sum, p) => sum + p.price * p.stock,
    0
  );

  return (
    <div className="p-8 space-y-10">
      <h1 className="text-3xl font-semibold text-white">Dashboard</h1>

      {/* ===== STATS ===== */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Total Products" value={totalProducts} />
        <StatCard title="Total Stock" value={totalStock} />
        <StatCard title="Inventory Value" value={`₹ ${totalValue}`} />
      </div>

      {/* ===== CHARTS ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Bar Chart */}
        <div className="bg-gradient-to-br from-zinc-900 to-zinc-800 p-6 rounded-2xl shadow-lg">
          <h2 className="text-xl font-medium text-white mb-4">
            Stock per Product
          </h2>
          <StockChart products={products} />
        </div>

        {/* Pie Chart */}
        <div className="bg-gradient-to-br from-zinc-900 to-zinc-800 p-6 rounded-2xl shadow-lg">
          <h2 className="text-xl font-medium text-white mb-4">
            Inventory Distribution
          </h2>
          <InventoryPieChart products={products} />
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

