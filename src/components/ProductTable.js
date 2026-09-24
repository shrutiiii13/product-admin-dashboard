"use client";

import Link from "next/link";
import Image from "next/image";

export default function ProductTable({ products }) {
  return (
    <div className="hidden overflow-x-auto md:block">
      <table className="min-w-full divide-y divide-border text-left text-sm">
        <thead className="bg-slate-50 text-slate-600">
          <tr>
            <th className="px-4 py-3 font-medium">Image</th>
            <th className="px-4 py-3 font-medium">Title</th>
            <th className="px-4 py-3 font-medium">Category</th>
            <th className="px-4 py-3 font-medium">Price</th>
            <th className="px-4 py-3 font-medium">Rating</th>
            <th className="px-4 py-3 font-medium">Stock</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border bg-white">
          {products.map((product) => (
            <tr key={product.id} className="hover:bg-slate-50">
              <td className="px-4 py-3">
                <div className="relative h-12 w-12 overflow-hidden rounded-md bg-slate-100">
                  {product.thumbnail || product.images?.[0] ? (
                    <Image
                      src={product.thumbnail || product.images[0]}
                      alt={product.title}
                      fill
                      className="object-cover"
                      sizes="48px"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-xs text-slate-400">
                      N/A
                    </div>
                  )}
                </div>
              </td>
              <td className="px-4 py-3">
                <Link
                  href={`/products/${product.id}`}
                  className="font-medium text-primary hover:underline"
                >
                  {product.title}
                </Link>
              </td>
              <td className="px-4 py-3 capitalize text-slate-700">
                {product.category}
              </td>
              <td className="px-4 py-3 text-slate-700">
                ₹{Number(product.price).toFixed(2)}
              </td>
              <td className="px-4 py-3 text-slate-700">{product.rating}</td>
              <td className="px-4 py-3 text-slate-700">{product.stock}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
