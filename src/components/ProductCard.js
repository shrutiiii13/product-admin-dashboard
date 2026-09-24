"use client";

import Link from "next/link";
import Image from "next/image";

export default function ProductCard({ product }) {
  return (
    <Link
      href={`/products/${product.id}`}
      className="block overflow-hidden rounded-lg border border-border bg-white shadow-sm transition hover:shadow-md"
    >
      <div className="relative h-40 w-full bg-slate-100">
        {product.thumbnail || product.images?.[0] ? (
          <Image
            src={product.thumbnail || product.images[0]}
            alt={product.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-slate-400">
            No image
          </div>
        )}
      </div>
      <div className="space-y-1 p-4">
        <h3 className="line-clamp-2 font-semibold text-slate-900">
          {product.title}
        </h3>
        <p className="text-sm capitalize text-slate-500">{product.category}</p>
        <div className="flex flex-wrap items-center gap-3 pt-1 text-sm text-slate-700">
          <span className="font-medium">₹{Number(product.price).toFixed(2)}</span>
          <span>★ {product.rating}</span>
          <span>Stock: {product.stock}</span>
        </div>
      </div>
    </Link>
  );
}
