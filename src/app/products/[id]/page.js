"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import ConfirmDialog from "@/components/ConfirmDialog";
import LoadingState from "@/components/LoadingState";
import ErrorState from "@/components/ErrorState";
import { useProductOverrides } from "@/context/ProductOverridesContext";
import { deleteProduct, getProductById } from "@/services/productService";

export default function ProductDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params.id;
  const { getLocalProduct, deleteLocalProduct, updateLocalProduct } =
    useProductOverrides();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notFound, setNotFound] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function loadProduct() {
      setLoading(true);
      setError("");
      setNotFound(false);

      const local = getLocalProduct(productId);
      if (local?.deleted) {
        setNotFound(true);
        setProduct(null);
        setLoading(false);
        return;
      }

      // Fully local (session-added) product
      if (local?.product && !local.isPartial) {
        setProduct(local.product);
        setSelectedImage(
          local.product.thumbnail || local.product.images?.[0] || ""
        );
        setLoading(false);
        return;
      }

      try {
        const data = await getProductById(productId, controller.signal);
        const merged = local?.product ? { ...data, ...local.product } : data;
        setProduct(merged);
        setSelectedImage(merged.thumbnail || merged.images?.[0] || "");
        if (local?.isPartial) {
          updateLocalProduct(merged);
        }
      } catch (err) {
        if (err.code === "ERR_CANCELED" || err.name === "CanceledError") return;

        if (err.status === 404 || err.response?.status === 404) {
          setNotFound(true);
        } else {
          setError(err.friendlyMessage || "Failed to load product.");
        }
        setProduct(null);
      } finally {
        setLoading(false);
      }
    }

    loadProduct();
    return () => controller.abort();
  }, [productId, reloadKey, getLocalProduct, updateLocalProduct]);

  async function handleDelete() {
    if (deleting) return;
    setDeleting(true);

    try {
      const local = getLocalProduct(productId);
      // Session-only products may not exist on DummyJSON; still remove from UI
      if (!local?.product || local.isPartial) {
        try {
          await deleteProduct(productId);
        } catch {
          // Simulated delete: continue updating local UI state
        }
      }

      deleteLocalProduct(productId);
      setConfirmOpen(false);
      router.replace("/products");
    } catch (err) {
      setConfirmOpen(false);
      setError(err.friendlyMessage || "Failed to delete product.");
    } finally {
      setDeleting(false);
    }
  }

  if (loading) {
    return <LoadingState message="Loading product details..." />;
  }

  if (notFound) {
    return (
      <div className="rounded-lg border border-border bg-card px-6 py-14 text-center">
        <h1 className="text-xl font-semibold text-slate-900">
          Product Not Found
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          The product you are looking for does not exist or was removed in this
          session.
        </p>
        <Link
          href="/products"
          className="mt-4 inline-flex rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-hover"
        >
          Back to products
        </Link>
      </div>
    );
  }

  if (error && !product) {
    return (
      <ErrorState
        message={error}
        onRetry={() => setReloadKey((value) => value + 1)}
      />
    );
  }

  if (!product) return null;

  const images = product.images?.length
    ? product.images
    : product.thumbnail
      ? [product.thumbnail]
      : [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Link
          href="/products"
          className="text-sm font-medium text-primary hover:underline"
        >
          ← Back to products
        </Link>
        <div className="flex flex-wrap gap-2">
          <Link
            href={`/products/${product.id}/edit`}
            className="rounded-md border border-border bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            Edit
          </Link>
          <button
            type="button"
            onClick={() => setConfirmOpen(true)}
            className="rounded-md bg-danger px-4 py-2 text-sm font-medium text-white transition hover:bg-danger-hover"
          >
            Delete
          </button>
        </div>
      </div>

      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="grid gap-6 rounded-lg border border-border bg-card p-4 lg:grid-cols-2 lg:p-6">
        <div>
          <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-slate-100">
            {selectedImage ? (
              <Image
                src={selectedImage}
                alt={product.title}
                fill
                className="object-contain"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
            ) : (
              <div className="flex h-full items-center justify-center text-slate-400">
                No image
              </div>
            )}
          </div>
          {images.length > 1 && (
            <div className="mt-3 flex gap-2 overflow-x-auto">
              {images.map((image) => (
                <button
                  key={image}
                  type="button"
                  onClick={() => setSelectedImage(image)}
                  className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-md border ${
                    selectedImage === image
                      ? "border-primary"
                      : "border-border"
                  }`}
                >
                  <Image
                    src={image}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div>
            <p className="text-sm capitalize text-slate-500">
              {product.category}
            </p>
            <h1 className="mt-1 text-2xl font-semibold text-slate-900">
              {product.title}
            </h1>
          </div>

          <p className="text-sm leading-6 text-slate-700">
            {product.description}
          </p>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            <div className="rounded-md bg-slate-50 p-3">
              <p className="text-xs text-slate-500">Price</p>
              <p className="font-semibold text-slate-900">
                ${Number(product.price).toFixed(2)}
              </p>
            </div>
            <div className="rounded-md bg-slate-50 p-3">
              <p className="text-xs text-slate-500">Rating</p>
              <p className="font-semibold text-slate-900">{product.rating}</p>
            </div>
            <div className="rounded-md bg-slate-50 p-3">
              <p className="text-xs text-slate-500">Stock</p>
              <p className="font-semibold text-slate-900">{product.stock}</p>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-slate-900">Reviews</h2>
            {product.reviews?.length ? (
              <ul className="mt-3 space-y-3">
                {product.reviews.map((review, index) => (
                  <li
                    key={`${review.reviewerEmail || review.reviewerName}-${index}`}
                    className="rounded-md border border-border p-3"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-medium text-slate-800">
                        {review.reviewerName || "Anonymous"}
                      </p>
                      <p className="text-sm text-slate-600">★ {review.rating}</p>
                    </div>
                    <p className="mt-1 text-sm text-slate-600">{review.comment}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-2 text-sm text-slate-500">No reviews available.</p>
            )}
          </div>
        </div>
      </div>

      <ConfirmDialog
        open={confirmOpen}
        title="Delete product"
        message="Are you sure you want to delete this product?"
        loading={deleting}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={handleDelete}
      />
    </div>
  );
}
