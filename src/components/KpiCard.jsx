"use client";

export default function KpiCard({ title, value, subtitle, children }) {
    return (
        <div className="bg-gradient-to-br from-zinc-900 to-zinc-800 p-5 rounded-2xl shadow-md hover:shadow-lg transition-shadow min-h-[140px] flex flex-col justify-start">
            <p className="text-zinc-400 text-xs uppercase tracking-wide">{title}</p>
            <p className="text-3xl font-bold text-white mt-3">{value}</p>
            {subtitle && <p className="text-zinc-500 text-xs mt-2">{subtitle}</p>}
            {children}
        </div>
    );
}
