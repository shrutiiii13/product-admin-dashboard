import api from "@/lib/axios";

export async function getProducts({ limit, skip, signal } = {}) {
  const response = await api.get("/products", {
    params: { limit, skip },
    signal,
  });
  return response.data;
}

export async function searchProducts({ q, limit, skip, signal } = {}) {
  const response = await api.get("/products/search", {
    params: { q, limit, skip },
    signal,
  });
  return response.data;
}

export async function getProductsByCategory({
  category,
  limit,
  skip,
  signal,
} = {}) {
  const response = await api.get(`/products/category/${category}`, {
    params: { limit, skip },
    signal,
  });
  return response.data;
}

export async function getCategories(signal) {
  const response = await api.get("/products/categories", { signal });
  const data = response.data;

  // DummyJSON may return strings or { slug, name } objects
  return (data || []).map((item) => {
    if (typeof item === "string") {
      return { slug: item, name: item };
    }
    return {
      slug: item.slug || item.name,
      name: item.name || item.slug,
    };
  });
}

export async function getProductById(id, signal) {
  const response = await api.get(`/products/${id}`, { signal });
  return response.data;
}

export async function addProduct(productData) {
  const response = await api.post("/products/add", productData);
  return response.data;
}

export async function updateProduct(id, productData) {
  const response = await api.put(`/products/${id}`, productData);
  return response.data;
}

export async function deleteProduct(id) {
  const response = await api.delete(`/products/${id}`);
  return response.data;
}
