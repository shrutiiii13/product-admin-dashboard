"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ProductForm from "@/components/ProductForm";
import LoadingState from "@/components/LoadingState";
import { useProductOverrides } from "@/context/ProductOverridesContext";
import { addProduct, getCategories } from "@/services/productService";

export default function NewProductPage() {
  const router = useRouter();
  const { addLocalProduct } = useProductOverrides();

  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadCategories() {
      try {
        const data = await getCategories();
        if (!cancelled) setCategories(data);
      } catch {
        if (!cancelled) setCategories([]);
      } finally {
        if (!cancelled) setLoadingCategories(false);
      }
    }

    loadCategories();
    return () => {
      cancelled = true;
    };
  }, []);

  async function handleSubmit(values) {
    if (submitting) return;
    setSubmitting(true);
    setSuccessMessage("");

    try {
      const created = await addProduct(values);
      const localProduct = {
        ...created,
        ...values,
        id: created.id || Date.now(),
        thumbnail: created.thumbnail || "",
        images: created.images || [],
        rating: created.rating ?? 0,
        reviews: created.reviews || [],
      };

      addLocalProduct(localProduct);
      setSuccessMessage(
        "Product added for this session. DummyJSON does not permanently save new products."
      );

      setTimeout(() => {
        router.push("/products");
      }, 900);
    } finally {
      setSubmitting(false);
    }
  }

  if (loadingCategories) {
    return <LoadingState message="Loading form..." />;
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <Link
          href="/products"
          className="text-sm font-medium text-primary hover:underline"
        >
          ← Back to products
        </Link>
        <h1 className="mt-3 text-2xl font-semibold text-slate-900">
          Add Product
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          Create a product. Changes are shown in this session only.
        </p>
      </div>

      {successMessage && (
        <div className="rounded-md border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-800">
          {successMessage}
        </div>
      )}

      <div className="rounded-lg border border-border bg-card p-4 sm:p-6">
        <ProductForm
          categories={categories}
          submitLabel="Save Product"
          loading={submitting}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
}
