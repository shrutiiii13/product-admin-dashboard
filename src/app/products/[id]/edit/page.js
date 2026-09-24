"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import ProductForm from "@/components/ProductForm";
import LoadingState from "@/components/LoadingState";
import ErrorState from "@/components/ErrorState";
import { useProductOverrides } from "@/context/ProductOverridesContext";
import {
  getCategories,
  getProductById,
  updateProduct,
} from "@/services/productService";

export default function EditProductPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params.id;
  const { getLocalProduct, updateLocalProduct } = useProductOverrides();

  const [product, setProduct] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notFound, setNotFound] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    async function loadData() {
      setLoading(true);
      setError("");
      setNotFound(false);

      const local = getLocalProduct(productId);
      if (local?.deleted) {
        setNotFound(true);
        setLoading(false);
        return;
      }

      try {
        const [categoryList, productData] = await Promise.all([
          getCategories(controller.signal),
          local?.product && !local.isPartial
            ? Promise.resolve(local.product)
            : getProductById(productId, controller.signal).then((data) =>
                local?.product ? { ...data, ...local.product } : data
              ),
        ]);

        setCategories(categoryList);
        setProduct(productData);
      } catch (err) {
        if (err.code === "ERR_CANCELED" || err.name === "CanceledError") return;

        if (err.status === 404 || err.response?.status === 404) {
          setNotFound(true);
        } else {
          setError(err.friendlyMessage || "Failed to load product.");
        }
      } finally {
        setLoading(false);
      }
    }

    loadData();
    return () => controller.abort();
  }, [productId, reloadKey, getLocalProduct]);

  async function handleSubmit(values) {
    if (submitting) return;
    setSubmitting(true);
    setSuccessMessage("");

    try {
      const updated = await updateProduct(productId, values);
      const merged = {
        ...product,
        ...updated,
        ...values,
        id: product.id,
      };

      updateLocalProduct(merged);
      setProduct(merged);
      setSuccessMessage(
        "Product updated for this session. DummyJSON does not permanently save edits."
      );

      setTimeout(() => {
        router.push(`/products/${productId}`);
      }, 900);
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return <LoadingState message="Loading product..." />;
  }

  if (notFound) {
    return (
      <div className="rounded-lg border border-border bg-card px-6 py-14 text-center">
        <h1 className="text-xl font-semibold text-slate-900">
          Product Not Found
        </h1>
        <Link
          href="/products"
          className="mt-4 inline-flex rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-hover"
        >
          Back to products
        </Link>
      </div>
    );
  }

  if (error) {
    return (
      <ErrorState
        message={error}
        onRetry={() => setReloadKey((value) => value + 1)}
      />
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <Link
          href={`/products/${productId}`}
          className="text-sm font-medium text-primary hover:underline"
        >
          ← Back to product
        </Link>
        <h1 className="mt-3 text-2xl font-semibold text-slate-900">
          Edit Product
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          Updates are reflected in this browser session only.
        </p>
      </div>

      {successMessage && (
        <div className="rounded-md border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-800">
          {successMessage}
        </div>
      )}

      <div className="rounded-lg border border-border bg-card p-4 sm:p-6">
        <ProductForm
          key={product.id}
          initialValues={product}
          categories={categories}
          submitLabel="Save Changes"
          loading={submitting}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
}
