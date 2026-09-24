"use client";

const SORT_OPTIONS = [
  { value: "", label: "Default" },
  { value: "price-asc", label: "Price Low → High" },
  { value: "price-desc", label: "Price High → Low" },
  { value: "rating-asc", label: "Rating Low → High" },
  { value: "rating-desc", label: "Rating High → Low" },
  { value: "title-asc", label: "Title A → Z" },
  { value: "title-desc", label: "Title Z → A" },
];

export default function SortSelect({ sort, order, onChange }) {
  const current = sort ? `${sort}-${order || "asc"}` : "";

  function handleChange(event) {
    const value = event.target.value;
    if (!value) {
      onChange({ sort: "", order: "asc" });
      return;
    }
    const [nextSort, nextOrder] = value.split("-");
    onChange({ sort: nextSort, order: nextOrder });
  }

  return (
    <div className="min-w-[180px]">
      <label
        htmlFor="sort-select"
        className="mb-1 block text-sm font-medium text-slate-700"
      >
        Sort
      </label>
      <select
        id="sort-select"
        value={current}
        onChange={handleChange}
        className="w-full rounded-md border border-border bg-white px-3 py-2 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-blue-100"
      >
        {SORT_OPTIONS.map((option) => (
          <option key={option.value || "default"} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
