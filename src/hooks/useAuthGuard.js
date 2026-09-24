"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { isAuthenticated } from "@/utils/auth";

export function useAuthGuard({ requireAuth = true } = {}) {
  const router = useRouter();
  const pathname = usePathname();
  const [ready, setReady] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const loggedIn = isAuthenticated();

    if (requireAuth && !loggedIn) {
      router.replace("/login");
      return () => {
        cancelled = true;
      };
    }

    if (!requireAuth && loggedIn && pathname === "/login") {
      router.replace("/products");
      return () => {
        cancelled = true;
      };
    }

    // Defer state updates so they are not synchronous inside the effect body
    Promise.resolve().then(() => {
      if (cancelled) return;
      setAuthenticated(loggedIn);
      setReady(true);
    });

    return () => {
      cancelled = true;
    };
  }, [requireAuth, router, pathname]);

  return { ready, authenticated };
}
