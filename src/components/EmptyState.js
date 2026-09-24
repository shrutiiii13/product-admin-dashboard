export default function EmptyState({
  title = "No products found.",
  description = "Try changing your search or clearing filters.",
  onClear,
}) {
  return (
    <div className="rounded-lg border border-dashed border-border bg-card px-6 py-14 text-center">
      <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
      <p className="mt-2 text-sm text-slate-600">{description}</p>
      {onClear && (
        <button
          type="button"
          onClick={onClear}
          className="mt-4 rounded-md bg-primary px-4 py-2 text-sm font-medium text-white transition hover:bg-primary-hover"
        >
          Clear filters
        </button>
      )}
    </div>
  );
}
