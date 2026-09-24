"use client";

import { createContext, useContext, useMemo, useState, useCallback } from "react";

const ProductOverridesContext = createContext(null);

export function ProductOverridesProvider({ children }) {
  const [addedProducts, setAddedProducts] = useState([]);
  const [updatedProducts, setUpdatedProducts] = useState({});
  const [deletedIds, setDeletedIds] = useState([]);

  const addLocalProduct = useCallback((product) => {
    setAddedProducts((prev) => [product, ...prev]);
  }, []);

  const updateLocalProduct = useCallback((product) => {
    setUpdatedProducts((prev) => ({
      ...prev,
      [String(product.id)]: product,
    }));

    setAddedProducts((prev) =>
      prev.map((item) =>
        String(item.id) === String(product.id) ? { ...item, ...product } : item
      )
    );
  }, []);

  const deleteLocalProduct = useCallback((id) => {
    const key = String(id);
    setDeletedIds((prev) => (prev.includes(key) ? prev : [...prev, key]));
    setAddedProducts((prev) => prev.filter((item) => String(item.id) !== key));
    setUpdatedProducts((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
  }, []);

  const applyOverridesToList = useCallback(
    (products) => {
      return (products || [])
        .filter((product) => !deletedIds.includes(String(product.id)))
        .map((product) => {
          const override = updatedProducts[String(product.id)];
          return override ? { ...product, ...override } : product;
        });
    },
    [deletedIds, updatedProducts]
  );

  const getLocalProduct = useCallback(
    (id) => {
      const key = String(id);
      if (deletedIds.includes(key)) return { deleted: true };

      const added = addedProducts.find((item) => String(item.id) === key);
      if (added) {
        return { product: updatedProducts[key] ? { ...added, ...updatedProducts[key] } : added };
      }

      if (updatedProducts[key]) {
        return { product: updatedProducts[key], isPartial: true };
      }

      return null;
    },
    [addedProducts, updatedProducts, deletedIds]
  );

  const value = useMemo(
    () => ({
      addedProducts,
      deletedIds,
      addLocalProduct,
      updateLocalProduct,
      deleteLocalProduct,
      applyOverridesToList,
      getLocalProduct,
    }),
    [
      addedProducts,
      deletedIds,
      addLocalProduct,
      updateLocalProduct,
      deleteLocalProduct,
      applyOverridesToList,
      getLocalProduct,
    ]
  );

  return (
    <ProductOverridesContext.Provider value={value}>
      {children}
    </ProductOverridesContext.Provider>
  );
}

export function useProductOverrides() {
  const context = useContext(ProductOverridesContext);
  if (!context) {
    throw new Error(
      "useProductOverrides must be used within ProductOverridesProvider"
    );
  }
  return context;
}
