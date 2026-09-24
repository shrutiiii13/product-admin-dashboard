"use client";

import Navbar from "@/components/Navbar";
import LoadingState from "@/components/LoadingState";
import { useAuthGuard } from "@/hooks/useAuthGuard";

export default function ProductsLayout({ children }) {
  const { ready } = useAuthGuard({ requireAuth: true });

  if (!ready) {
    return <LoadingState message="Checking authentication..." />;
  }

  return (
    <div className="flex min-h-full flex-1 flex-col">
      <Navbar />
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6">
        {children}
      </main>
    </div>
  );
}
