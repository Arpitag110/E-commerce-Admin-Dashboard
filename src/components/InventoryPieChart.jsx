"use client";

import {
  PieChart,
  Pie,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

const COLORS = ["#2563eb", "#16a34a", "#9333ea", "#f59e0b"];

export default function InventoryPieChart({ products }) {
  const data = products.map((p) => ({
    name: p.name,
    value: p.price * p.stock,
  }));

  if (data.length === 0) {
    return (
      <div className="w-full h-72 flex items-center justify-center text-zinc-400">
        No data available
      </div>
    );
  }

  return (
    <div className="w-full" style={{ height: "288px", minHeight: "288px" }}>
      <ResponsiveContainer width="100%" height={288}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            outerRadius={100}
            label
          >
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
