"use client";

export default function CategoryFilter({
  categories,
  value,
  onChange,
  loading,
  disabled,
}) {
  return (
    <div className="min-w-[160px]">
      <label
        htmlFor="category-filter"
        className="mb-1 block text-sm font-medium text-slate-700"
      >
        Category
      </label>
      <select
        id="category-filter"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        disabled={loading || disabled}
        className="w-full rounded-md border border-border bg-white px-3 py-2 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-100"
      >
        <option value="">All Categories</option>
        {categories.map((category) => (
          <option key={category.slug} value={category.slug}>
            {category.name}
          </option>
        ))}
      </select>
    </div>
  );
}
