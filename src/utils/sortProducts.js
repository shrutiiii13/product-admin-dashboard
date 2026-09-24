export function sortProducts(products, sort, order) {
  if (!sort || !Array.isArray(products)) return products;

  const direction = order === "desc" ? -1 : 1;
  const sorted = [...products];

  sorted.sort((a, b) => {
    let left = a[sort];
    let right = b[sort];

    if (sort === "title") {
      left = String(left || "").toLowerCase();
      right = String(right || "").toLowerCase();
      if (left < right) return -1 * direction;
      if (left > right) return 1 * direction;
      return 0;
    }

    left = Number(left) || 0;
    right = Number(right) || 0;
    return (left - right) * direction;
  });

  return sorted;
}
