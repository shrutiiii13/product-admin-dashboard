"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { isAuthenticated } from "@/utils/auth";
import LoadingState from "@/components/LoadingState";

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated()) {
      router.replace("/products");
    } else {
      router.replace("/login");
    }
  }, [router]);

  return <LoadingState message="Redirecting..." />;
}
