export const VALID_PAGE_SIZES = [10, 20, 50];
export const DEFAULT_LIMIT = 10;

export function parseLimit(value) {
  const limit = Number(value);
  if (VALID_PAGE_SIZES.includes(limit)) return limit;
  return DEFAULT_LIMIT;
}

export function parsePage(value) {
  const page = Number(value);
  if (!Number.isInteger(page) || page < 1) return 1;
  return page;
}

export function parseSort(sort, order) {
  const allowedSorts = ["price", "rating", "title"];
  const allowedOrders = ["asc", "desc"];

  const safeSort = allowedSorts.includes(sort) ? sort : "";
  const safeOrder = allowedOrders.includes(order) ? order : "asc";

  return { sort: safeSort, order: safeOrder };
}

export function parseSearchParams(searchParams) {
  const page = parsePage(searchParams.get("page"));
  const limit = parseLimit(searchParams.get("limit"));
  const search = (searchParams.get("search") || "").trim();
  const category = searchParams.get("category") || "";
  const { sort, order } = parseSort(
    searchParams.get("sort") || "",
    searchParams.get("order") || "asc"
  );

  return { page, limit, search, category, sort, order };
}

export function buildProductsQuery({
  page,
  limit,
  search,
  category,
  sort,
  order,
}) {
  const params = new URLSearchParams();

  params.set("page", String(page));
  params.set("limit", String(limit));

  if (search) params.set("search", search);
  if (category) params.set("category", category);
  if (sort) {
    params.set("sort", sort);
    params.set("order", order || "asc");
  }

  return params.toString();
}

export function clampPage(page, total, limit) {
  const totalPages = Math.max(1, Math.ceil(total / limit) || 1);
  if (page > totalPages) return totalPages;
  if (page < 1) return 1;
  return page;
}
