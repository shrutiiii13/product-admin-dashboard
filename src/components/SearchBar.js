"use client";

export default function SearchBar({ value, onChange, hint }) {
  return (
    <div className="min-w-[180px] flex-1">
      <label htmlFor="product-search" className="mb-1 block text-sm font-medium text-slate-700">
        Search
      </label>
      <input
        id="product-search"
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Search products..."
        className="w-full rounded-md border border-border bg-white px-3 py-2 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-blue-100"
      />
      {hint && <p className="mt-1 text-xs text-amber-700">{hint}</p>}
    </div>
  );
}
