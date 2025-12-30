"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function StockChart({ products }) {
  const data = products.map((p) => ({
    name: p.name,
    stock: p.stock,
  }));

  if (data.length === 0) {
    return (
      <div className="w-full h-80 flex items-center justify-center text-zinc-400">
        No data available
      </div>
    );
  }

  return (
    <div className="w-full" style={{ height: "320px", minHeight: "320px" }}>
      <ResponsiveContainer width="100%" height={320}>
        <BarChart data={data}>
          <XAxis dataKey="name" stroke="#a1a1aa" />
          <YAxis stroke="#a1a1aa" />
          <Tooltip
            contentStyle={{
              backgroundColor: "#18181b",
              border: "none",
              color: "white",
            }}
          />
          <Bar dataKey="stock" fill="#2563eb" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
