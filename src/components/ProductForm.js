"use client";

import { useState } from "react";

const EMPTY_VALUES = {
  title: "",
  description: "",
  price: "",
  category: "",
  stock: "",
};

function mapInitialValues(initialValues) {
  if (!initialValues) return EMPTY_VALUES;

  return {
    title: initialValues.title || "",
    description: initialValues.description || "",
    price:
      initialValues.price === undefined || initialValues.price === null
        ? ""
        : String(initialValues.price),
    category: initialValues.category || "",
    stock:
      initialValues.stock === undefined || initialValues.stock === null
        ? ""
        : String(initialValues.stock),
  };
}

function validate(values) {
  const errors = {};

  if (!values.title.trim()) {
    errors.title = "Title is required.";
  }

  if (!values.description.trim()) {
    errors.description = "Description is required.";
  }

  if (!values.category.trim()) {
    errors.category = "Category is required.";
  }

  const price = Number(values.price);
  if (values.price === "" || Number.isNaN(price) || price <= 0) {
    errors.price = "Price must be a valid positive number.";
  }

  const stock = Number(values.stock);
  if (values.stock === "" || !Number.isInteger(stock) || stock < 0) {
    errors.stock = "Stock must be a valid non-negative integer.";
  }

  return errors;
}

export default function ProductForm({
  initialValues,
  categories = [],
  submitLabel = "Save",
  loading = false,
  onSubmit,
}) {
  const [values, setValues] = useState(() => mapInitialValues(initialValues));
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");

  function handleChange(event) {
    const { name, value } = event.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
    setFormError("");
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (loading) return;

    const nextErrors = validate(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    try {
      await onSubmit({
        title: values.title.trim(),
        description: values.description.trim(),
        category: values.category.trim(),
        price: Number(values.price),
        stock: Number(values.stock),
      });
    } catch (error) {
      setFormError(error.friendlyMessage || "Failed to save product.");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      {formError && (
        <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {formError}
        </div>
      )}

      <div>
        <label htmlFor="title" className="mb-1 block text-sm font-medium text-slate-700">
          Title
        </label>
        <input
          id="title"
          name="title"
          value={values.title}
          onChange={handleChange}
          className="w-full rounded-md border border-border px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-blue-100"
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-600">{errors.title}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="description"
          className="mb-1 block text-sm font-medium text-slate-700"
        >
          Description
        </label>
        <textarea
          id="description"
          name="description"
          rows={4}
          value={values.description}
          onChange={handleChange}
          className="w-full rounded-md border border-border px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-blue-100"
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600">{errors.description}</p>
        )}
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label
            htmlFor="price"
            className="mb-1 block text-sm font-medium text-slate-700"
          >
            Price
          </label>
          <input
            id="price"
            name="price"
            type="number"
            min="0"
            step="0.01"
            value={values.price}
            onChange={handleChange}
            className="w-full rounded-md border border-border px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-blue-100"
          />
          {errors.price && (
            <p className="mt-1 text-sm text-red-600">{errors.price}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="stock"
            className="mb-1 block text-sm font-medium text-slate-700"
          >
            Stock
          </label>
          <input
            id="stock"
            name="stock"
            type="number"
            min="0"
            step="1"
            value={values.stock}
            onChange={handleChange}
            className="w-full rounded-md border border-border px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-blue-100"
          />
          {errors.stock && (
            <p className="mt-1 text-sm text-red-600">{errors.stock}</p>
          )}
        </div>
      </div>

      <div>
        <label
          htmlFor="category"
          className="mb-1 block text-sm font-medium text-slate-700"
        >
          Category
        </label>
        {categories.length > 0 ? (
          <select
            id="category"
            name="category"
            value={values.category}
            onChange={handleChange}
            className="w-full rounded-md border border-border px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-blue-100"
          >
            <option value="">Select a category</option>
            {categories.map((category) => (
              <option key={category.slug} value={category.slug}>
                {category.name}
              </option>
            ))}
          </select>
        ) : (
          <input
            id="category"
            name="category"
            value={values.category}
            onChange={handleChange}
            className="w-full rounded-md border border-border px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-blue-100"
          />
        )}
        {errors.category && (
          <p className="mt-1 text-sm text-red-600">{errors.category}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-white transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "Saving..." : submitLabel}
      </button>
    </form>
  );
}
