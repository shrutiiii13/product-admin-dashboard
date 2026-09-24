"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { clearAuth, getStoredUser } from "@/utils/auth";

export default function Navbar() {
  const router = useRouter();
  const user = getStoredUser();

  function handleLogout() {
    clearAuth();
    router.replace("/login");
  }

  return (
    <header className="border-b border-border bg-card">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <div className="flex items-center gap-4">
          <Link
            href="/products"
            className="text-lg font-semibold text-slate-900 hover:text-primary"
          >
            Product Admin
          </Link>
          <span className="hidden text-sm text-slate-500 sm:inline">
            Dashboard
          </span>
        </div>

        <div className="flex items-center gap-3">
          {user?.username && (
            <span className="hidden text-sm text-slate-600 sm:inline">
              {user.firstName || user.username}
            </span>
          )}
          <button
            type="button"
            onClick={handleLogout}
            className="rounded-md border border-border bg-white px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
