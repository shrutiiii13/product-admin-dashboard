"use client";

function getPageNumbers(currentPage, totalPages) {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const pages = new Set([1, totalPages, currentPage]);
  for (let offset = -1; offset <= 1; offset += 1) {
    const page = currentPage + offset;
    if (page > 1 && page < totalPages) pages.add(page);
  }

  return Array.from(pages).sort((a, b) => a - b);
}

export default function Pagination({
  page,
  limit,
  total,
  onPageChange,
  onLimitChange,
}) {
  const totalPages = Math.max(1, Math.ceil(total / limit) || 1);
  const safePage = Math.min(Math.max(page, 1), totalPages);
  const start = total === 0 ? 0 : (safePage - 1) * limit + 1;
  const end = Math.min(safePage * limit, total);
  const pageNumbers = getPageNumbers(safePage, totalPages);

  return (
    <div className="flex flex-col gap-4 border-t border-border bg-card px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-slate-600">
        Showing {start}–{end} of {total}
      </p>

      <div className="flex flex-wrap items-center gap-3">
        <label className="flex items-center gap-2 text-sm text-slate-700">
          Page size
          <select
            value={limit}
            onChange={(event) => onLimitChange(Number(event.target.value))}
            className="rounded-md border border-border bg-white px-2 py-1.5 text-sm outline-none focus:border-primary"
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </label>

        <div className="flex flex-wrap items-center gap-1">
          <button
            type="button"
            onClick={() => onPageChange(safePage - 1)}
            disabled={safePage <= 1}
            className="rounded-md border border-border px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Previous
          </button>

          {pageNumbers.map((pageNumber, index) => {
            const previous = pageNumbers[index - 1];
            const showEllipsis = previous && pageNumber - previous > 1;

            return (
              <span key={pageNumber} className="flex items-center gap-1">
                {showEllipsis && (
                  <span className="px-1 text-slate-400">…</span>
                )}
                <button
                  type="button"
                  onClick={() => onPageChange(pageNumber)}
                  className={`min-w-9 rounded-md border px-2.5 py-1.5 text-sm font-medium transition ${
                    pageNumber === safePage
                      ? "border-primary bg-primary text-white"
                      : "border-border text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  {pageNumber}
                </button>
              </span>
            );
          })}

          <button
            type="button"
            onClick={() => onPageChange(safePage + 1)}
            disabled={safePage >= totalPages}
            className="rounded-md border border-border px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
